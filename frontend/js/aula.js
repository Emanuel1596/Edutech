(() => {
  const elementos = {
    tituloCurso: document.getElementById('aulaTituloCurso'),
    descripcionCurso: document.getElementById('aulaDescripcionCurso'),
    instructor: document.getElementById('aulaInstructor'),
    nivel: document.getElementById('aulaNivel'),
    totalLecciones: document.getElementById('aulaTotalLecciones'),
    progresoNumero: document.getElementById('aulaProgresoNumero'),
    progresoBarra: document.getElementById('aulaProgresoBarra'),
    progresoTexto: document.getElementById('aulaProgresoTexto'),
    modulosLista: document.getElementById('aulaModulosLista'),
    mensaje: document.getElementById('aulaMensaje'),
    leccionVista: document.getElementById('aulaLeccionVista'),
    examenVista: document.getElementById('aulaExamenVista'),
    estadoVacio: document.getElementById('aulaEstadoVacio'),
    leccionModulo: document.getElementById('aulaLeccionModulo'),
    leccionTitulo: document.getElementById('aulaLeccionTitulo'),
    leccionDuracion: document.getElementById('aulaLeccionDuracion'),
    videoBox: document.getElementById('aulaVideoBox'),
    leccionTexto: document.getElementById('aulaLeccionTexto'),
    recursosBox: document.getElementById('aulaRecursosBox'),
    recursosLista: document.getElementById('aulaRecursosLista'),
    btnAnterior: document.getElementById('aulaBtnAnterior'),
    btnSiguiente: document.getElementById('aulaBtnSiguiente'),
    examenTextoUno: document.getElementById('aulaExamenTextoUno'),
    examenTextoDos: document.getElementById('aulaExamenTextoDos'),
    examenTiempo: document.getElementById('aulaExamenTiempo'),
    examenIntentos: document.getElementById('aulaExamenIntentos'),
    examenMinima: document.getElementById('aulaExamenMinima'),
    examenEstadoIntentos: document.getElementById('aulaExamenEstadoIntentos'),
    btnExamen: document.getElementById('aulaBtnExamen'),
    btnExamenAnterior: document.getElementById('aulaBtnExamenAnterior'),
    btnExamenVolver: document.getElementById('aulaBtnExamenVolver')
  };

  const estado = {
    usuario: null,
    idUsuario: null,
    idInscripcion: null,
    idCurso: null,
    idLeccionInicial: null,
    curso: null,
    examen: null,
    lecciones: [],
    leccionActual: null
  };

  const marcarPaginaLista = () => {
    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }
  };

  const mostrar = (elemento, display = 'block') => {
    if (elemento) {
      elemento.style.display = display;
    }
  };

  const ocultar = (elemento) => {
    if (elemento) {
      elemento.style.display = 'none';
    }
  };

  const mostrarMensaje = (texto, esError = false) => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = texto;
    elementos.mensaje.classList.toggle('aula-message-error', esError);
    mostrar(elementos.mensaje);
  };

  const ocultarMensaje = () => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = '';
    elementos.mensaje.classList.remove('aula-message-error');
    ocultar(elementos.mensaje);
  };

  const leerJson = (clave, valorDefecto = null) => {
    try {
      const valor = localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : valorDefecto;
    } catch (error) {
      return valorDefecto;
    }
  };

  const guardarJson = (clave, valor) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  };

  const escaparHtml = (valor) => String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const obtenerParametro = (nombre) => {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(nombre);
  };

  const obtenerParametrosIniciales = () => {
    estado.idInscripcion = obtenerParametro('idInscripcion') || obtenerParametro('id_inscripcion') || null;
    estado.idCurso = obtenerParametro('idCurso') || obtenerParametro('id') || obtenerParametro('id_curso') || null;
    estado.idLeccionInicial = obtenerParametro('idLeccion') || obtenerParametro('id_leccion') || null;
  };

  const obtenerUsuarioSesion = () => {
    if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
      return window.EduTech.obtenerUsuarioSesion();
    }

    return leerJson('edutech_usuario', null);
  };

  const obtenerIdUsuarioSesion = () => {
    if (window.EduTech && typeof window.EduTech.obtenerIdUsuarioSesion === 'function') {
      return window.EduTech.obtenerIdUsuarioSesion();
    }

    const idDirecto = localStorage.getItem('edutech_id_usuario');

    if (idDirecto) {
      return idDirecto;
    }

    const usuario = obtenerUsuarioSesion();
    return usuario ? (usuario.id_usuario || usuario.id || null) : null;
  };

  const formatearDuracion = (segundos) => {
    const total = Number(segundos);

    if (!total || Number.isNaN(total) || total <= 0) {
      return 'Duración no disponible';
    }

    const minutos = Math.floor(total / 60);
    const restantes = total % 60;

    if (minutos <= 0) {
      return `${restantes} segundos`;
    }

    if (restantes === 0) {
      return `${minutos} minutos`;
    }

    return `${minutos} min ${restantes} s`;
  };

  const esExamenFinal = (leccion) => {
    const titulo = String((leccion && leccion.titulo) || '').toLowerCase();
    const modulo = String((leccion && leccion.modulo_titulo) || '').toLowerCase();

    return titulo.includes('examen final') || modulo.includes('examen final');
  };

  const obtenerLeccionesContenido = () => estado.lecciones.filter((leccion) => !esExamenFinal(leccion));

  const calcularResumenProgreso = () => {
    const leccionesContenido = obtenerLeccionesContenido();
    const total = leccionesContenido.length;
    const completadas = leccionesContenido.filter((leccion) => Boolean(leccion.completada)).length;
    const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

    return {
      total,
      completadas,
      porcentaje
    };
  };

  const obtenerInstructor = (curso) => {
    const nombre = curso.nombre_instructor || curso.instructor || 'Instructor';
    const apellido = curso.apellido_paterno_instructor || '';
    return `${nombre} ${apellido}`.trim();
  };

  const obtenerIdCurso = (curso) => curso && (curso.id_curso || curso.idCurso || curso.id);

  const obtenerIdInscripcion = (curso) => curso && (curso.id_inscripcion || curso.idInscripcion || estado.idInscripcion);

  const crearUrlExamen = () => {
    const idCurso = obtenerIdCurso(estado.curso) || estado.idCurso || '';
    const idInscripcion = obtenerIdInscripcion(estado.curso) || estado.idInscripcion || '';
    const parametros = new URLSearchParams();

    if (idCurso) {
      parametros.set('id', String(idCurso));
    }

    if (idInscripcion) {
      parametros.set('idInscripcion', String(idInscripcion));
    }

    parametros.set('vista', 'quiz');

    const query = parametros.toString();
    return query ? `examen.html?${query}` : 'examen.html';
  };

  const crearUrlRegresoCurso = () => {
    const idCurso = obtenerIdCurso(estado.curso) || estado.idCurso || '';
    return idCurso ? `detalle-curso.html?id=${idCurso}` : 'mi-cuenta.html#mis-cursos';
  };

  const actualizarUrlLeccionActual = (leccion) => {
    if (!leccion || !leccion.id_leccion || !window.history || !window.history.replaceState) {
      return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idCurso = obtenerIdCurso(estado.curso) || estado.idCurso || '';
    const idInscripcion = obtenerIdInscripcion(estado.curso) || estado.idInscripcion || '';

    if (idInscripcion) {
      parametros.set('idInscripcion', String(idInscripcion));
    }

    if (idCurso) {
      parametros.set('idCurso', String(idCurso));
    }

    parametros.set('idLeccion', String(leccion.id_leccion));

    window.history.replaceState(
      { edutechAulaLeccion: String(leccion.id_leccion) },
      '',
      `${window.location.pathname}?${parametros.toString()}`
    );
  };

  const obtenerResultadoExamenLocal = () => {
    const idCurso = obtenerIdCurso(estado.curso) || estado.idCurso;

    if (!idCurso) {
      return null;
    }

    const resultados = leerJson('edutech_resultados_examenes', []);
    const historial = leerJson('edutech_resultados_examenes_historial', []);
    const listas = [resultados, historial];

    for (const lista of listas) {
      if (!Array.isArray(lista)) {
        continue;
      }

      const coincidencias = lista
        .filter((item) => String(item.id_curso || item.idCurso || item.id) === String(idCurso))
        .sort((a, b) => new Date(b.fecha_fin || b.fecha_inicio || 0) - new Date(a.fecha_fin || a.fecha_inicio || 0));

      if (coincidencias[0]) {
        return coincidencias[0];
      }
    }

    return null;
  };

  const examenRealizado = () => {
    const examen = estado.examen || {};
    const resultadoLocal = obtenerResultadoExamenLocal();
    return Boolean(resultadoLocal || examen.ultimo_resultado || Number(examen.intentos_realizados || 0) > 0);
  };

  const obtenerLeccionExamenFinal = () => estado.lecciones.find((leccion) => esExamenFinal(leccion)) || null;

  const sincronizarExamenCompletado = () => {
    if (!examenRealizado()) {
      return;
    }

    estado.lecciones = estado.lecciones.map((leccion) => (
      esExamenFinal(leccion)
        ? { ...leccion, completada: true }
        : leccion
    ));

    if (estado.curso && Array.isArray(estado.curso.modulos)) {
      estado.curso.modulos = estado.curso.modulos.map((modulo) => ({
        ...modulo,
        lecciones: (modulo.lecciones || []).map((leccion) => (
          esExamenFinal(leccion)
            ? { ...leccion, completada: true }
            : leccion
        ))
      }));
    }
  };

  const obtenerTiempoExamen = () => {
    const tiempo = Number((estado.examen && estado.examen.tiempo_limite_minutos) || 30);
    return Number.isFinite(tiempo) && tiempo > 0 ? tiempo : 30;
  };

  const obtenerMaxIntentosExamen = () => {
    const intentos = Number((estado.examen && estado.examen.max_intentos) || 2);
    return Number.isFinite(intentos) && intentos > 0 ? intentos : 2;
  };

  const obtenerMinimaExamen = () => {
    const minima = Number((estado.examen && estado.examen.calificacion_minima) || 70);
    return Number.isFinite(minima) && minima > 0 ? minima : 70;
  };

  const obtenerIndiceLeccion = (leccion) => estado.lecciones.findIndex((item) => (
    String(item.id_leccion) === String(leccion && leccion.id_leccion)
  ));

  const obtenerLeccionAnterior = (leccion) => {
    const indice = obtenerIndiceLeccion(leccion);

    if (indice <= 0) {
      return null;
    }

    return estado.lecciones[indice - 1] || null;
  };

  const obtenerEmbedYoutube = (url) => {
    try {
      const urlObj = new URL(url);
      const host = urlObj.hostname.replace('www.', '');

      if (host === 'youtu.be') {
        const id = urlObj.pathname.replace('/', '').trim();
        return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : '';
      }

      if (host.includes('youtube.com')) {
        const id = urlObj.searchParams.get('v');

        if (id) {
          return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
        }

        const partes = urlObj.pathname.split('/').filter(Boolean);
        const embedIndex = partes.indexOf('embed');

        if (embedIndex >= 0 && partes[embedIndex + 1]) {
          return `https://www.youtube.com/embed/${encodeURIComponent(partes[embedIndex + 1])}`;
        }
      }
    } catch (error) {
      return '';
    }

    return '';
  };

  const obtenerEmbedVimeo = (url) => {
    try {
      const urlObj = new URL(url);
      const host = urlObj.hostname.replace('www.', '');

      if (!host.includes('vimeo.com')) {
        return '';
      }

      const id = urlObj.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}` : '';
    } catch (error) {
      return '';
    }
  };

  const crearBotonVideo = (url) => {
    const contenedor = document.createElement('div');
    contenedor.className = 'aula-video-placeholder';

    const icono = document.createElement('span');
    icono.textContent = '▶';

    const texto = document.createElement('p');
    texto.textContent = 'Video de la lección';

    const enlace = document.createElement('a');
    enlace.href = url || '#';
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    enlace.textContent = url ? 'Abrir video' : 'Video no disponible';

    if (!url) {
      enlace.removeAttribute('href');
      enlace.removeAttribute('target');
    }

    contenedor.appendChild(icono);
    contenedor.appendChild(texto);
    contenedor.appendChild(enlace);
    return contenedor;
  };

  const pintarVideo = (leccion) => {
    if (!elementos.videoBox) {
      return;
    }

    elementos.videoBox.innerHTML = '';
    const url = leccion.url_video || '';
    const embed = obtenerEmbedYoutube(url) || obtenerEmbedVimeo(url);

    if (embed) {
      const iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.title = `Video de ${leccion.titulo}`;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      elementos.videoBox.appendChild(iframe);
      return;
    }

    if (url && /\.(mp4|webm|ogg)$/i.test(url)) {
      const video = document.createElement('video');
      video.controls = true;
      video.src = url;
      video.textContent = 'Tu navegador no puede reproducir este video.';
      elementos.videoBox.appendChild(video);
      return;
    }

    elementos.videoBox.appendChild(crearBotonVideo(url));
  };

  const pintarRecursos = (leccion) => {
    if (!elementos.recursosLista || !elementos.recursosBox) {
      return;
    }

    const recursos = Array.isArray(leccion.recursos) ? leccion.recursos : [];
    elementos.recursosLista.innerHTML = '';

    if (recursos.length === 0) {
      elementos.recursosLista.innerHTML = '<p class="aula-no-resources">Esta lección no tiene recursos adicionales.</p>';
      return;
    }

    const lista = document.createElement('ul');
    lista.className = 'aula-resources-list';

    recursos.forEach((recurso) => {
      const item = document.createElement('li');
      const enlace = document.createElement('a');
      enlace.href = recurso.url_recurso || '#';
      enlace.target = '_blank';
      enlace.rel = 'noopener noreferrer';
      enlace.textContent = recurso.titulo || 'Recurso';

      const descripcion = document.createElement('p');
      descripcion.textContent = recurso.descripcion || recurso.nombre_tipo_recurso || 'Material complementario';

      item.appendChild(enlace);
      item.appendChild(descripcion);
      lista.appendChild(item);
    });

    elementos.recursosLista.appendChild(lista);
  };

  const ocultarVistasContenido = () => {
    ocultar(elementos.leccionVista);
    ocultar(elementos.examenVista);
    ocultar(elementos.estadoVacio);
  };

  const leccionDisponible = (leccion) => {
    const indice = estado.lecciones.findIndex((item) => String(item.id_leccion) === String(leccion.id_leccion));

    if (indice <= 0) {
      return true;
    }

    const anteriores = estado.lecciones.slice(0, indice).filter((item) => !esExamenFinal(item));
    return anteriores.every((item) => Boolean(item.completada));
  };

  const examenDisponible = () => {
    const leccionesContenido = obtenerLeccionesContenido();
    return leccionesContenido.length > 0 && leccionesContenido.every((leccion) => Boolean(leccion.completada));
  };

  const pintarProgreso = () => {
    const resumen = calcularResumenProgreso();

    if (elementos.progresoNumero) {
      elementos.progresoNumero.textContent = `${resumen.porcentaje}%`;
    }

    if (elementos.progresoBarra) {
      elementos.progresoBarra.style.width = `${resumen.porcentaje}%`;
    }

    if (elementos.progresoTexto) {
      elementos.progresoTexto.textContent = `${resumen.completadas} de ${resumen.total} lecciones completadas`;
    }

    if (elementos.totalLecciones) {
      elementos.totalLecciones.textContent = `Lecciones: ${resumen.total}`;
    }
  };

  const seleccionarLeccion = (leccion) => {
    if (!leccion) {
      ocultarVistasContenido();
      mostrar(elementos.estadoVacio);
      return;
    }

    if (!leccionDisponible(leccion)) {
      mostrarMensaje('Esta lección está bloqueada. Completa primero la lección anterior.', true);
      return;
    }

    estado.leccionActual = leccion;
    actualizarUrlLeccionActual(leccion);
    ocultarMensaje();
    ocultarVistasContenido();

    if (esExamenFinal(leccion)) {
      const anterior = obtenerLeccionAnterior(leccion);

      if (elementos.btnExamenAnterior) {
        elementos.btnExamenAnterior.disabled = !anterior;
        elementos.btnExamenAnterior.textContent = 'Lección anterior';
      }

      if (elementos.btnExamenVolver) {
        elementos.btnExamenVolver.disabled = false;
        elementos.btnExamenVolver.textContent = 'Volver al curso';
      }

      pintarExamenFinal();
      mostrar(elementos.examenVista);
      pintarModulos();
      return;
    }

    if (elementos.leccionModulo) {
      elementos.leccionModulo.textContent = leccion.modulo_titulo || 'Módulo';
    }

    if (elementos.leccionTitulo) {
      elementos.leccionTitulo.textContent = leccion.titulo || 'Lección';
    }

    if (elementos.leccionDuracion) {
      elementos.leccionDuracion.textContent = `Tiempo estimado: ${formatearDuracion(leccion.duracion_segundos)}`;
    }

    if (elementos.leccionTexto) {
      elementos.leccionTexto.textContent = leccion.texto_descriptivo || 'Esta lección no tiene texto descriptivo.';
    }

    const anterior = obtenerLeccionAnterior(leccion);
    const siguiente = obtenerSiguienteLeccion(leccion);

    if (elementos.btnAnterior) {
      elementos.btnAnterior.disabled = false;
      elementos.btnAnterior.textContent = anterior ? 'Lección anterior' : 'Volver al curso';
    }

    if (elementos.btnSiguiente) {
      elementos.btnSiguiente.disabled = !siguiente;
      elementos.btnSiguiente.textContent = siguiente && esExamenFinal(siguiente) ? 'Ir al examen final' : 'Siguiente lección';
    }

    pintarVideo(leccion);
    pintarRecursos(leccion);
    mostrar(elementos.leccionVista);
    pintarModulos();
  };

  const pintarExamenFinal = () => {
    const disponible = examenDisponible();
    const tituloCurso = (estado.curso && (estado.curso.titulo || estado.curso.nombre_curso || estado.curso.nombre)) || 'curso';
    const tiempo = obtenerTiempoExamen();
    const intentos = obtenerMaxIntentosExamen();
    const minima = obtenerMinimaExamen();
    const realizado = examenRealizado();
    const intentosRealizados = Number((estado.examen && estado.examen.intentos_realizados) || 0);
    const intentosRestantes = Number((estado.examen && estado.examen.intentos_restantes) ?? Math.max(0, intentos - intentosRealizados));

    if (elementos.examenTextoUno) {
      elementos.examenTextoUno.innerHTML = `¡Estamos llegando al final del curso! Con lo que aprendimos vas a poder tener un manejo básico de <strong>${escaparHtml(tituloCurso)}</strong> para realizar tus primeras actividades completas. No te olvides que, para seguir aprendiendo, te recomendamos repasar todas las lecciones del curso.`;
    }

    if (elementos.examenTextoDos) {
      elementos.examenTextoDos.textContent = 'Fue un largo camino, de mucho esfuerzo y práctica, pero llegamos finalmente al examen final. Para rendirlo y obtener el correspondiente certificado tienes que tener en cuenta lo siguiente:';
    }

    if (elementos.examenTiempo) {
      elementos.examenTiempo.textContent = `${tiempo} minutos`;
    }

    if (elementos.examenIntentos) {
      elementos.examenIntentos.textContent = `${intentos} ${intentos === 1 ? 'intento' : 'intentos'}`;
    }

    if (elementos.examenMinima) {
      elementos.examenMinima.textContent = `${minima}% de respuestas correctas`;
    }

    if (elementos.btnExamen) {
      const sinIntentos = intentosRestantes <= 0;
      elementos.btnExamen.href = crearUrlExamen();

      if (!disponible) {
        elementos.btnExamen.textContent = 'Examen bloqueado';
      } else if (sinIntentos) {
        elementos.btnExamen.textContent = 'Intentos agotados';
      } else if (realizado) {
        elementos.btnExamen.textContent = 'Realizar nuevo intento';
      } else {
        elementos.btnExamen.textContent = 'Realizar cuestionario';
      }

      elementos.btnExamen.classList.toggle('aula-disabled-link', !disponible || sinIntentos);
      elementos.btnExamen.setAttribute('aria-disabled', String(!disponible || sinIntentos));
    }

    if (elementos.examenEstadoIntentos) {
      if (!disponible) {
        elementos.examenEstadoIntentos.textContent = 'Completa las lecciones anteriores para desbloquear el examen final.';
      } else if (intentosRestantes <= 0) {
        elementos.examenEstadoIntentos.textContent = 'Máximo de intentos alcanzado. Revisa tu calificación en Mi cuenta > Mis calificaciones.';
      } else if (realizado) {
        elementos.examenEstadoIntentos.textContent = `Examen realizado. Intentos restantes: ${intentosRestantes}.`;
      } else {
        elementos.examenEstadoIntentos.textContent = '';
      }
    }
  };

  const obtenerSiguienteLeccion = (leccion) => {
    const indice = estado.lecciones.findIndex((item) => String(item.id_leccion) === String(leccion.id_leccion));

    if (indice < 0) {
      return null;
    }

    return estado.lecciones[indice + 1] || null;
  };

  const pintarModulos = () => {
    if (!elementos.modulosLista || !estado.curso) {
      return;
    }

    elementos.modulosLista.innerHTML = '';
    const modulos = Array.isArray(estado.curso.modulos) ? estado.curso.modulos : [];

    if (modulos.length === 0) {
      elementos.modulosLista.innerHTML = '<p class="aula-sidebar-empty">Este curso todavía no tiene módulos.</p>';
      return;
    }

    modulos.forEach((modulo) => {
      const bloque = document.createElement('section');
      bloque.className = 'aula-module-block';

      const titulo = document.createElement('h3');
      titulo.textContent = modulo.titulo || 'Módulo';
      bloque.appendChild(titulo);

      const lista = document.createElement('div');
      lista.className = 'aula-lessons-list';

      const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];

      if (lecciones.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'aula-module-empty';
        vacio.textContent = 'Sin lecciones.';
        lista.appendChild(vacio);
      }

      lecciones.forEach((leccion) => {
        const disponible = leccionDisponible(leccion);
        const activa = estado.leccionActual && String(estado.leccionActual.id_leccion) === String(leccion.id_leccion);
        const examen = esExamenFinal(leccion);
        const boton = document.createElement('button');

        boton.type = 'button';
        boton.className = 'aula-lesson-button';
        boton.classList.toggle('is-active', activa);
        const completada = Boolean(leccion.completada) || (examen && examenRealizado());
        boton.classList.toggle('is-completed', completada);
        boton.classList.toggle('is-locked', !disponible);
        boton.classList.toggle('is-exam', examen);
        boton.disabled = !disponible;
        boton.dataset.idLeccion = leccion.id_leccion;

        const estadoTexto = document.createElement('span');
        estadoTexto.className = 'aula-lesson-state';

        if (!disponible) {
          estadoTexto.textContent = '';
          estadoTexto.classList.add('is-locked');
        } else if (examen && completada) {
          estadoTexto.textContent = '✓';
          estadoTexto.classList.add('is-completed');
        } else if (examen) {
          estadoTexto.textContent = '';
          estadoTexto.classList.add('is-exam');
        } else if (completada) {
          estadoTexto.textContent = '✓';
          estadoTexto.classList.add('is-completed');
        } else {
          estadoTexto.textContent = '';
        }

        const nombre = document.createElement('span');
        nombre.className = 'aula-lesson-name';
        nombre.textContent = leccion.titulo || 'Lección';

        boton.appendChild(estadoTexto);
        boton.appendChild(nombre);

        boton.addEventListener('click', () => {
          seleccionarLeccion(leccion);
        });

        lista.appendChild(boton);
      });

      bloque.appendChild(lista);
      elementos.modulosLista.appendChild(bloque);
    });
  };

  const aplanarLecciones = (curso) => {
    const modulos = Array.isArray(curso.modulos) ? curso.modulos : [];
    const lecciones = [];

    modulos.forEach((modulo) => {
      const leccionesModulo = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];

      leccionesModulo.forEach((leccion) => {
        lecciones.push({
          ...leccion,
          modulo_titulo: modulo.titulo,
          modulo_orden: modulo.numero_orden
        });
      });
    });

    lecciones.sort((a, b) => {
      const moduloA = Number(a.modulo_orden || 0);
      const moduloB = Number(b.modulo_orden || 0);
      const leccionA = Number(a.numero_orden || 0);
      const leccionB = Number(b.numero_orden || 0);

      if (moduloA !== moduloB) {
        return moduloA - moduloB;
      }

      return leccionA - leccionB;
    });

    return lecciones;
  };

  const pintarEncabezado = () => {
    const curso = estado.curso;

    if (!curso) {
      return;
    }

    document.title = `${curso.titulo || 'Aula del curso'} - EduTech`;

    if (elementos.tituloCurso) {
      elementos.tituloCurso.textContent = curso.titulo || 'Aula del curso';
    }

    if (elementos.descripcionCurso) {
      elementos.descripcionCurso.textContent = curso.descripcion || 'Contenido del curso comprado.';
    }

    if (elementos.instructor) {
      elementos.instructor.textContent = `Instructor: ${obtenerInstructor(curso)}`;
    }

    if (elementos.nivel) {
      elementos.nivel.textContent = `Nivel: ${curso.nombre_nivel || curso.nivel || 'Por definir'}`;
    }
  };

  const actualizarCursoLocal = () => {
    const curso = estado.curso;

    if (!curso) {
      return;
    }

    const resumen = calcularResumenProgreso();
    const cursos = leerJson('edutech_mis_cursos', []);

    if (Array.isArray(cursos)) {
      const actualizados = cursos.map((item) => {
        const mismoIdCurso = obtenerIdCurso(item) && String(obtenerIdCurso(item)) === String(obtenerIdCurso(curso));
        const mismaInscripcion = obtenerIdInscripcion(item) && String(obtenerIdInscripcion(item)) === String(obtenerIdInscripcion(curso));

        if (!mismoIdCurso && !mismaInscripcion) {
          return item;
        }

        return {
          ...item,
          porcentaje_avance: resumen.porcentaje,
          lecciones_completadas: resumen.completadas,
          total_lecciones: resumen.total
        };
      });

      guardarJson('edutech_mis_cursos', actualizados);
    }

    const avances = leerJson('edutech_avances_cursos', {});
    const idCurso = obtenerIdCurso(curso);

    if (idCurso) {
      avances[String(idCurso)] = avances[String(idCurso)] || {};

      estado.lecciones.forEach((leccion) => {
        if (leccion.id_leccion && !esExamenFinal(leccion)) {
          avances[String(idCurso)][String(leccion.id_leccion)] = Boolean(leccion.completada);
        }
      });

      guardarJson('edutech_avances_cursos', avances);
    }
  };

  const aplicarResumenBackend = (resumen) => {
    if (!resumen || !estado.curso) {
      return;
    }

    estado.curso.total_lecciones_backend = resumen.total_lecciones;
    estado.curso.lecciones_completadas_backend = resumen.lecciones_completadas;
    estado.curso.porcentaje_avance_backend = resumen.porcentaje_avance;
  };

  const marcarLeccionCompletada = async (opciones = {}) => {
    const leccion = estado.leccionActual;
    const moverSiguiente = opciones.moverSiguiente !== false;

    if (!leccion || esExamenFinal(leccion)) {
      return false;
    }

    if (leccion.completada) {
      return true;
    }

    const idInscripcion = obtenerIdInscripcion(estado.curso);
    const idLeccion = leccion.id_leccion;

    if (!idInscripcion || !idLeccion) {
      mostrarMensaje('No se pudo identificar la inscripción o la lección.', true);
      return false;
    }

    try {
      if (elementos.btnSiguiente) {
        elementos.btnSiguiente.disabled = true;
        elementos.btnSiguiente.textContent = 'Guardando avance...';
      }

      const respuesta = await window.EduTech.apiRequest(`/inscripciones/${idInscripcion}/lecciones/${idLeccion}/completar`, {
        method: 'POST'
      });

      leccion.completada = true;
      leccion.fecha_completada = new Date().toISOString();

      estado.lecciones = estado.lecciones.map((item) => (
        String(item.id_leccion) === String(idLeccion)
          ? { ...item, completada: true, fecha_completada: leccion.fecha_completada }
          : item
      ));

      estado.curso.modulos = estado.curso.modulos.map((modulo) => ({
        ...modulo,
        lecciones: (modulo.lecciones || []).map((item) => (
          String(item.id_leccion) === String(idLeccion)
            ? { ...item, completada: true, fecha_completada: leccion.fecha_completada }
            : item
        ))
      }));

      aplicarResumenBackend(respuesta.resumen);
      actualizarCursoLocal();
      pintarProgreso();
      pintarModulos();

      if (moverSiguiente) {
        const leccionActualizada = estado.lecciones.find((item) => String(item.id_leccion) === String(idLeccion));
        const siguiente = obtenerSiguienteLeccion(leccionActualizada);

        if (siguiente && leccionDisponible(siguiente)) {
          seleccionarLeccion(siguiente);
        } else {
          seleccionarLeccion(leccionActualizada);
          mostrarMensaje('Lección marcada como completada.');
        }
      }

      return true;
    } catch (error) {
      if (elementos.btnSiguiente) {
        elementos.btnSiguiente.disabled = false;
        elementos.btnSiguiente.textContent = 'Siguiente lección';
      }

      mostrarMensaje(error && error.message ? error.message : 'No se pudo guardar el avance de la lección.', true);
      return false;
    }
  };

  const irLeccionAnteriorOVolver = () => {
    const anterior = obtenerLeccionAnterior(estado.leccionActual);

    if (anterior && leccionDisponible(anterior)) {
      seleccionarLeccion(anterior);
      return;
    }

    window.location.href = crearUrlRegresoCurso();
  };

  const irSiguienteLeccion = async () => {
    const leccion = estado.leccionActual;
    const siguiente = obtenerSiguienteLeccion(leccion);

    if (!siguiente) {
      if (leccion && !leccion.completada && !esExamenFinal(leccion)) {
        await marcarLeccionCompletada({ moverSiguiente: false });
      }

      mostrarMensaje('No hay más lecciones en este curso.');
      return;
    }

    if (leccion && !leccion.completada && !esExamenFinal(leccion)) {
      const guardado = await marcarLeccionCompletada({ moverSiguiente: false });

      if (!guardado) {
        return;
      }
    }

    if (!leccionDisponible(siguiente)) {
      mostrarMensaje('Completa primero la lección actual para avanzar.', true);
      return;
    }

    seleccionarLeccion(siguiente);
  };

  const cargarDatosExamen = async () => {
    const idCurso = obtenerIdCurso(estado.curso) || estado.idCurso;

    if (!idCurso || !estado.idUsuario) {
      return;
    }

    try {
      const respuesta = await window.EduTech.apiRequest(`/usuarios/${estado.idUsuario}/cursos/${idCurso}/examen`);
      estado.examen = respuesta && respuesta.examen ? respuesta.examen : null;
      sincronizarExamenCompletado();
    } catch (error) {
      estado.examen = null;
      sincronizarExamenCompletado();
    }
  };

  const obtenerCursosUsuario = async () => {
    const respuesta = await window.EduTech.apiRequest(`/usuarios/${estado.idUsuario}/mis-cursos`);
    return Array.isArray(respuesta.cursos) ? respuesta.cursos : [];
  };

  const resolverInscripcion = async () => {
    if (estado.idInscripcion) {
      return estado.idInscripcion;
    }

    const cursos = await obtenerCursosUsuario();
    guardarJson('edutech_mis_cursos', cursos);

    if (estado.idCurso) {
      const curso = cursos.find((item) => String(obtenerIdCurso(item)) === String(estado.idCurso));

      if (curso && obtenerIdInscripcion(curso)) {
        return obtenerIdInscripcion(curso);
      }
    }

    const primerCurso = cursos[0];

    if (primerCurso && obtenerIdInscripcion(primerCurso)) {
      return obtenerIdInscripcion(primerCurso);
    }

    return null;
  };

  const cargarDetalleCurso = async () => {
    const idInscripcion = await resolverInscripcion();

    if (!idInscripcion) {
      throw new Error('No se encontró una inscripción activa para abrir el aula.');
    }

    estado.idInscripcion = idInscripcion;

    const respuesta = await window.EduTech.apiRequest(`/usuarios/${estado.idUsuario}/mis-cursos/${idInscripcion}`);
    const curso = respuesta.curso;

    if (!curso) {
      throw new Error('No se encontró el contenido del curso.');
    }

    estado.curso = curso;
    estado.idCurso = obtenerIdCurso(curso) || estado.idCurso;
    estado.lecciones = aplanarLecciones(curso);
    await cargarDatosExamen();
    sessionStorage.setItem('edutech_curso_detalle_id', String(estado.idCurso || ''));
    sessionStorage.setItem('edutech_id_inscripcion_actual', String(estado.idInscripcion || ''));
  };

  const seleccionarLeccionInicial = () => {
    if (estado.idLeccionInicial) {
      const porParametro = estado.lecciones.find((leccion) => String(leccion.id_leccion) === String(estado.idLeccionInicial));

      if (porParametro && leccionDisponible(porParametro)) {
        seleccionarLeccion(porParametro);
        return;
      }
    }

    const primeraPendiente = estado.lecciones.find((leccion) => !esExamenFinal(leccion) && !leccion.completada && leccionDisponible(leccion));
    const primeraDisponible = primeraPendiente || estado.lecciones.find((leccion) => leccionDisponible(leccion));

    seleccionarLeccion(primeraDisponible || null);
  };

  const cargarAula = async () => {
    try {
      ocultarMensaje();
      obtenerParametrosIniciales();

      estado.usuario = obtenerUsuarioSesion();
      estado.idUsuario = obtenerIdUsuarioSesion();

      if (!estado.usuario || !estado.idUsuario) {
        if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
          window.EduTech.guardarRedirectDespuesLogin(window.location.pathname.split('/').pop() + window.location.search);
        }

        mostrarMensaje('Inicia sesión para acceder al aula del curso.', true);
        window.setTimeout(() => {
          window.location.href = 'login.html';
        }, 900);
        return;
      }

      await cargarDetalleCurso();
      pintarEncabezado();
      pintarProgreso();
      pintarModulos();
      seleccionarLeccionInicial();
    } catch (error) {
      ocultarVistasContenido();
      mostrar(elementos.estadoVacio);
      mostrarMensaje(error && error.message ? error.message : 'No se pudo cargar el aula del curso.', true);
    } finally {
      marcarPaginaLista();
    }
  };

  if (elementos.btnAnterior) {
    elementos.btnAnterior.addEventListener('click', irLeccionAnteriorOVolver);
  }

  if (elementos.btnSiguiente) {
    elementos.btnSiguiente.addEventListener('click', irSiguienteLeccion);
  }

  if (elementos.btnExamenAnterior) {
    elementos.btnExamenAnterior.addEventListener('click', irLeccionAnteriorOVolver);
  }

  if (elementos.btnExamenVolver) {
    elementos.btnExamenVolver.addEventListener('click', () => {
      window.location.href = crearUrlRegresoCurso();
    });
  }

  if (elementos.btnExamen) {
    elementos.btnExamen.addEventListener('click', (evento) => {
      if (!examenDisponible()) {
        evento.preventDefault();
        mostrarMensaje('Completa todas las lecciones antes de presentar el examen final.', true);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', cargarAula);
})();
