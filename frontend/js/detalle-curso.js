const detalleContenidoVisual = document.getElementById('detalleContenidoVisual');
const detalleMensaje = document.getElementById('detalleMensaje');
const detalleAutor = document.getElementById('detalleAutor');
const detalleTitulo = document.getElementById('detalleTitulo');
const detalleNivel = document.getElementById('detalleNivel');
const detalleCategoriaPrincipal = document.getElementById('detalleCategoriaPrincipal');
const detalleLecciones = document.getElementById('detalleLecciones');
const detallePrecio = document.getElementById('detallePrecio');
const detalleImagen = document.getElementById('detalleImagen');
const detalleImagenContenedor = document.getElementById('detalleImagenContenedor');
const detalleDescripcion = document.getElementById('detalleDescripcion');
const detalleDescripcionExtra = document.getElementById('detalleDescripcionExtra');
const detalleInstructorAvatar = document.getElementById('detalleInstructorAvatar');
const detalleInstructor = document.getElementById('detalleInstructor');
const detallePrecioCompra = document.getElementById('detallePrecioCompra');
const detalleBotonCompra = document.getElementById('detalleBotonCompra');
const detalleContenido = document.getElementById('detalleContenido');

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

const obtenerParametroId = () => {
  const parametros = new URLSearchParams(window.location.search);
  const idPorQuery = parametros.get('id');

  if (idPorQuery) {
    sessionStorage.setItem('edutech_curso_detalle_id', idPorQuery);
    sessionStorage.setItem('edutech_curso_compra_id', idPorQuery);
    return idPorQuery;
  }

  const idGuardado = sessionStorage.getItem('edutech_curso_detalle_id');

  if (idGuardado) {
    sessionStorage.setItem('edutech_curso_compra_id', idGuardado);
    return idGuardado;
  }

  const idCompra = sessionStorage.getItem('edutech_curso_compra_id');

  if (idCompra) {
    sessionStorage.setItem('edutech_curso_detalle_id', idCompra);
    return idCompra;
  }

  const coincidencia = window.location.href.match(/[?&]id=(\d+)/);

  if (coincidencia && coincidencia[1]) {
    sessionStorage.setItem('edutech_curso_detalle_id', coincidencia[1]);
    sessionStorage.setItem('edutech_curso_compra_id', coincidencia[1]);
    return coincidencia[1];
  }

  return null;
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

const obtenerImagenCurso = (curso) => {
  if (curso.imagen_portada && curso.imagen_portada.trim() !== '') {
    return curso.imagen_portada;
  }

  return null;
};

const obtenerInstructor = (curso) => {
  const nombre = curso.nombre_instructor || '';
  const apellido = curso.apellido_paterno_instructor || '';
  const instructor = `${nombre} ${apellido}`.trim();

  return instructor || 'Instructor EduTech';
};

const obtenerInicialesInstructor = (nombreCompleto) => {
  const partes = nombreCompleto.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0].substring(0, 2).toUpperCase();
  }

  return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
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

const limpiarContenidoEstatico = () => {
  if (detalleContenido) {
    detalleContenido.innerHTML = '';
  }
};

const renderizarModuloBasico = (curso) => {
  if (!detalleContenido) {
    return;
  }

  limpiarContenidoEstatico();

  const modulo = crearElemento('section', 'module-box');
  const tituloModulo = crearElemento('h3', null, 'Contenido del curso');
  const leccion = crearElemento('div', 'lesson-row');
  const nombreLeccion = crearElemento('span', null, 'Información general del curso');
  const numeroLeccion = crearElemento('span', null, '1 de 1');

  leccion.appendChild(nombreLeccion);
  leccion.appendChild(numeroLeccion);
  modulo.appendChild(tituloModulo);
  modulo.appendChild(leccion);
  detalleContenido.appendChild(modulo);

  if (curso.total_lecciones && Number(curso.total_lecciones) > 1) {
    numeroLeccion.textContent = `${curso.total_lecciones} lecciones`;
  }
};

const pintarImagenCurso = (curso, titulo) => {
  return new Promise((resolve) => {
    const imagen = obtenerImagenCurso(curso);

    if (!detalleImagen || !detalleImagenContenedor) {
      resolve();
      return;
    }

    detalleImagen.onload = null;
    detalleImagen.onerror = null;
    detalleImagenContenedor.classList.remove('course-detail-image-empty');
    detalleImagen.style.display = 'block';
    detalleImagen.style.visibility = 'hidden';

    if (!imagen) {
      detalleImagen.removeAttribute('src');
      detalleImagen.alt = '';
      detalleImagen.style.display = 'none';
      detalleImagen.style.visibility = 'visible';
      detalleImagenContenedor.classList.add('course-detail-image-empty');
      resolve();
      return;
    }

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
      detalleImagen.style.visibility = 'visible';
      detalleImagenContenedor.classList.add('course-detail-image-empty');
      resolve();
    };

    detalleImagen.alt = `Imagen del curso ${titulo}`;
    detalleImagen.src = imagen;

    if (detalleImagen.complete && detalleImagen.naturalWidth > 0) {
      detalleImagen.onload();
    }
  });
};

const configurarBotonCompra = (curso) => {
  if (!detalleBotonCompra || !curso || !curso.id_curso) {
    return;
  }

  const idCurso = String(curso.id_curso);

  detalleBotonCompra.href = `comprar-curso.html?id=${idCurso}`;

  detalleBotonCompra.onclick = (evento) => {
    evento.preventDefault();
    sessionStorage.setItem('edutech_curso_detalle_id', idCurso);
    sessionStorage.setItem('edutech_curso_compra_id', idCurso);
    window.location.href = `comprar-curso.html?id=${idCurso}`;
  };
};

const pintarCurso = async (curso) => {
  const instructor = obtenerInstructor(curso);
  const precio = formatearPrecio(curso.precio_mxn);
  const nivel = curso.nombre_nivel || 'Curso disponible';
  const titulo = curso.titulo || 'Curso EduTech';
  const descripcion = curso.descripcion || 'Consulta la información completa del curso antes de comprarlo.';

  document.title = `${titulo} - EduTech`;

  if (detalleTitulo) {
    detalleTitulo.textContent = titulo;
  }

  if (detalleAutor) {
    detalleAutor.textContent = `Por ${instructor} /`;
  }

  if (detalleNivel) {
    detalleNivel.textContent = nivel;
  }

  if (detalleCategoriaPrincipal) {
    detalleCategoriaPrincipal.textContent = curso.nombre_categoria || 'Cursos';
  }

  if (detalleLecciones) {
    detalleLecciones.textContent = curso.total_lecciones || 'Por definir';
  }

  if (detallePrecio) {
    detallePrecio.textContent = precio;
  }

  if (detallePrecioCompra) {
    detallePrecioCompra.textContent = precio;
  }

  if (detalleDescripcion) {
    detalleDescripcion.textContent = descripcion;
  }

  if (detalleDescripcionExtra) {
    detalleDescripcionExtra.textContent = 'El curso incluye contenido organizado para que el alumno pueda revisar la información antes de comprar y acceder al material completo después de inscribirse.';
  }

  if (detalleInstructor) {
    detalleInstructor.textContent = instructor;
  }

  if (detalleInstructorAvatar) {
    detalleInstructorAvatar.textContent = obtenerInicialesInstructor(instructor);
  }

  configurarBotonCompra(curso);
  renderizarModuloBasico(curso);
  await pintarImagenCurso(curso, titulo);
};

const cargarDetalleCurso = async () => {
  ocultarContenidoDetalle();

  const idCurso = obtenerParametroId();

  if (!idCurso) {
    mostrarMensajeDetalle('No se indicó qué curso se debe mostrar.', true);
    return;
  }

  if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    mostrarMensajeDetalle('No se pudo conectar con la API. Revisa que js/api.js esté cargado antes de js/detalle-curso.js.', true);
    return;
  }

  try {
    ocultarMensajeDetalle();

    const respuesta = await window.EduTech.apiRequest(`/cursos/${idCurso}`);
    const curso = respuesta.curso || respuesta.data || respuesta;

    if (!curso || !curso.id_curso) {
      mostrarMensajeDetalle('No se encontró el curso solicitado.', true);
      return;
    }

    await pintarCurso(curso);
    ocultarMensajeDetalle();
    mostrarContenidoDetalle();
  } catch (error) {
    mostrarMensajeDetalle('No se encontró el curso solicitado o el backend no respondió.', true);
  }
};

document.addEventListener('DOMContentLoaded', cargarDetalleCurso);
