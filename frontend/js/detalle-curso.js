const marcarPaginaDatosLista = () => {
  if (window.EduTechMarcarPaginaLista) {
    window.EduTechMarcarPaginaLista();
  }
};

const detalleContenidoVisual = document.getElementById('detalleContenidoVisual');
const detalleMensaje = document.getElementById('detalleMensaje');
const detalleAutor = document.getElementById('detalleAutor');
const detalleTitulo = document.getElementById('detalleTitulo');
const detalleNivel = document.getElementById('detalleNivel');
const detalleCategorias = document.getElementById('detalleCategorias');
const detalleLecciones = document.getElementById('detalleLecciones');
const detallePrecio = document.getElementById('detallePrecio');
const detalleImagen = document.getElementById('detalleImagen');
const detalleImagenContenedor = document.getElementById('detalleImagenContenedor');
const detalleDescripcion = document.getElementById('detalleDescripcion');
const detalleDescripcionExtra = document.getElementById('detalleDescripcionExtra');
const detalleConocimientos = document.getElementById('detalleConocimientos');
const detalleInstructorAvatar = document.getElementById('detalleInstructorAvatar');
const detalleInstructor = document.getElementById('detalleInstructor');
const detallePrecioCompra = document.getElementById('detallePrecioCompra');
const detalleBotonCompra = document.getElementById('detalleBotonCompra');
const detalleContenido = document.getElementById('detalleContenido');

const obtenerUsuarioDetalle = () => {
  if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
    return window.EduTech.obtenerUsuarioSesion();
  }

  try {
    return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
  } catch (error) {
    return null;
  }
};

const usuarioEsInstructorDetalle = () => {
  const usuario = obtenerUsuarioDetalle();

  if (!usuario) {
    return false;
  }

  if (window.EduTech && typeof window.EduTech.usuarioTieneRol === 'function') {
    return window.EduTech.usuarioTieneRol(usuario, 'Instructor');
  }

  const idRol = Number(usuario.id_rol || usuario.idRol || 0);
  const rol = String(usuario.nombre_rol || usuario.rol || '').trim().toLowerCase();

  return idRol === 2 || rol === 'instructor';
};

const mostrarContenidoDetalle = () => {
  if (detalleContenidoVisual) {
    detalleContenidoVisual.style.setProperty('display', 'block', 'important');
  }
};

const ocultarContenidoDetalle = () => {
  if (detalleContenidoVisual) {
    detalleContenidoVisual.style.setProperty('display', 'none', 'important');
  }
};

const mostrarMensajeDetalle = (mensaje, esError = false) => {
  if (!detalleMensaje) {
    return;
  }

  detalleMensaje.textContent = mensaje;
  detalleMensaje.style.display = 'block';
  detalleMensaje.style.color = esError ? '#ff5c5c' : '#19d37d';
};

const ocultarMensajeDetalle = () => {
  if (!detalleMensaje) {
    return;
  }

  detalleMensaje.textContent = '';
  detalleMensaje.style.display = 'none';
};

const obtenerIdCurso = () => {
  const parametros = new URLSearchParams(window.location.search);
  const idQuery = parametros.get('id');

  if (idQuery && Number.isInteger(Number(idQuery)) && Number(idQuery) > 0) {
    sessionStorage.setItem('edutech_curso_detalle_id', idQuery);
    sessionStorage.setItem('edutech_curso_compra_id', idQuery);
    return idQuery;
  }

  const idGuardado = sessionStorage.getItem('edutech_curso_detalle_id');

  if (idGuardado && Number.isInteger(Number(idGuardado)) && Number(idGuardado) > 0) {
    sessionStorage.setItem('edutech_curso_compra_id', idGuardado);
    return idGuardado;
  }

  return null;
};


const leerJsonStorage = (clave, valorDefault = null) => {
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

const obtenerCursosCompradosLocales = () => {
  const cursos = leerJsonStorage('edutech_mis_cursos', []);
  return Array.isArray(cursos) ? cursos : [];
};

const obtenerCatalogoCursos = () => {
  const cursos = leerJsonStorage('edutech_catalogo_cursos', []);
  return Array.isArray(cursos) ? cursos : [];
};

const obtenerCursoCatalogoLocal = (idCurso) => {
  if (!idCurso) {
    return null;
  }

  return obtenerCatalogoCursos().find((curso) => {
    const id = curso.id_curso || curso.idCurso || curso.id;
    return String(id) === String(idCurso);
  }) || null;
};

const obtenerCursoCompradoLocal = (idCurso) => {
  if (!idCurso) {
    return null;
  }

  const comprado = obtenerCursosCompradosLocales().find((curso) => {
    const id = curso.id_curso || curso.idCurso || curso.id;
    return String(id) === String(idCurso);
  }) || null;
  const catalogo = obtenerCursoCatalogoLocal(idCurso);

  if (comprado && catalogo) {
    return {
      ...catalogo,
      ...comprado,
      nombre_nivel: comprado.nombre_nivel || comprado.nivel || catalogo.nombre_nivel || catalogo.nivel,
      nivel: comprado.nivel || comprado.nombre_nivel || catalogo.nivel || catalogo.nombre_nivel,
      descripcion: comprado.descripcion || catalogo.descripcion,
      categorias: Array.isArray(comprado.categorias) && comprado.categorias.length > 0 ? comprado.categorias : catalogo.categorias,
      modulos: Array.isArray(comprado.modulos) && comprado.modulos.length > 0 ? comprado.modulos : catalogo.modulos
    };
  }

  return comprado || catalogo || null;
};

const obtenerCursosCompradosIds = () => {
  const idsGuardados = localStorage.getItem('edutech_cursos_comprados_ids');

  if (idsGuardados) {
    try {
      const ids = JSON.parse(idsGuardados);

      if (Array.isArray(ids)) {
        return ids.map((id) => String(id));
      }
    } catch (error) {
      return [];
    }
  }

  const cursosGuardados = localStorage.getItem('edutech_mis_cursos');

  if (!cursosGuardados) {
    return [];
  }

  try {
    const cursos = JSON.parse(cursosGuardados);

    if (!Array.isArray(cursos)) {
      return [];
    }

    return cursos
      .map((curso) => curso.id_curso || curso.idCurso || curso.id)
      .filter(Boolean)
      .map((id) => String(id));
  } catch (error) {
    return [];
  }
};

const cursoEstaComprado = (idCurso) => {
  if (!idCurso) {
    return false;
  }

  return obtenerCursosCompradosIds().includes(String(idCurso));
};

const haySesionActivaDetalle = () => {
  if (window.EduTech && typeof window.EduTech.haySesionActiva === 'function') {
    return window.EduTech.haySesionActiva();
  }

  return localStorage.getItem('edutech_sesion_activa') === 'true'
    && Boolean(localStorage.getItem('edutech_usuario'));
};

const formatearPrecio = (precio) => {
  const numero = Number(precio);

  if (Number.isNaN(numero)) {
    return '$0 MXN';
  }

  return `$${numero.toLocaleString('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })} MXN`;
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
  const instructorLocal = String(curso.instructor || '').trim();

  if (instructorLocal) {
    return instructorLocal;
  }

  const nombre = curso.nombre_instructor || '';
  const apellido = curso.apellido_paterno_instructor || '';
  const instructor = `${nombre} ${apellido}`.trim();

  return instructor || 'Instructor EduTech';
};

const obtenerNivel = (curso) => {
  return normalizarTextoVisible(
    curso.nombre_nivel ||
    curso.nivel ||
    curso.dificultad ||
    curso.nombre_dificultad ||
    curso.dificultad_curso ||
    curso.nivel_curso ||
    'Curso disponible'
  );
};

const obtenerImagenCurso = (curso) => {
  const imagen = (curso.imagen_portada || curso.imagen || curso.portada) ? String(curso.imagen_portada || curso.imagen || curso.portada).trim() : '';

  if (imagen !== '') {
    return imagen;
  }

  return null;
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

const cargarImagenDetalle = (curso) => {
  return new Promise((resolve) => {
    if (!detalleImagen || !detalleImagenContenedor) {
      resolve();
      return;
    }

    const imagen = obtenerImagenCurso(curso);
    detalleImagenContenedor.style.display = '';

    if (!imagen) {
      detalleImagen.removeAttribute('src');
      detalleImagen.alt = '';
      detalleImagen.style.display = 'none';
      detalleImagenContenedor.style.display = 'none';
      resolve();
      return;
    }

    detalleImagen.style.display = 'block';
    detalleImagen.style.visibility = 'hidden';
    detalleImagen.alt = `Imagen del curso ${curso.titulo || 'EduTech'}`;

    detalleImagen.onload = () => {
      detalleImagen.onload = null;
      detalleImagen.onerror = null;
      detalleImagen.style.visibility = 'visible';
      resolve();
    };

    detalleImagen.onerror = () => {
      detalleImagen.onload = null;
      detalleImagen.onerror = null;
      detalleImagen.removeAttribute('src');
      detalleImagen.alt = '';
      detalleImagen.style.display = 'none';
      detalleImagenContenedor.style.display = 'none';
      resolve();
    };

    detalleImagen.src = imagen;

    if (detalleImagen.complete && detalleImagen.naturalWidth > 0) {
      detalleImagen.onload();
    }
  });
};

const pintarCategorias = (curso) => {
  if (!detalleCategorias) {
    return;
  }

  detalleCategorias.innerHTML = '';

  const categorias = Array.isArray(curso.categorias) ? curso.categorias : [];

  if (categorias.length === 0) {
    detalleCategorias.textContent = 'Sin categoría';
    return;
  }

  categorias.forEach((categoria, index) => {
    const enlace = crearElemento('a', null, categoria.nombre_categoria);
    enlace.href = 'cursos.html';

    detalleCategorias.appendChild(enlace);

    if (index < categorias.length - 1) {
      detalleCategorias.appendChild(document.createTextNode(', '));
    }
  });
};

const pintarConocimientos = () => {
  if (!detalleConocimientos) {
    return;
  }

  detalleConocimientos.innerHTML = '';

  const conocimientos = [
    'Conceptos básicos de navegación web.',
    'Uso general de formularios, usuarios y contraseñas.',
    'Interés por aprender el tema del curso paso a paso.'
  ];

  conocimientos.forEach((texto) => {
    const item = crearElemento('li', null, texto);
    detalleConocimientos.appendChild(item);
  });
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

  const usuario = leerJsonStorage('edutech_usuario', null);
  return usuario ? (usuario.id_usuario || usuario.id || null) : null;
};

const guardarJsonLocal = (clave, valor) => {
  localStorage.setItem(clave, JSON.stringify(valor));
};

const obtenerAvancesLocales = () => {
  const avances = leerJsonStorage('edutech_avances_cursos', {});
  return avances && typeof avances === 'object' && !Array.isArray(avances) ? avances : {};
};

const obtenerIdCursoValor = (curso) => curso && (curso.id_curso || curso.id || curso.idCurso);

const obtenerIdInscripcionCurso = (curso) => {
  const idDirecto = curso && (curso.id_inscripcion || curso.idInscripcion);

  if (idDirecto) {
    return idDirecto;
  }

  const idCurso = obtenerIdCursoValor(curso);
  const comprado = obtenerCursoCompradoLocal(idCurso);

  return comprado ? (comprado.id_inscripcion || comprado.idInscripcion || null) : null;
};

const obtenerUrlAulaCurso = (curso, leccion = null) => {
  const idCurso = obtenerIdCursoValor(curso);
  const idInscripcion = obtenerIdInscripcionCurso(curso);
  const parametros = new URLSearchParams();

  if (idInscripcion) {
    parametros.set('idInscripcion', String(idInscripcion));
  }

  if (idCurso) {
    parametros.set('idCurso', String(idCurso));
  }

  const idLeccion = leccion && (leccion.id_leccion || leccion.idLeccion || leccion.id);

  if (idLeccion) {
    parametros.set('idLeccion', String(idLeccion));
  }

  const query = parametros.toString();
  return query ? `aula.html?${query}` : 'aula.html';
};

const obtenerUrlExamenCurso = (curso) => {
  const idCurso = obtenerIdCursoValor(curso);
  const idInscripcion = obtenerIdInscripcionCurso(curso);
  const parametros = new URLSearchParams();

  if (idCurso) {
    parametros.set('id', String(idCurso));
  }

  if (idInscripcion) {
    parametros.set('idInscripcion', String(idInscripcion));
  }

  const query = parametros.toString();
  return query ? `examen.html?${query}` : 'examen.html';
};

const contarLeccionesCurso = (curso) => {
  const modulos = Array.isArray(curso && curso.modulos) ? curso.modulos : [];

  if (modulos.length > 0) {
    return modulos.reduce((total, modulo) => {
      const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];
      return total + lecciones.length;
    }, 0);
  }

  const totalDirecto = Number(curso && (curso.total_lecciones || curso.lecciones || curso.numero_lecciones));
  return Number.isNaN(totalDirecto) ? 0 : totalDirecto;
};

const leccionCompletadaLocalmente = (curso, leccion) => {
  const idCurso = obtenerIdCursoValor(curso);
  const idLeccion = leccion && (leccion.id_leccion || leccion.idLeccion || leccion.id);

  if (!idCurso || !idLeccion) {
    return false;
  }

  const avances = obtenerAvancesLocales();
  return Boolean(avances[String(idCurso)] && avances[String(idCurso)][String(idLeccion)]);
};

const leccionEstaCompletada = (curso, leccion) => {
  return Boolean(
    leccion && (
      leccion.completada === true ||
      leccion.esta_completada === true ||
      leccion.completada === 'true' ||
      leccionCompletadaLocalmente(curso, leccion)
    )
  );
};

const obtenerLeccionesPlanas = (curso) => {
  const modulos = Array.isArray(curso && curso.modulos) ? curso.modulos : [];
  const leccionesPlanas = [];

  modulos.forEach((modulo, indiceModulo) => {
    const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];

    lecciones.forEach((leccion, indiceLeccion) => {
      leccionesPlanas.push({
        modulo,
        leccion,
        indiceModulo,
        indiceLeccion
      });
    });
  });

  return leccionesPlanas;
};

const contarLeccionesCompletadasCurso = (curso) => {
  const leccionesPlanas = obtenerLeccionesPlanas(curso);

  if (leccionesPlanas.length > 0) {
    return leccionesPlanas.filter(({ leccion }) => leccionEstaCompletada(curso, leccion)).length;
  }

  const completadasDirectas = Number(curso && (curso.lecciones_completadas || curso.completadas));

  if (!Number.isNaN(completadasDirectas) && completadasDirectas > 0) {
    return completadasDirectas;
  }

  const idCurso = obtenerIdCursoValor(curso);
  const avances = obtenerAvancesLocales();
  const avanceCurso = idCurso ? avances[String(idCurso)] : null;

  if (!avanceCurso) {
    return 0;
  }

  return Object.values(avanceCurso).filter(Boolean).length;
};

const actualizarCursoCompradoLocal = (curso) => {
  const idCurso = obtenerIdCursoValor(curso);

  if (!idCurso) {
    return;
  }

  const cursos = obtenerCursosCompradosLocales();
  const totalLecciones = contarLeccionesCurso(curso);
  const leccionesCompletadas = contarLeccionesCompletadasCurso(curso);
  const porcentajeAvance = totalLecciones > 0
    ? Math.min(100, Math.round((leccionesCompletadas / totalLecciones) * 100))
    : 0;

  const datosActualizados = {
    id_curso: idCurso,
    id_inscripcion: obtenerIdInscripcionCurso(curso),
    titulo: curso.titulo || curso.curso,
    curso: curso.curso || curso.titulo,
    nombre_nivel: curso.nombre_nivel || curso.nivel,
    nivel: curso.nivel || curso.nombre_nivel,
    instructor: obtenerInstructor(curso),
    nombre_instructor: curso.nombre_instructor,
    apellido_paterno_instructor: curso.apellido_paterno_instructor,
    descripcion: curso.descripcion,
    imagen_portada: curso.imagen_portada || curso.imagen,
    precio_mxn: curso.precio_mxn || curso.precio,
    total_lecciones: totalLecciones,
    lecciones_completadas: leccionesCompletadas,
    porcentaje_avance: porcentajeAvance,
    fecha_compra: curso.fecha_compra || curso.fecha_inscripcion,
    fecha_inscripcion: curso.fecha_inscripcion || curso.fecha_compra,
    nombre_estado_inscripcion: curso.nombre_estado_inscripcion || curso.estado || 'Activa'
  };

  const indice = cursos.findIndex((item) => String(obtenerIdCursoValor(item)) === String(idCurso));

  if (indice >= 0) {
    cursos[indice] = {
      ...cursos[indice],
      ...datosActualizados
    };
  } else {
    cursos.push(datosActualizados);
  }

  guardarJsonLocal('edutech_mis_cursos', cursos);
  guardarJsonLocal('edutech_cursos_comprados_ids', cursos
    .map((item) => Number(obtenerIdCursoValor(item)))
    .filter((id) => Number.isInteger(id) && id > 0));
};

const guardarAvanceLeccionLocal = (curso, leccion) => {
  const idCurso = obtenerIdCursoValor(curso);
  const idLeccion = leccion && (leccion.id_leccion || leccion.idLeccion || leccion.id);

  if (!idCurso || !idLeccion) {
    return;
  }

  const avances = obtenerAvancesLocales();

  if (!avances[String(idCurso)]) {
    avances[String(idCurso)] = {};
  }

  avances[String(idCurso)][String(idLeccion)] = true;
  guardarJsonLocal('edutech_avances_cursos', avances);
};

const sincronizarMisCursosBackend = async (idCurso) => {
  const idUsuario = obtenerIdUsuarioActual();

  if (!idUsuario || !window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    return null;
  }

  const respuesta = await window.EduTech.apiRequest(`/usuarios/${idUsuario}/mis-cursos`);
  const cursos = Array.isArray(respuesta.cursos) ? respuesta.cursos : [];

  if (cursos.length > 0) {
    const locales = obtenerCursosCompradosLocales();
    const mapa = new Map();

    [...locales, ...cursos].forEach((curso) => {
      const id = obtenerIdCursoValor(curso);
      const clave = id ? String(id) : String(curso.titulo || curso.curso || '').toLowerCase();
      mapa.set(clave, { ...(mapa.get(clave) || {}), ...curso });
    });

    const cursosFinales = Array.from(mapa.values());
    guardarJsonLocal('edutech_mis_cursos', cursosFinales);
    guardarJsonLocal('edutech_cursos_comprados_ids', cursosFinales
      .map((curso) => Number(obtenerIdCursoValor(curso)))
      .filter((id) => Number.isInteger(id) && id > 0));
  }

  return cursos.find((curso) => String(obtenerIdCursoValor(curso)) === String(idCurso)) || null;
};

const obtenerDetalleInscritoBackend = async (idCurso) => {
  const idUsuario = obtenerIdUsuarioActual();

  if (!idUsuario || !window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    return null;
  }

  let cursoComprado = obtenerCursoCompradoLocal(idCurso);
  let idInscripcion = obtenerIdInscripcionCurso(cursoComprado);

  if (!idInscripcion) {
    cursoComprado = await sincronizarMisCursosBackend(idCurso);
    idInscripcion = obtenerIdInscripcionCurso(cursoComprado);
  }

  if (!idInscripcion) {
    return null;
  }

  const respuesta = await window.EduTech.apiRequest(`/usuarios/${idUsuario}/mis-cursos/${idInscripcion}`);
  const curso = respuesta.curso || null;

  if (!curso) {
    return null;
  }

  const cursoFinal = {
    ...curso,
    id_curso: curso.id_curso || idCurso,
    id_inscripcion: curso.id_inscripcion || idInscripcion
  };

  actualizarCursoCompradoLocal(cursoFinal);
  return cursoFinal;
};

const cursoTieneModulosPublicados = (curso) => {
  return Array.isArray(curso && curso.modulos) && curso.modulos.some((modulo) => {
    return Array.isArray(modulo.lecciones) && modulo.lecciones.length > 0;
  });
};

const combinarCursoConContenido = (base, contenido, idCurso) => {
  const cursoBase = base || {};
  const cursoContenido = contenido || {};
  const modulosBase = Array.isArray(cursoBase.modulos) ? cursoBase.modulos : [];
  const modulosContenido = Array.isArray(cursoContenido.modulos) ? cursoContenido.modulos : [];
  const usarModulosBase = modulosBase.some((modulo) => Array.isArray(modulo.lecciones) && modulo.lecciones.length > 0);

  return {
    ...cursoContenido,
    ...cursoBase,
    id_curso: cursoBase.id_curso || cursoContenido.id_curso || idCurso,
    titulo: cursoBase.titulo || cursoContenido.titulo,
    descripcion: cursoBase.descripcion || cursoContenido.descripcion,
    imagen_portada: cursoBase.imagen_portada || cursoContenido.imagen_portada,
    precio_mxn: cursoBase.precio_mxn || cursoContenido.precio_mxn,
    nombre_nivel: cursoBase.nombre_nivel || cursoBase.nivel || cursoContenido.nombre_nivel || cursoContenido.nivel,
    nivel: cursoBase.nivel || cursoBase.nombre_nivel || cursoContenido.nivel || cursoContenido.nombre_nivel,
    categorias: Array.isArray(cursoBase.categorias) && cursoBase.categorias.length > 0 ? cursoBase.categorias : cursoContenido.categorias,
    modulos: usarModulosBase ? modulosBase : modulosContenido
  };
};

const obtenerAvanceCurso = (curso) => {
  const totalLecciones = contarLeccionesCurso(curso);
  const leccionesCompletadas = contarLeccionesCompletadasCurso(curso);

  if (totalLecciones > 0 && leccionesCompletadas >= 0) {
    return Math.min(100, Math.round((leccionesCompletadas / totalLecciones) * 100));
  }

  const avanceDirecto = curso.porcentaje_avance ?? curso.avance;
  const numeroDirecto = Number(avanceDirecto);

  if (!Number.isNaN(numeroDirecto) && numeroDirecto >= 0) {
    return Math.min(100, Math.round(numeroDirecto));
  }

  return 0;
};

const limpiarProgresoDetalle = () => {
  const progresoExistente = document.getElementById('detalleProgresoCurso');

  if (progresoExistente) {
    progresoExistente.remove();
  }
};

const pintarProgresoDetalle = (curso) => {
  limpiarProgresoDetalle();

  const idCurso = curso.id_curso || curso.id || curso.idCurso;

  if (!cursoEstaComprado(idCurso)) {
    return;
  }

  const seccionInstructor = document.querySelector('[aria-labelledby="instructorTitle"]');

  if (!seccionInstructor) {
    return;
  }

  const avance = obtenerAvanceCurso(curso);
  const seccion = crearElemento('section', 'course-owned-progress-block', null);
  seccion.id = 'detalleProgresoCurso';
  seccion.setAttribute('aria-label', 'Progreso del curso');

  const fila = crearElemento('div', 'course-owned-progress-label');
  const texto = crearElemento('span', null, 'Avance');
  const porcentaje = crearElemento('strong', null, `${avance}%`);
  const barra = crearElemento('div', 'course-owned-progress-track');
  const relleno = crearElemento('span', 'course-owned-progress-fill');

  relleno.style.width = `${avance}%`;

  fila.appendChild(texto);
  fila.appendChild(porcentaje);
  barra.appendChild(relleno);
  seccion.appendChild(fila);
  seccion.appendChild(barra);

  if (avance === 100) {
    const completo = crearElemento('p', 'course-owned-progress-complete', '¡Curso completo!');
    seccion.appendChild(completo);
  }

  seccionInstructor.insertAdjacentElement('afterend', seccion);
};

const completarLeccionCurso = async (curso, leccion, boton) => {
  const idCurso = obtenerIdCursoValor(curso);
  const idLeccion = leccion && (leccion.id_leccion || leccion.idLeccion || leccion.id);
  const idInscripcion = obtenerIdInscripcionCurso(curso);

  if (!idCurso || !idLeccion) {
    mostrarMensajeDetalle('No se pudo identificar la lección seleccionada.', true);
    return;
  }

  if (boton) {
    boton.disabled = true;
    boton.textContent = 'Guardando...';
  }

  try {
    if (idInscripcion && window.EduTech && typeof window.EduTech.apiRequest === 'function') {
      const respuesta = await window.EduTech.apiRequest(`/inscripciones/${idInscripcion}/lecciones/${idLeccion}/completar`, {
        method: 'POST'
      });

      if (respuesta && respuesta.resumen) {
        curso.total_lecciones = respuesta.resumen.total_lecciones;
        curso.lecciones_completadas = respuesta.resumen.lecciones_completadas;
        curso.porcentaje_avance = respuesta.resumen.porcentaje_avance;
      }
    }

    leccion.completada = true;
    leccion.fecha_completada = new Date().toISOString();
    guardarAvanceLeccionLocal(curso, leccion);
    actualizarCursoCompradoLocal(curso);
    ocultarMensajeDetalle();
    pintarProgresoDetalle(curso);
    pintarContenidoCurso(curso);
  } catch (error) {
    if (boton) {
      boton.disabled = false;
      boton.textContent = 'Marcar como completada';
    }

    mostrarMensajeDetalle(
      error && error.message ? error.message : 'No se pudo guardar el avance. Intenta de nuevo.',
      true
    );
  }
};

const esLeccionExamenFinal = (leccion, modulo = null) => {
  const tituloLeccion = String((leccion && (leccion.titulo || leccion.nombre_leccion || leccion.nombre)) || '').toLowerCase();
  const tituloModulo = String((modulo && (modulo.titulo || modulo.nombre_modulo || modulo.nombre)) || '').toLowerCase();

  return tituloLeccion.includes('examen final') || tituloModulo.includes('examen final');
};

const crearEnlaceLeccion = (curso, modulo, leccion, disponible, completada) => {
  const titulo = leccion.titulo || leccion.nombre_leccion || leccion.nombre || 'Lección';
  const enlace = crearElemento('a', 'lesson-title-text lesson-title-link', titulo);
  const idCurso = obtenerIdCursoValor(curso);
  const esExamen = esLeccionExamenFinal(leccion, modulo);
  const sesionActiva = haySesionActivaDetalle();

  if (sesionActiva) {
    enlace.href = esExamen ? obtenerUrlExamenCurso(curso) : obtenerUrlAulaCurso(curso, leccion);
  } else {
    enlace.removeAttribute('href');
    enlace.setAttribute('aria-disabled', 'true');
    enlace.classList.add('lesson-title-link-disabled');
  }

  if (esExamen) {
    enlace.classList.add('lesson-title-link-exam');
  }

  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();

    if (!sesionActiva) {
      return;
    }

    if (!cursoEstaComprado(idCurso)) {
      mostrarMensajeDetalle('Para abrir esta lección primero debes comprar el curso.', true);
      return;
    }

    if (!disponible && !completada) {
      mostrarMensajeDetalle('Esta lección está bloqueada. Completa primero las lecciones anteriores.', true);
      return;
    }

    if (esExamen) {
      window.location.href = obtenerUrlExamenCurso(curso);
      return;
    }

    window.location.href = obtenerUrlAulaCurso(curso, leccion);
  });

  return enlace;
};

const crearIconoEstadoLeccion = (completada) => {
  const icono = crearElemento(
    'span',
    completada ? 'llms-lesson-complete done lesson-status-icon' : 'llms-lesson-complete lesson-status-icon'
  );
  const check = crearElemento('i', 'fa fa-check-circle');

  check.setAttribute('aria-hidden', 'true');
  icono.appendChild(check);

  return icono;
};

const crearAccionesLeccion = (numero, total) => {
  const acciones = crearElemento('span', 'lesson-actions');
  const contador = crearElemento('span', 'lesson-counter', `${numero} de ${total}`);

  acciones.appendChild(contador);
  return acciones;
};

const pintarContenidoCurso = (curso) => {
  if (!detalleContenido) {
    return;
  }

  detalleContenido.innerHTML = '';

  const modulos = Array.isArray(curso.modulos) ? curso.modulos : [];
  const sesionActiva = haySesionActivaDetalle();
  const cursoComprado = cursoEstaComprado(obtenerIdCursoValor(curso));

  if (modulos.length === 0) {
    const moduloVacio = crearElemento('section', 'module-box');
    const titulo = crearElemento('h3', null, 'Contenido del curso');
    const fila = crearElemento('div', 'lesson-row');
    const texto = crearElemento('span', null, 'Contenido pendiente de publicar');
    const contador = crearElemento('span', null, '0 de 0');

    fila.appendChild(texto);
    fila.appendChild(contador);
    moduloVacio.appendChild(titulo);
    moduloVacio.appendChild(fila);
    detalleContenido.appendChild(moduloVacio);
    return;
  }

  let puedeAvanzar = true;

  modulos.forEach((modulo) => {
    const bloque = crearElemento('section', 'module-box');
    const titulo = crearElemento('h3', null, modulo.titulo || 'Módulo');
    const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];

    bloque.appendChild(titulo);

    if (lecciones.length === 0) {
      const fila = crearElemento('div', 'lesson-row');
      const texto = crearElemento('span', null, 'Lecciones pendientes de publicar');
      const contador = crearElemento('span', null, '0 de 0');

      fila.appendChild(texto);
      fila.appendChild(contador);
      bloque.appendChild(fila);
      detalleContenido.appendChild(bloque);
      return;
    }

    lecciones.forEach((leccion, index) => {
      const completada = leccionEstaCompletada(curso, leccion);
      const disponible = completada || puedeAvanzar;
      const fila = crearElemento('div', 'lesson-row course-lesson-row');
      const contenido = crearElemento('span', 'lesson-content-left');
      const texto = crearElemento('span', 'lesson-title-wrap');
      const icono = crearIconoEstadoLeccion(completada);
      const tituloLeccion = crearEnlaceLeccion(curso, modulo, leccion, disponible, completada);

      texto.appendChild(tituloLeccion);
      contenido.appendChild(icono);
      contenido.appendChild(texto);

      if (completada) {
        fila.classList.add('lesson-row-completed');
      }

      if (!sesionActiva || !cursoComprado) {
        fila.classList.add('lesson-row-login-required');
        fila.classList.add('lesson-row-locked');
        fila.setAttribute('aria-disabled', 'true');
      } else if (!disponible) {
        fila.classList.add('lesson-row-locked');
      }

      if (sesionActiva && cursoComprado) {
        fila.setAttribute('role', 'link');
        fila.setAttribute('tabindex', '0');
        fila.setAttribute('aria-label', `Abrir lección: ${tituloLeccion.textContent}`);

        fila.addEventListener('click', (evento) => {
          if (evento.target.closest('a, button')) {
            return;
          }

          tituloLeccion.click();
        });

        fila.addEventListener('keydown', (evento) => {
          if (evento.key !== 'Enter' && evento.key !== ' ') {
            return;
          }

          evento.preventDefault();
          tituloLeccion.click();
        });
      }

      fila.appendChild(contenido);
      fila.appendChild(crearAccionesLeccion(index + 1, lecciones.length));
      bloque.appendChild(fila);

      if (!completada) {
        puedeAvanzar = false;
      }
    });

    detalleContenido.appendChild(bloque);
  });
};

const prepararVistaCompra = (comprado) => {
  const precioInfo = detallePrecio ? detallePrecio.closest('p') : null;
  const bloqueCompra = document.querySelector('.course-detail-pricing');
  const esInstructor = usuarioEsInstructorDetalle();

  if (precioInfo) {
    precioInfo.style.display = comprado ? 'none' : '';
  }

  if (bloqueCompra) {
    bloqueCompra.style.display = comprado || esInstructor ? 'none' : '';
  }

  document.body.classList.toggle('course-owned-mode', comprado);
  document.body.classList.toggle('course-instructor-no-purchase', esInstructor && !comprado);
};

const prepararBotonCompra = (curso) => {
  if (!detalleBotonCompra) {
    return;
  }

  const idCurso = curso.id_curso || curso.id;
  const comprado = cursoEstaComprado(idCurso);
  const esInstructor = usuarioEsInstructorDetalle();

  prepararVistaCompra(comprado);

  if (esInstructor && !comprado) {
    detalleBotonCompra.removeAttribute('href');
    detalleBotonCompra.setAttribute('aria-disabled', 'true');
    detalleBotonCompra.textContent = '';
    return;
  }

  detalleBotonCompra.classList.toggle('purchase-button-owned', comprado);
  detalleBotonCompra.textContent = comprado ? 'Entrar al curso' : 'Comprar curso';
  detalleBotonCompra.href = comprado ? obtenerUrlAulaCurso(curso) : `comprar-curso.html?id=${idCurso}`;

  detalleBotonCompra.addEventListener('click', (evento) => {
    evento.preventDefault();

    sessionStorage.setItem('edutech_curso_detalle_id', String(idCurso));
    sessionStorage.setItem('edutech_curso_compra_id', String(idCurso));

    if (comprado) {
      window.location.href = obtenerUrlAulaCurso(curso);
      return;
    }

    if (usuarioEsInstructorDetalle()) {
      return;
    }

    window.location.href = `comprar-curso.html?id=${idCurso}`;
  });
};

const pintarCurso = async (curso) => {
  curso = await asegurarContenidoCurso(curso);

  const titulo = curso.titulo || curso.curso || 'Curso EduTech';
  const descripcion = curso.descripcion || 'Consulta la información completa del curso y revisa su contenido.';
  const instructor = obtenerInstructor(curso);
  const nivel = obtenerNivel(curso);
  const precio = formatearPrecio(curso.precio_mxn || curso.precio || curso.total || 0);
  const totalLecciones = Number(curso.total_lecciones || curso.lecciones || curso.numero_lecciones || 0);

  document.title = `${titulo} - EduTech`;

  if (detalleAutor) {
    detalleAutor.textContent = `Por ${instructor} /`;
  }

  if (detalleTitulo) {
    detalleTitulo.textContent = titulo;
  }

  if (detalleNivel) {
    detalleNivel.textContent = nivel;
  }

  pintarCategorias(curso);

  if (detalleLecciones) {
    detalleLecciones.textContent = String(totalLecciones);
  }

  if (detallePrecio) {
    detallePrecio.textContent = precio;
  }

  if (detalleDescripcion) {
    detalleDescripcion.textContent = descripcion;
  }

  if (detalleDescripcionExtra) {
    detalleDescripcionExtra.textContent = 'Este curso está organizado por módulos y lecciones para que puedas revisar el contenido de forma ordenada.';
  }

  if (detalleInstructorAvatar) {
    detalleInstructorAvatar.textContent = instructor.charAt(0).toUpperCase();
  }

  if (detalleInstructor) {
    detalleInstructor.textContent = instructor;
  }

  if (detallePrecioCompra) {
    detallePrecioCompra.textContent = precio;
  }

  pintarConocimientos();
  pintarContenidoCurso(curso);
  pintarProgresoDetalle(curso);
  prepararBotonCompra(curso);

  await cargarImagenDetalle(curso);
};

const obtenerBaseApiDetalle = () => {
  if (window.EduTech && window.EduTech.API_BASE_URL) {
    return window.EduTech.API_BASE_URL;
  }

  const { protocol, hostname, port } = window.location;

  if (hostname.includes('app.github.dev') && hostname.includes('-3001.')) {
    return `${protocol}//${hostname.replace('-3001.', '-3000.')}/api`;
  }

  if (hostname.includes('github.dev') && hostname.includes('-3001.')) {
    return `${protocol}//${hostname.replace('-3001.', '-3000.')}/api`;
  }

  if (port === '3001') {
    return `${protocol}//${hostname}:3000/api`;
  }

  return 'http://localhost:3000/api';
};

const cargarCursoCatalogoBackend = async (idCurso) => {
  if (!idCurso) {
    return null;
  }

  if (window.EduTech && typeof window.EduTech.apiRequest === 'function') {
    const respuesta = await window.EduTech.apiRequest(`/cursos/${idCurso}`);
    return respuesta.curso || null;
  }

  const respuesta = await fetch(`${obtenerBaseApiDetalle()}/cursos/${idCurso}`);

  if (!respuesta.ok) {
    return null;
  }

  const datos = await respuesta.json();
  return datos.curso || null;
};

const guardarCursoCatalogoLocal = (curso) => {
  const idCurso = obtenerIdCursoValor(curso);

  if (!idCurso) {
    return;
  }

  const catalogo = obtenerCatalogoCursos();
  const indice = catalogo.findIndex((item) => String(obtenerIdCursoValor(item)) === String(idCurso));

  if (indice >= 0) {
    catalogo[indice] = {
      ...catalogo[indice],
      ...curso,
      modulos: Array.isArray(curso.modulos) && curso.modulos.length > 0 ? curso.modulos : catalogo[indice].modulos
    };
  } else {
    catalogo.push(curso);
  }

  guardarJsonLocal('edutech_catalogo_cursos', catalogo);
};

const asegurarContenidoCurso = async (curso) => {
  const idCurso = obtenerIdCursoValor(curso);

  if (!idCurso || cursoTieneModulosPublicados(curso)) {
    return curso;
  }

  try {
    const cursoBackend = await cargarCursoCatalogoBackend(idCurso);

    if (!cursoBackend) {
      return curso;
    }

    guardarCursoCatalogoLocal(cursoBackend);
    return combinarCursoConContenido(curso, cursoBackend, idCurso);
  } catch (error) {
    console.warn('No se pudo completar el contenido del curso desde /api/cursos/:id.', error);
    return curso;
  }
};

const cargarDetalleCurso = async () => {
  let contenidoMostrado = false;

  try {
    ocultarContenidoDetalle();
    ocultarMensajeDetalle();

    const idCurso = obtenerIdCurso();

    if (!idCurso) {
      mostrarMensajeDetalle('No se seleccionó ningún curso. Vuelve al catálogo y elige un curso.', true);
      return;
    }

    const comprado = cursoEstaComprado(idCurso);
    const cursoLocal = obtenerCursoCompradoLocal(idCurso);
    let cursoBase = cursoLocal ? {
      ...cursoLocal,
      id_curso: cursoLocal.id_curso || cursoLocal.id || idCurso
    } : null;

    if (comprado && cursoBase) {
      await pintarCurso(cursoBase);
      ocultarMensajeDetalle();
      mostrarContenidoDetalle();
      contenidoMostrado = true;
      marcarPaginaDatosLista();
    }

    if (comprado) {
      try {
        const cursoInscrito = await obtenerDetalleInscritoBackend(idCurso);

        if (cursoInscrito) {
          cursoBase = combinarCursoConContenido(cursoInscrito, cursoBase, idCurso);

          if (cursoTieneModulosPublicados(cursoBase)) {
            await pintarCurso(cursoBase);
            ocultarMensajeDetalle();
            mostrarContenidoDetalle();
            contenidoMostrado = true;
            return;
          }
        }
      } catch (error) {
        console.warn('No se pudo cargar el detalle inscrito. Se usará el contenido del catálogo del curso.', error);
      }
    }

    let cursoBackend = null;

    try {
      cursoBackend = await cargarCursoCatalogoBackend(idCurso);
    } catch (error) {
      console.warn('No se pudo cargar el catálogo del curso.', error);
    }

    if (!cursoBackend && !cursoBase) {
      if (!contenidoMostrado) {
        mostrarMensajeDetalle('No se encontró la información del curso.', true);
      }
      return;
    }

    const cursoFinal = comprado
      ? combinarCursoConContenido(cursoBase, cursoBackend, idCurso)
      : cursoBackend;

    await pintarCurso(cursoFinal);
    ocultarMensajeDetalle();
    mostrarContenidoDetalle();
    contenidoMostrado = true;
  } catch (error) {
    const idCurso = obtenerIdCurso();
    const cursoLocal = obtenerCursoCompradoLocal(idCurso);

    if (cursoLocal && !contenidoMostrado) {
      await pintarCurso({
        ...cursoLocal,
        id_curso: cursoLocal.id_curso || cursoLocal.id || idCurso
      });
      ocultarMensajeDetalle();
      mostrarContenidoDetalle();
      return;
    }

    if (!contenidoMostrado) {
      ocultarContenidoDetalle();
      mostrarMensajeDetalle('No se pudo cargar el detalle del curso. Revisa que el backend esté encendido y que el curso exista.', true);
    }
  } finally {
    marcarPaginaDatosLista();
  }
};

document.addEventListener('DOMContentLoaded', cargarDetalleCurso);
