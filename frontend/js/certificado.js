(() => {
  const certificadoMensaje = document.getElementById('certificadoMensaje');
  const certificadoCard = document.getElementById('certificadoCard');
  const certificadoFondo = document.getElementById('certificadoFondo');
  const certificadoAlumno = document.getElementById('certificadoAlumno');
  const certificadoCurso = document.getElementById('certificadoCurso');
  const certificadoInstructor = document.getElementById('certificadoInstructor');
  const certificadoCalificacion = document.getElementById('certificadoCalificacion');
  const certificadoFecha = document.getElementById('certificadoFecha');
  const certificadoCodigo = document.getElementById('certificadoCodigo');
  const btnImprimirCertificado = document.getElementById('btnImprimirCertificado');
  const btnDescargarCertificado = document.getElementById('btnDescargarCertificado');
  const btnToggleCompartirCertificado = document.getElementById('btnToggleCompartirCertificado');
  const btnCopiarCompartirCertificado = document.getElementById('btnCopiarCompartirCertificado');
  const certificadoAcciones = document.getElementById('certificadoAcciones');

  let compartirActivo = false;

  const esperar = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const conTimeout = (promesa, ms, valorFallback = null) => Promise.race([
    promesa,
    esperar(ms).then(() => valorFallback)
  ]);

  const recursosCertificado = [
    'assets/img/certificados/fondo-certificado.jpg?v=16-39',
    'assets/img/certificados/copa-certificado.png?v=16-39'
  ];

  const precargarImagen = (ruta) => new Promise((resolve) => {
    const imagen = new Image();
    imagen.onload = resolve;
    imagen.onerror = resolve;
    imagen.src = ruta;
  });

  const esperarImagenElemento = (imagen) => new Promise((resolve) => {
    if (!imagen) {
      resolve();
      return;
    }

    if (imagen.complete && imagen.naturalWidth > 0) {
      resolve();
      return;
    }

    imagen.onload = resolve;
    imagen.onerror = resolve;
  });

  const prepararRecursosCertificado = async () => {
    await Promise.all([
      ...recursosCertificado.map(precargarImagen),
      esperarImagenElemento(certificadoFondo)
    ]);

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (error) {
        // No detenemos la carga visual si el navegador no puede confirmar fuentes.
      }
    }
  };

  const finalizarCargaCertificado = () => {
    document.body.classList.remove('certificado-loading');
    document.body.classList.add('certificado-ready');
  };

  const mostrarCertificadoCompleto = async () => {
    await prepararRecursosCertificado();

    if (certificadoCard) {
      certificadoCard.style.display = 'block';
      certificadoCard.classList.add('is-visible');
    }

    requestAnimationFrame(() => {
      finalizarCargaCertificado();
    });
  };

  const obtenerParametro = (clave) => {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(clave) || '';
  };

  const obtenerJSON = (clave, valorDefault) => {
    const valor = localStorage.getItem(clave) || sessionStorage.getItem(clave);

    if (!valor) {
      return valorDefault;
    }

    try {
      return JSON.parse(valor);
    } catch (error) {
      return valorDefault;
    }
  };

  const obtenerIdUsuarioActual = () => {
    if (window.EduTech && typeof window.EduTech.obtenerIdUsuarioSesion === 'function') {
      const id = window.EduTech.obtenerIdUsuarioSesion();

      if (id) {
        return id;
      }
    }

    const usuario = obtenerJSON('edutech_usuario', null);
    return usuario ? (usuario.id_usuario || usuario.id || '') : '';
  };

  const esFechaValida = (fecha) => {
    if (!fecha) {
      return false;
    }

    const valor = new Date(fecha);
    return !Number.isNaN(valor.getTime());
  };

  const formatearFecha = (fecha) => {
    if (!esFechaValida(fecha)) {
      return 'Fecha no disponible';
    }

    return new Date(fecha).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearCalificacion = (valor) => {
    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      return '–';
    }

    return `${numero.toFixed(numero % 1 === 0 ? 0 : 2)}%`;
  };

  const mostrarMensaje = (texto, tipo = 'error') => {
    finalizarCargaCertificado();

    if (!certificadoMensaje) {
      return;
    }

    certificadoMensaje.textContent = texto;
    certificadoMensaje.className = tipo === 'error' ? 'form-error certificado-message' : 'form-success certificado-message';
    certificadoMensaje.style.display = 'block';
  };

  const normalizarCertificadoLocal = (certificado) => {
    if (!certificado) {
      return null;
    }

    const usuario = obtenerJSON('edutech_usuario', {});
    const nombreAlumno = certificado.nombre_alumno
      || [usuario.nombre, usuario.apellido_paterno || usuario.apellidos, usuario.apellido_materno].filter(Boolean).join(' ').trim()
      || 'Alumno EduTech';

    return {
      id_certificado: certificado.id_certificado || certificado.idCertificado || '',
      codigo_certificado: certificado.codigo_certificado || certificado.codigo || '',
      fecha_emision: certificado.fecha_emision || certificado.fecha_aprobacion || certificado.fecha || '',
      titulo_curso: certificado.titulo_curso || certificado.curso || certificado.titulo || 'Curso EduTech',
      nombre_alumno: nombreAlumno,
      nombre_instructor: certificado.nombre_instructor || certificado.instructor || 'Instructor EduTech',
      calificacion: certificado.calificacion
    };
  };

  const buscarCertificadoLocal = () => {
    const id = obtenerParametro('id');
    const codigo = obtenerParametro('codigo');
    const certificados = obtenerJSON('edutech_certificados', []);

    if (!Array.isArray(certificados)) {
      return null;
    }

    const certificado = certificados.find((item) => {
      if (id && String(item.id_certificado || item.idCertificado || '') === String(id)) {
        return true;
      }

      if (codigo && String(item.codigo_certificado || item.codigo || '').trim() === String(codigo).trim()) {
        return true;
      }

      return false;
    });

    return normalizarCertificadoLocal(certificado);
  };

  const obtenerCertificadoBackend = async () => {
    if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
      return null;
    }

    const id = obtenerParametro('id');
    const codigo = obtenerParametro('codigo');
    const idUsuario = obtenerIdUsuarioActual();

    if (id && idUsuario) {
      const respuesta = await conTimeout(window.EduTech.apiRequest(`/usuarios/${idUsuario}/certificados/${id}`), 1800, null);
      return respuesta && respuesta.certificado ? respuesta.certificado : null;
    }

    if (codigo) {
      const respuesta = await conTimeout(window.EduTech.apiRequest(`/certificados/verificar/${encodeURIComponent(codigo)}`), 1800, null);
      return respuesta && respuesta.certificado ? respuesta.certificado : null;
    }

    return null;
  };

  const pintarCertificado = (certificado) => {
    const datos = normalizarCertificadoLocal(certificado);

    if (!datos) {
      mostrarMensaje('No se encontró el certificado solicitado.');
      return;
    }

    if (certificadoMensaje) {
      certificadoMensaje.style.display = 'none';
    }

    if (certificadoAlumno) {
      certificadoAlumno.textContent = datos.nombre_alumno;
    }

    if (certificadoCurso) {
      certificadoCurso.textContent = datos.titulo_curso;
    }

    if (certificadoInstructor) {
      certificadoInstructor.textContent = datos.nombre_instructor;
    }

    if (certificadoCalificacion) {
      certificadoCalificacion.textContent = formatearCalificacion(datos.calificacion);
    }

    if (certificadoFecha) {
      certificadoFecha.textContent = formatearFecha(datos.fecha_emision);
    }

    if (certificadoCodigo) {
      certificadoCodigo.textContent = datos.codigo_certificado || 'Pendiente de sincronización';
    }

  };

  const cargarCertificado = async () => {
    let certificado = buscarCertificadoLocal();
    let errorBackend = null;

    try {
      const backend = await obtenerCertificadoBackend();

      if (backend) {
        certificado = backend;
      }
    } catch (error) {
      errorBackend = error;
    }

    if (!certificado) {
      mostrarMensaje(errorBackend?.message || 'No se encontró el certificado solicitado.');
      return;
    }

    pintarCertificado(certificado);
    await mostrarCertificadoCompleto();
  };

  const obtenerContenedorExportable = () => document.querySelector('.edutech-certificate-container');

  const esperarImagenes = async (contenedor) => {
    if (!contenedor) {
      return;
    }

    const imagenes = Array.from(contenedor.querySelectorAll('img'));
    await Promise.all(imagenes.map((imagen) => {
      if (imagen.complete && imagen.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        imagen.onload = resolve;
        imagen.onerror = resolve;
      });
    }));

    if (document.fonts && typeof document.fonts.ready === 'object') {
      try {
        await document.fonts.ready;
      } catch (error) {
        // No detenemos la descarga/impresión si el navegador no puede confirmar fuentes.
      }
    }
  };

  const convertirBlobADataURL = (blob) => new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onloadend = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(blob);
  });

  const convertirRecursoADataURL = async (url) => {
    if (!url || url.startsWith('data:')) {
      return url;
    }

    const respuesta = await fetch(url, { cache: 'force-cache' });

    if (!respuesta.ok) {
      throw new Error(`No se pudo preparar el recurso: ${url}`);
    }

    const blob = await respuesta.blob();
    return convertirBlobADataURL(blob);
  };

  const extraerUrlCSS = (valor) => {
    const coincidencia = String(valor || '').match(/url\(["']?(.*?)["']?\)/);
    return coincidencia ? coincidencia[1] : '';
  };

  const copiarEstilosEnLinea = (origen, destino) => {
    const estilos = window.getComputedStyle(origen);
    let css = '';

    for (const propiedad of estilos) {
      css += `${propiedad}:${estilos.getPropertyValue(propiedad)};`;
    }

    destino.setAttribute('style', css);

    Array.from(origen.children).forEach((hijo, indice) => {
      if (destino.children[indice]) {
        copiarEstilosEnLinea(hijo, destino.children[indice]);
      }
    });
  };

  const prepararClonExportable = async (elemento, width, height) => {
    const clon = elemento.cloneNode(true);
    copiarEstilosEnLinea(elemento, clon);

    clon.style.width = `${width}px`;
    clon.style.height = `${height}px`;
    clon.style.minHeight = `${height}px`;
    clon.style.maxWidth = 'none';
    clon.style.margin = '0';
    clon.style.boxSizing = 'border-box';
    clon.style.transform = 'none';

    const fondo = extraerUrlCSS(window.getComputedStyle(elemento).backgroundImage);
    if (fondo && fondo !== 'none') {
      try {
        const fondoData = await convertirRecursoADataURL(new URL(fondo, window.location.href).href);
        clon.style.backgroundImage = `url("${fondoData}")`;
      } catch (error) {
        clon.style.backgroundImage = window.getComputedStyle(elemento).backgroundImage;
      }
    }

    const imagenesOriginales = Array.from(elemento.querySelectorAll('img'));
    const imagenesClon = Array.from(clon.querySelectorAll('img'));

    for (let i = 0; i < imagenesOriginales.length; i += 1) {
      const original = imagenesOriginales[i];
      const copia = imagenesClon[i];

      if (!copia || !original.currentSrc && !original.src) {
        continue;
      }

      try {
        const srcAbsoluto = new URL(original.currentSrc || original.src, window.location.href).href;
        copia.src = await convertirRecursoADataURL(srcAbsoluto);
      } catch (error) {
        copia.src = original.currentSrc || original.src;
      }
    }

    return clon;
  };

  const cargarImagenParaCanvas = (src) => new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.crossOrigin = 'anonymous';
    imagen.onload = () => resolve(imagen);
    imagen.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
    imagen.src = src;
  });

  const obtenerColorCanvas = (valor, respaldo = '#000000') => {
    if (!valor || valor === 'transparent' || valor === 'rgba(0, 0, 0, 0)') {
      return respaldo;
    }

    return valor;
  };

  const obtenerRectRelativo = (elemento, baseRect, escala) => {
    const rect = elemento.getBoundingClientRect();

    return {
      x: (rect.left - baseRect.left) * escala,
      y: (rect.top - baseRect.top) * escala,
      width: rect.width * escala,
      height: rect.height * escala
    };
  };

  const prepararFuenteCanvas = (elemento, escala) => {
    const estilos = window.getComputedStyle(elemento);
    const fontStyle = estilos.fontStyle || 'normal';
    const fontWeight = estilos.fontWeight || '400';
    const fontSize = Number.parseFloat(estilos.fontSize || '16') * escala;
    const fontFamily = estilos.fontFamily || 'Arial, Helvetica, sans-serif';

    return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  };

  const dibujarTextoElemento = (ctx, elemento, baseRect, escala, opciones = {}) => {
    if (!elemento) {
      return;
    }

    const texto = (opciones.texto || elemento.textContent || '').trim();

    if (!texto) {
      return;
    }

    const estilos = window.getComputedStyle(elemento);
    const rect = obtenerRectRelativo(elemento, baseRect, escala);
    const alineacion = opciones.align || estilos.textAlign || 'center';
    const color = opciones.color || obtenerColorCanvas(estilos.color, '#000000');

    ctx.save();
    ctx.font = opciones.font || prepararFuenteCanvas(elemento, escala);
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = alineacion === 'left' || alineacion === 'start' ? 'left' : alineacion === 'right' || alineacion === 'end' ? 'right' : 'center';

    let x = rect.x + rect.width / 2;

    if (ctx.textAlign === 'left') {
      x = rect.x;
    } else if (ctx.textAlign === 'right') {
      x = rect.x + rect.width;
    }

    ctx.fillText(texto, x, rect.y + rect.height / 2);
    ctx.restore();
  };

  const dibujarRectElemento = (ctx, elemento, baseRect, escala, opciones = {}) => {
    if (!elemento) {
      return;
    }

    const rect = obtenerRectRelativo(elemento, baseRect, escala);
    const estilos = window.getComputedStyle(elemento);

    ctx.save();
    ctx.fillStyle = opciones.color || obtenerColorCanvas(estilos.backgroundColor, '#000000');
    ctx.fillRect(rect.x, rect.y, rect.width, Math.max(1, rect.height));
    ctx.restore();
  };

  const dibujarImagenElemento = async (ctx, elemento, baseRect, escala) => {
    if (!elemento) {
      return;
    }

    const src = elemento.currentSrc || elemento.src;

    if (!src) {
      return;
    }

    const rect = obtenerRectRelativo(elemento, baseRect, escala);
    const imagen = await cargarImagenParaCanvas(src);
    ctx.drawImage(imagen, rect.x, rect.y, rect.width, rect.height);
  };

  const generarImagenCertificado = async () => {
    const elemento = obtenerContenedorExportable();

    if (!elemento) {
      throw new Error('No se encontró el certificado para exportar.');
    }

    await esperarImagenes(elemento);

    const contenedor = elemento;
    const papel = elemento.querySelector('.edutech-certificate-paper');

    if (!papel) {
      throw new Error('No se encontró el área interna del certificado.');
    }

    const rectBase = contenedor.getBoundingClientRect();
    const escala = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(rectBase.width * escala);
    canvas.height = Math.round(rectBase.height * escala);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const estilosContenedor = window.getComputedStyle(contenedor);
    ctx.fillStyle = obtenerColorCanvas(estilosContenedor.backgroundColor, '#1f212b');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fondoCss = extraerUrlCSS(estilosContenedor.backgroundImage);

    if (fondoCss) {
      try {
        const fondoUrl = new URL(fondoCss, window.location.href).href;
        const fondo = await cargarImagenParaCanvas(fondoUrl);
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        // Si el fondo falla, dejamos el color base para que el certificado sí se descargue.
      }
    }

    const rectPapel = obtenerRectRelativo(papel, rectBase, escala);
    const estilosPapel = window.getComputedStyle(papel);

    ctx.save();
    ctx.fillStyle = obtenerColorCanvas(estilosPapel.backgroundColor, '#f7f1e6');
    ctx.fillRect(rectPapel.x, rectPapel.y, rectPapel.width, rectPapel.height);
    ctx.strokeStyle = 'rgba(88, 73, 50, 0.18)';
    ctx.lineWidth = Math.max(1, escala);
    ctx.strokeRect(rectPapel.x, rectPapel.y, rectPapel.width, rectPapel.height);
    ctx.restore();

    const logoEdu = elemento.querySelector('.edutech-logo-edu');
    const logoTech = elemento.querySelector('.edutech-logo-tech');
    dibujarTextoElemento(ctx, logoEdu, rectBase, escala, { align: 'left' });
    dibujarTextoElemento(ctx, logoTech, rectBase, escala, { align: 'left' });

    dibujarTextoElemento(ctx, elemento.querySelector('.edutech-certificate-title'), rectBase, escala);
    dibujarTextoElemento(ctx, elemento.querySelector('.edutech-certificate-label'), rectBase, escala);
    dibujarTextoElemento(ctx, certificadoAlumno, rectBase, escala);
    dibujarTextoElemento(ctx, elemento.querySelector('.edutech-certificate-text'), rectBase, escala);
    dibujarTextoElemento(ctx, certificadoCurso, rectBase, escala);
    dibujarTextoElemento(ctx, elemento.querySelector('.edutech-certificate-date'), rectBase, escala);

    const firmas = Array.from(elemento.querySelectorAll('.edutech-certificate-signature'));

    for (const firma of firmas) {
      dibujarTextoElemento(ctx, firma.querySelector('.edutech-signature-mark'), rectBase, escala);
      dibujarRectElemento(ctx, firma.querySelector('.edutech-signature-line'), rectBase, escala, { color: '#3f3632' });
      dibujarTextoElemento(ctx, firma.querySelector('strong'), rectBase, escala, { align: 'left' });
      dibujarTextoElemento(ctx, firma.querySelector('small'), rectBase, escala, { align: 'left' });
    }

    await dibujarImagenElemento(ctx, elemento.querySelector('.edutech-certificate-seal img'), rectBase, escala);

    return canvas.toDataURL('image/png');
  };

  const descargarCertificadoComoImagen = async (evento) => {
    if (evento) {
      evento.preventDefault();
      evento.stopPropagation();
    }

    try {
      const dataURL = await generarImagenCertificado();
      const enlace = document.createElement('a');
      const codigo = certificadoCodigo?.textContent?.trim() || 'certificado';
      enlace.download = `certificado-edutech-${codigo.replace(/[^a-zA-Z0-9_-]/g, '') || 'curso'}.png`;
      enlace.href = dataURL;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo descargar el certificado.', 'error');
    }
  };

  const limpiarVistaImpresion = (contenedorImpresion) => {
    document.body.classList.remove('edutech-printing-certificate');

    if (contenedorImpresion && contenedorImpresion.parentNode) {
      contenedorImpresion.remove();
    }
  };

  const imprimirCertificadoComoImagen = async (evento) => {
    if (evento) {
      evento.preventDefault();
      evento.stopPropagation();
    }

    try {
      const dataURL = await generarImagenCertificado();
      const contenedorImpresion = document.createElement('div');
      contenedorImpresion.className = 'edutech-print-output';

      const imagen = document.createElement('img');
      imagen.src = dataURL;
      imagen.alt = 'Certificado EduTech';
      contenedorImpresion.appendChild(imagen);
      document.body.appendChild(contenedorImpresion);
      document.body.classList.add('edutech-printing-certificate');

      await new Promise((resolve) => {
        if (imagen.complete) {
          resolve();
          return;
        }

        imagen.onload = resolve;
        imagen.onerror = resolve;
      });

      const limpiar = () => limpiarVistaImpresion(contenedorImpresion);
      window.addEventListener('afterprint', limpiar, { once: true });

      requestAnimationFrame(() => {
        window.focus();
        window.print();
      });
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo preparar la impresión del certificado.', 'error');
    }
  };

  const setCompartirActivo = (activo) => {
    compartirActivo = activo;

    if (certificadoAcciones) {
      certificadoAcciones.classList.toggle('is-sharing-enabled', compartirActivo);
    }

    if (btnToggleCompartirCertificado) {
      const label = btnToggleCompartirCertificado.querySelector('.edutech-share-label');
      if (label) {
        label.textContent = compartirActivo ? 'Deshabilitar compartir' : 'Habilitar compartir';
      }
    }

    if (btnCopiarCompartirCertificado) {
      btnCopiarCompartirCertificado.classList.remove('is-copied');
    }
  };

  const copiarEnlace = async () => {
    const enlace = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(enlace);
      } else {
        const input = document.createElement('input');
        input.value = enlace;
        input.style.position = 'fixed';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        input.remove();
      }

      if (btnCopiarCompartirCertificado) {
        btnCopiarCompartirCertificado.classList.add('is-copied');
      }
    } catch (error) {
      mostrarMensaje('No se pudo copiar el enlace para compartir.', 'error');
    }
  };

  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button');

    if (!boton) {
      return;
    }

    if (boton.id === 'btnImprimirCertificado') {
      imprimirCertificadoComoImagen(evento);
      return;
    }

    if (boton.id === 'btnDescargarCertificado') {
      descargarCertificadoComoImagen(evento);
      return;
    }

    if (boton.id === 'btnToggleCompartirCertificado') {
      evento.preventDefault();
      evento.stopPropagation();
      setCompartirActivo(!compartirActivo);
      return;
    }

    if (boton.id === 'btnCopiarCompartirCertificado') {
      evento.preventDefault();
      evento.stopPropagation();
      copiarEnlace();
    }
  }, true);

  document.addEventListener('DOMContentLoaded', cargarCertificado);
})();
