const marcarPaginaDatosLista = () => {
  if (window.EduTechMarcarPaginaLista) {
    window.EduTechMarcarPaginaLista();
  }
};

const misCursosGrid = document.getElementById('misCursosGrid');
const misCursosVacio = document.getElementById('misCursosVacio');
const misCursosConteo = document.getElementById('misCursosConteo');
const misCursosMensaje = document.getElementById('misCursosMensaje');

const STORAGE_MIS_CURSOS = 'edutech_mis_cursos';
const STORAGE_CURSOS_COMPRADOS = 'edutech_cursos_comprados_ids';

const mostrarElemento = (elemento, display = 'block') => {
  if (elemento) {
    elemento.style.setProperty('display', display, 'important');
  }
};

const ocultarElemento = (elemento) => {
  if (elemento) {
    elemento.style.setProperty('display', 'none', 'important');
  }
};

const limpiarTexto = (valor) => String(valor || '').trim();

const leerJsonStorage = (clave, storage = localStorage) => {
  const valor = storage.getItem(clave);

  if (!valor) {
    return null;
  }

  try {
    return JSON.parse(valor);
  } catch (error) {
    return null;
  }
};

const guardarJsonStorage = (clave, valor, storage = localStorage) => {
  storage.setItem(clave, JSON.stringify(valor));
};

const conTiempoMaximo = (promesa, milisegundos = 1400) => {
  return Promise.race([
    promesa,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error('Tiempo de espera agotado')), milisegundos);
    })
  ]);
};

const obtenerUsuarioActual = () => {
  if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
    return window.EduTech.obtenerUsuarioSesion();
  }

  return leerJsonStorage('edutech_usuario');
};

const obtenerIdUsuarioActual = () => {
  if (window.EduTech && typeof window.EduTech.obtenerIdUsuarioSesion === 'function') {
    const id = window.EduTech.obtenerIdUsuarioSesion();

    if (id) {
      return id;
    }
  }

  const idDirecto = localStorage.getItem('edutech_id_usuario');

  if (idDirecto) {
    return idDirecto;
  }

  const usuario = obtenerUsuarioActual();
  return usuario ? (usuario.id_usuario || usuario.id || null) : null;
};

const obtenerCursosLocales = () => {
  const cursos = leerJsonStorage(STORAGE_MIS_CURSOS);
  return Array.isArray(cursos) ? cursos : [];
};

const obtenerCatalogoCursos = () => {
  const cursos = leerJsonStorage('edutech_catalogo_cursos');
  return Array.isArray(cursos) ? cursos : [];
};

const CLAVES_NIVEL_CURSO = [
  'nombre_nivel',
  'nivel',
  'dificultad',
  'nombre_dificultad',
  'dificultad_curso',
  'nivel_curso'
];

const esNivelInvalido = (valor) => {
  const texto = String(valor || '').trim().toLowerCase();

  return !texto || [
    'curso disponible',
    'nivel no disponible',
    'no disponible',
    'disponible',
    'por definir',
    'sin nivel'
  ].includes(texto);
};

const obtenerNivelValido = (curso) => {
  for (const clave of CLAVES_NIVEL_CURSO) {
    const valor = curso && curso[clave];

    if (!esNivelInvalido(valor)) {
      return valor;
    }
  }

  return '';
};

const obtenerCursoCatalogo = (curso) => {
  const idCurso = curso.id_curso || curso.idCurso || curso.id;
  const tituloCurso = limpiarTexto(curso.curso || curso.titulo).toLowerCase();

  return obtenerCatalogoCursos().find((item) => {
    const idItem = item.id_curso || item.idCurso || item.id;
    const tituloItem = limpiarTexto(item.curso || item.titulo).toLowerCase();

    if (idCurso && idItem && String(idCurso) === String(idItem)) {
      return true;
    }

    return Boolean(tituloCurso && tituloItem && tituloCurso === tituloItem);
  }) || null;
};

const combinarConCatalogo = (curso) => {
  const catalogo = obtenerCursoCatalogo(curso);

  if (!catalogo) {
    return curso;
  }

  const nivelCompra = obtenerNivelValido(curso);
  const nivelCatalogo = obtenerNivelValido(catalogo);
  const nivelFinal = nivelCompra || nivelCatalogo;

  return {
    ...catalogo,
    ...curso,
    nombre_nivel: nivelFinal || '',
    nivel: nivelFinal || '',
    dificultad: nivelFinal || '',
    descripcion: curso.descripcion || catalogo.descripcion,
    total_lecciones: curso.total_lecciones || curso.lecciones || catalogo.total_lecciones || catalogo.lecciones,
    lecciones: curso.lecciones || curso.total_lecciones || catalogo.lecciones || catalogo.total_lecciones,
    imagen_portada: curso.imagen_portada || curso.imagen || catalogo.imagen_portada || catalogo.imagen
  };
};

const esFechaValida = (fecha) => {
  if (!fecha) {
    return false;
  }

  const texto = String(fecha).trim().toLowerCase();

  if (!texto || texto === 'fecha no disponible' || texto === 'null' || texto === 'undefined') {
    return false;
  }

  const fechaObjeto = new Date(fecha);
  return !Number.isNaN(fechaObjeto.getTime());
};

const formatearFecha = (fecha) => {
  if (!esFechaValida(fecha)) {
    return 'Fecha no disponible';
  }

  const fechaObjeto = new Date(fecha);

  return fechaObjeto.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const obtenerMapaFechasCompra = () => {
  const mapa = leerJsonStorage('edutech_fechas_compra_cursos');
  return mapa && typeof mapa === 'object' && !Array.isArray(mapa) ? mapa : {};
};

const guardarMapaFechasCompra = (mapa) => {
  guardarJsonStorage('edutech_fechas_compra_cursos', mapa);
};

const obtenerFechaDesdeCompraConfirmada = (curso) => {
  const idCurso = curso && (curso.id_curso || curso.idCurso || curso.id);
  const compraConfirmada = leerJsonStorage('edutech_compra_aprobada_backend');
  const compraPendiente = leerJsonStorage('edutech_compra_pendiente', sessionStorage);
  const compras = [compraConfirmada, compraPendiente].filter(Boolean);

  for (const compra of compras) {
    const idCompra = compra.id_curso || compra.idCurso || compra.id;

    if (idCurso && idCompra && String(idCurso) !== String(idCompra)) {
      continue;
    }

    const fecha = obtenerCampoCurso(compra, [
      'fecha_compra',
      'fecha_pago',
      'fecha_inscripcion',
      'fecha_orden',
      'fecha_creacion',
      'fecha'
    ]);

    if (esFechaValida(fecha)) {
      return fecha;
    }
  }

  return '';
};

const obtenerFechaCompraCurso = (curso) => {
  const fechaDirecta = obtenerCampoCurso(curso, [
    'fecha_compra',
    'fecha_pago',
    'fecha_inscripcion',
    'fecha_orden',
    'fecha_creacion',
    'created_at',
    'fecha'
  ]);

  if (esFechaValida(fechaDirecta)) {
    return fechaDirecta;
  }

  const idCurso = curso && (curso.id_curso || curso.idCurso || curso.id);
  const mapaFechas = obtenerMapaFechasCompra();
  const fechaMapa = idCurso ? mapaFechas[String(idCurso)] : '';

  if (esFechaValida(fechaMapa)) {
    return fechaMapa;
  }

  const fechaCompraConfirmada = obtenerFechaDesdeCompraConfirmada(curso);

  if (esFechaValida(fechaCompraConfirmada)) {
    return fechaCompraConfirmada;
  }

  return '';
};

const asegurarFechaCurso = (curso) => {
  const fechaExistente = obtenerFechaCompraCurso(curso);
  const fechaFinal = esFechaValida(fechaExistente) ? fechaExistente : new Date().toISOString();
  const idCurso = curso && (curso.id_curso || curso.idCurso || curso.id);

  if (idCurso) {
    const mapaFechas = obtenerMapaFechasCompra();
    mapaFechas[String(idCurso)] = fechaFinal;
    guardarMapaFechasCompra(mapaFechas);
  }

  return {
    ...curso,
    fecha_compra: fechaFinal,
    fecha_inscripcion: curso.fecha_inscripcion || fechaFinal
  };
};

const formatearPorcentaje = (valor) => {
  const numero = Number(valor);

  if (Number.isNaN(numero) || numero < 0) {
    return 0;
  }

  if (numero > 100) {
    return 100;
  }

  return Math.round(numero);
};

const normalizarTextoVisible = (valor) => {
  const texto = String(valor || '').trim();

  if (!texto) {
    return '';
  }

  return texto
    .toLowerCase()
    .replace(/(^|[\s,\/])([a-záéíóúüñ])/g, (_, prefijo, letra) => `${prefijo}${letra.toUpperCase()}`);
};

const obtenerInstructor = (curso) => {
  const instructorLocal = limpiarTexto(curso.instructor);

  if (instructorLocal) {
    return instructorLocal;
  }

  const nombre = limpiarTexto(curso.nombre_instructor);
  const apellido = limpiarTexto(curso.apellido_paterno_instructor);
  const instructor = `${nombre} ${apellido}`.trim();

  return instructor || 'Instructor EduTech';
};

const obtenerTituloCurso = (curso) => {
  return limpiarTexto(curso.titulo) || limpiarTexto(curso.curso) || 'Curso EduTech';
};

const normalizarEstadoAcceso = (valor) => {
  const estado = limpiarTexto ? limpiarTexto(valor).toLowerCase() : String(valor || '').trim().toLowerCase();

  if (!estado) {
    return 'Activo';
  }

  if (['aprobada', 'aprobado', 'activa', 'activo', 'matriculado', 'comprado', 'completada'].includes(estado)) {
    return 'Activo';
  }

  if (estado === 'completado') {
    return 'Completado';
  }

  return normalizarTextoVisible ? normalizarTextoVisible(estado) : estado;
};

const obtenerCampoCurso = (curso, claves) => {
  for (const clave of claves) {
    const valor = curso[clave];

    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
      return valor;
    }
  }

  return '';
};

const obtenerNivelCurso = (curso) => {
  return normalizarTextoVisible(obtenerNivelValido(curso) || 'Nivel no disponible');
};

const obtenerEstadoCurso = (curso) => {
  const estado = obtenerCampoCurso(curso, [
    'nombre_estado_inscripcion',
    'estado_inscripcion',
    'estado',
    'estatus'
  ]);

  return normalizarEstadoAcceso(estado);
};

const obtenerFechaCurso = (curso) => {
  return obtenerFechaCompraCurso(curso);
};

const obtenerTotalLecciones = (curso) => {
  const total = Number(curso.total_lecciones || curso.lecciones || curso.numero_lecciones || 0);
  return Number.isNaN(total) ? 0 : total;
};

const obtenerLeccionesCompletadas = (curso) => {
  const completadas = Number(curso.lecciones_completadas || curso.completadas || 0);
  return Number.isNaN(completadas) ? 0 : completadas;
};

const obtenerAvance = (curso) => {
  if (curso.porcentaje_avance !== undefined && curso.porcentaje_avance !== null) {
    return formatearPorcentaje(curso.porcentaje_avance);
  }

  if (curso.avance !== undefined && curso.avance !== null) {
    return formatearPorcentaje(curso.avance);
  }

  const total = obtenerTotalLecciones(curso);
  const completadas = obtenerLeccionesCompletadas(curso);

  if (total <= 0) {
    return 0;
  }

  return formatearPorcentaje((completadas / total) * 100);
};

const obtenerImagenCurso = (curso) => {
  const imagen = limpiarTexto(curso.imagen_portada) || limpiarTexto(curso.imagen) || limpiarTexto(curso.portada);

  if (imagen) {
    return imagen;
  }

  return 'assets/img/curso-hackeo.jpg';
};

const normalizarCurso = (curso) => {
  curso = combinarConCatalogo(curso);

  const idCurso = Number(curso.id_curso || curso.idCurso || curso.id || 0);
  const idInscripcion = curso.id_inscripcion || curso.idInscripcion || null;
  const titulo = obtenerTituloCurso(curso);
  const totalLecciones = obtenerTotalLecciones(curso);
  const leccionesCompletadas = obtenerLeccionesCompletadas(curso);
  const avance = obtenerAvance(curso);

  return asegurarFechaCurso({
    ...curso,
    id_curso: idCurso || curso.id_curso || null,
    id_inscripcion: idInscripcion,
    titulo,
    curso: titulo,
    instructor: obtenerInstructor(curso),
    nivel: obtenerNivelCurso(curso),
    estado: obtenerEstadoCurso(curso),
    fecha_compra: obtenerFechaCurso(curso),
    total_lecciones: totalLecciones,
    lecciones_completadas: leccionesCompletadas,
    porcentaje_avance: avance,
    imagen_portada: obtenerImagenCurso(curso)
  });
};

const quitarDuplicados = (cursos) => {
  const mapa = new Map();

  cursos.forEach((curso) => {
    const normalizado = normalizarCurso(curso);
    const clave = normalizado.id_curso ? String(normalizado.id_curso) : normalizado.titulo.toLowerCase();

    if (!mapa.has(clave)) {
      mapa.set(clave, normalizado);
      return;
    }

    const anterior = mapa.get(clave);
    const fechaAnterior = obtenerFechaCompraCurso(anterior);
    const fechaNueva = obtenerFechaCompraCurso(normalizado);
    const fechaFinal = esFechaValida(fechaNueva) ? fechaNueva : fechaAnterior;

    mapa.set(clave, asegurarFechaCurso({
      ...anterior,
      ...normalizado,
      fecha_compra: fechaFinal || normalizado.fecha_compra || anterior.fecha_compra,
      fecha_inscripcion: normalizado.fecha_inscripcion || anterior.fecha_inscripcion || fechaFinal,
      porcentaje_avance: Math.max(Number(anterior.porcentaje_avance || 0), Number(normalizado.porcentaje_avance || 0))
    }));
  });

  return Array.from(mapa.values());
};

const guardarCursosComprados = (cursos) => {
  const normalizados = quitarDuplicados(cursos);
  const ids = normalizados
    .map((curso) => Number(curso.id_curso))
    .filter((id) => Number.isInteger(id) && id > 0);

  guardarJsonStorage(STORAGE_MIS_CURSOS, normalizados);
  guardarJsonStorage(STORAGE_CURSOS_COMPRADOS, ids);

  return normalizados;
};

const obtenerCursosCatalogoBackend = async () => {
  if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    return [];
  }

  const respuesta = await conTiempoMaximo(window.EduTech.apiRequest('/cursos'));
  return Array.isArray(respuesta.cursos) ? respuesta.cursos : [];
};

const sincronizarCatalogoBackend = async () => {
  try {
    const catalogo = await obtenerCursosCatalogoBackend();

    if (catalogo.length > 0) {
      guardarJsonStorage('edutech_catalogo_cursos', catalogo);
    }
  } catch (error) {
    // Si no responde el catálogo, se usa el último guardado en localStorage.
  }
};

const obtenerCursosBackend = async () => {
  const idUsuario = obtenerIdUsuarioActual();

  if (!idUsuario || !window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    return null;
  }

  const respuesta = await conTiempoMaximo(window.EduTech.apiRequest(`/usuarios/${idUsuario}/mis-cursos`));
  const cursos = Array.isArray(respuesta.cursos) ? respuesta.cursos : [];

  return cursos;
};

const obtenerCursosParaMostrar = async () => {
  await sincronizarCatalogoBackend();

  const cursosLocales = obtenerCursosLocales();

  try {
    const cursosBackend = await obtenerCursosBackend();

    if (Array.isArray(cursosBackend) && cursosBackend.length > 0) {
      return guardarCursosComprados([...cursosLocales, ...cursosBackend]);
    }
  } catch (error) {
    if (misCursosMensaje && cursosLocales.length === 0) {
      misCursosMensaje.textContent = 'No se pudo consultar el backend. Se revisará el respaldo local de compras.';
      misCursosMensaje.style.display = 'block';
      misCursosMensaje.style.color = '#d7e8ff';
    }
  }

  return guardarCursosComprados(cursosLocales);
};

const crearElemento = (etiqueta, clase, texto) => {
  const elemento = document.createElement(etiqueta);

  if (clase) {
    elemento.className = clase;
  }

  if (texto !== undefined && texto !== null) {
    elemento.textContent = texto;
  }

  return elemento;
};

const crearFilaDato = (etiqueta, valor) => {
  const fila = crearElemento('p', 'my-course-data');
  const fuerte = crearElemento('strong', null, `${etiqueta}: `);
  const texto = document.createTextNode(valor);

  fila.appendChild(fuerte);
  fila.appendChild(texto);

  return fila;
};

const crearProgreso = (curso) => {
  const avance = obtenerAvance(curso);
  const bloque = crearElemento('div', 'my-course-progress');
  const texto = crearElemento('div', 'my-course-progress-text');
  const etiqueta = crearElemento('span', null, 'Avance');
  const porcentaje = crearElemento('strong', null, `${avance}%`);
  const barra = crearElemento('div', 'my-course-progress-track');
  const relleno = crearElemento('div', 'my-course-progress-fill');

  relleno.style.width = `${avance}%`;
  texto.appendChild(etiqueta);
  texto.appendChild(porcentaje);
  barra.appendChild(relleno);
  bloque.appendChild(texto);
  bloque.appendChild(barra);

  return bloque;
};

const crearTarjetaCursoComprado = (curso) => {
  const tarjeta = crearElemento('article', 'my-course-card my-course-card-owned');
  const idCurso = curso.id_curso ? Number(curso.id_curso) : null;
  const titulo = obtenerTituloCurso(curso);
  const urlEntrada = idCurso ? `detalle-curso.html?id=${idCurso}` : 'cursos.html';

  if (idCurso) {
    tarjeta.dataset.idCurso = String(idCurso);
  }

  const enlaceImagen = crearElemento('a', 'my-course-image');
  enlaceImagen.href = urlEntrada;
  enlaceImagen.setAttribute('aria-label', `Entrar al curso ${titulo}`);

  const imagen = crearElemento('img');
  imagen.src = obtenerImagenCurso(curso);
  imagen.alt = `Imagen del curso ${titulo}`;
  imagen.loading = 'lazy';

  imagen.onerror = () => {
    imagen.onerror = null;
    imagen.removeAttribute('src');
    imagen.alt = '';
    enlaceImagen.classList.add('my-course-image-empty');
  };

  enlaceImagen.appendChild(imagen);

  const cuerpo = crearElemento('div', 'my-course-body');

  const tituloElemento = crearElemento('h3');
  const tituloLink = crearElemento('a', null, titulo);
  tituloLink.href = urlEntrada;
  tituloElemento.appendChild(tituloLink);

  const instructor = crearElemento('p', 'my-course-instructor');
  instructor.innerHTML = `<strong>Instructor:</strong> ${obtenerInstructor(curso)}`;
  const nivel = crearFilaDato('Dificultad', obtenerNivelCurso(curso));
  const lecciones = crearFilaDato('Número de lecciones', `${obtenerTotalLecciones(curso)} lecciones`);
  const estadoDato = crearFilaDato('Estado', obtenerEstadoCurso(curso));
  const fechaDato = crearFilaDato('Comprado', formatearFecha(obtenerFechaCurso(curso)));
  const progreso = crearProgreso(curso);

  const acciones = crearElemento('div', 'my-course-actions');
  const entrar = crearElemento('a', 'my-course-entry-button', 'Entrar al curso');
  entrar.href = urlEntrada;
  acciones.appendChild(entrar);

  cuerpo.appendChild(tituloElemento);
  cuerpo.appendChild(instructor);
  cuerpo.appendChild(nivel);
  cuerpo.appendChild(lecciones);
  cuerpo.appendChild(estadoDato);
  cuerpo.appendChild(fechaDato);
  cuerpo.appendChild(progreso);
  cuerpo.appendChild(acciones);

  tarjeta.appendChild(enlaceImagen);
  tarjeta.appendChild(cuerpo);

  return tarjeta;
};

const pintarCursosComprados = async () => {
  if (!misCursosGrid || !misCursosVacio) {
    return;
  }

  ocultarElemento(misCursosVacio);
  ocultarElemento(misCursosGrid);

  const cursos = await obtenerCursosParaMostrar();
  misCursosGrid.innerHTML = '';

  if (cursos.length === 0) {
    mostrarElemento(misCursosVacio);

    if (misCursosConteo) {
      misCursosConteo.textContent = 'No hay cursos comprados todavía.';
    }

    return;
  }

  cursos.forEach((curso) => {
    misCursosGrid.appendChild(crearTarjetaCursoComprado(curso));
  });

  mostrarElemento(misCursosGrid, 'grid');
  ocultarElemento(misCursosVacio);

  if (misCursosConteo) {
    misCursosConteo.textContent = cursos.length === 1 ? '1 curso comprado.' : `${cursos.length} cursos comprados.`;
  }

  if (misCursosMensaje) {
    misCursosMensaje.textContent = '';
    misCursosMensaje.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await pintarCursosComprados();
  } finally {
    marcarPaginaDatosLista();
  }
});
