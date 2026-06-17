const obtenerBaseUrlApi = () => {
  const { protocol, hostname, port } = window.location;

  if (hostname.includes('app.github.dev') && hostname.includes('-3001.')) {
    return `${protocol}//${hostname.replace('-3001.', '-3000.')}/api`;
  }

  if (hostname.includes('app.github.dev') && hostname.includes('-5500.')) {
    return `${protocol}//${hostname.replace('-5500.', '-3000.')}/api`;
  }

  if (hostname.includes('github.dev') && hostname.includes('-3001.')) {
    return `${protocol}//${hostname.replace('-3001.', '-3000.')}/api`;
  }

  if (port === '3001') {
    return `${protocol}//${hostname}:3000/api`;
  }

  if (port === '5500') {
    return `${protocol}//${hostname}:3000/api`;
  }

  return 'http://localhost:3000/api';
};

const API_BASE_URL = obtenerBaseUrlApi();

const apiRequest = async (ruta, opciones = {}) => {
  const idUsuarioSesion = localStorage.getItem('edutech_id_usuario') || '';
  const rolUsuarioSesion = localStorage.getItem('edutech_nombre_rol') || '';
  const configuracion = {
    method: opciones.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(idUsuarioSesion ? { 'X-Edutech-User-Id': idUsuarioSesion } : {}),
      ...(rolUsuarioSesion ? { 'X-Edutech-Role': rolUsuarioSesion } : {}),
      ...(opciones.headers || {})
    }
  };

  if (opciones.body) {
    configuracion.body = JSON.stringify(opciones.body);
  }

  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, configuracion);
  } catch (error) {
    throw {
      ok: false,
      message: 'No se pudo conectar con la API. Revisa que el backend esté prendido y que el puerto 3000 esté público.',
      detalle: error.message
    };
  }

  let datos = null;

  try {
    datos = await respuesta.json();
  } catch (error) {
    datos = {
      ok: false,
      message: 'La respuesta del servidor no tiene formato JSON.'
    };
  }

  if (!respuesta.ok) {
    throw datos;
  }

  return datos;
};

const mapaRolesPorId = {
  1: 'Alumno',
  2: 'Instructor',
  3: 'Administrador'
};

const normalizarTextoRol = (valor) => String(valor || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const obtenerNombreRolUsuario = (usuario) => {
  if (!usuario) {
    return '';
  }

  const rolDirecto = usuario.nombre_rol || usuario.rol || usuario.tipo_usuario || '';

  if (rolDirecto) {
    return String(rolDirecto).trim();
  }

  const idRol = Number(usuario.id_rol || usuario.idRol);

  return mapaRolesPorId[idRol] || '';
};

const normalizarUsuarioSesion = (usuario) => {
  if (!usuario) {
    return null;
  }

  const idRol = Number(usuario.id_rol || usuario.idRol || 0);
  const nombreRol = obtenerNombreRolUsuario(usuario);

  return {
    ...usuario,
    id_usuario: usuario.id_usuario || usuario.id || usuario.idUsuario || '',
    id_rol: idRol || usuario.id_rol || usuario.idRol || '',
    nombre_rol: nombreRol || mapaRolesPorId[idRol] || ''
  };
};

const guardarUsuarioSesion = (usuario) => {
  const usuarioNormalizado = normalizarUsuarioSesion(usuario);

  if (!usuarioNormalizado) {
    return;
  }

  localStorage.setItem('edutech_usuario', JSON.stringify(usuarioNormalizado));
  localStorage.setItem('edutech_id_usuario', String(usuarioNormalizado.id_usuario || ''));
  localStorage.setItem('edutech_id_rol', String(usuarioNormalizado.id_rol || ''));
  localStorage.setItem('edutech_nombre_rol', String(usuarioNormalizado.nombre_rol || ''));
  localStorage.setItem('edutech_sesion_activa', 'true');
  asegurarEpochSesion();
  sessionStorage.removeItem('edutech_mensaje_acceso');
  sessionStorage.removeItem('edutech_mensaje_acceso_destino');
};

const obtenerUsuarioSesion = () => {
  const usuarioGuardado = localStorage.getItem('edutech_usuario');

  if (!usuarioGuardado) {
    return null;
  }

  try {
    const usuario = normalizarUsuarioSesion(JSON.parse(usuarioGuardado));

    if (usuario) {
      localStorage.setItem('edutech_usuario', JSON.stringify(usuario));
      localStorage.setItem('edutech_id_usuario', String(usuario.id_usuario || ''));
      localStorage.setItem('edutech_id_rol', String(usuario.id_rol || ''));
      localStorage.setItem('edutech_nombre_rol', String(usuario.nombre_rol || ''));
    }

    return usuario;
  } catch (error) {
    return null;
  }
};

const obtenerIdUsuarioSesion = () => {
  const usuario = obtenerUsuarioSesion();

  return usuario && usuario.id_usuario
    ? String(usuario.id_usuario)
    : localStorage.getItem('edutech_id_usuario');
};

const haySesionActiva = () => {
  return localStorage.getItem('edutech_sesion_activa') === 'true' && Boolean(obtenerUsuarioSesion());
};

const generarEpochSesion = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const limpiarEstadoTemporalNavegacion = () => {
  [sessionStorage].forEach((storage) => {
    Object.keys(storage)
      .filter((clave) => clave.startsWith('edutech_'))
      .forEach((clave) => storage.removeItem(clave));
  });
};

const iniciarNuevaSesionNavegacion = (rutaDestino = '') => {
  limpiarEstadoTemporalNavegacion();

  const epoch = generarEpochSesion();
  sessionStorage.setItem('edutech_session_epoch', epoch);

  if (rutaDestino) {
    sessionStorage.setItem('edutech_ultima_ruta_segura', rutaDestino);
  }

  try {
    const estadoActual = history.state && typeof history.state === 'object' ? history.state : {};
    history.replaceState({
      ...estadoActual,
      edutechAuthEpoch: epoch,
      edutechLoginBoundary: true
    }, document.title, window.location.href);
  } catch (error) {
    // Si el navegador no permite modificar el estado, el guard seguirá validando por rol.
  }

  return epoch;
};

const asegurarEpochSesion = () => {
  let epoch = sessionStorage.getItem('edutech_session_epoch');

  if (!epoch) {
    epoch = generarEpochSesion();
    sessionStorage.setItem('edutech_session_epoch', epoch);
  }

  return epoch;
};

const esClavePersistenteAlumno = (clave) => {
  return /^edutech_perfil_alumno_\d+$/.test(clave) || /^edutech_carrito_\d+$/.test(clave);
};

const limpiarClavesEdutech = (storage) => {
  if (!storage) {
    return;
  }

  Object.keys(storage)
    .filter((clave) => clave.startsWith('edutech_') && !esClavePersistenteAlumno(clave))
    .forEach((clave) => storage.removeItem(clave));
};

const cerrarSesion = () => {
  localStorage.removeItem('edutech_carrito');
  sessionStorage.removeItem('edutech_carrito');
  limpiarClavesEdutech(localStorage);
  limpiarClavesEdutech(sessionStorage);

  if (typeof window.EduTechActualizarMenuSesion === 'function') {
    window.EduTechActualizarMenuSesion();
  }
};

const usuarioTieneRol = (usuario, rolesPermitidos) => {
  const rolUsuario = normalizarTextoRol(obtenerNombreRolUsuario(usuario));
  const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

  return roles.some((rol) => normalizarTextoRol(rol) === rolUsuario);
};

const obtenerRutaInicioPorRol = (usuario = obtenerUsuarioSesion()) => {
  if (!usuario) {
    return 'login.html';
  }

  if (usuarioTieneRol(usuario, 'Administrador')) {
    return 'admin.html';
  }

  if (usuarioTieneRol(usuario, 'Instructor')) {
    return 'instructor.html#dashboard';
  }

  return 'mi-cuenta.html#dashboard';
};

const normalizarRuta = (ruta) => {
  const texto = String(ruta || '').trim();

  if (!texto) {
    return '';
  }

  try {
    const url = new URL(texto, window.location.href);
    return url.pathname.split('/').pop() || 'index.html';
  } catch (error) {
    return texto.split('?')[0].split('#')[0].split('/').pop() || texto;
  }
};

const usuarioPuedeAbrirRuta = (usuario, ruta) => {
  const archivo = normalizarRuta(ruta);

  if (!archivo) {
    return true;
  }

  if (archivo === 'instructor.html' || archivo === 'instructor-examen.html') {
    return usuarioTieneRol(usuario, 'Instructor');
  }

  if (archivo === 'admin.html') {
    return usuarioTieneRol(usuario, 'Administrador');
  }

  if (['mi-cuenta.html', 'mis-cursos.html', 'aula.html', 'examen.html', 'certificado.html'].includes(archivo)) {
    return usuarioTieneRol(usuario, 'Alumno');
  }

  return true;
};

const redirigirSegunRol = (usuario = obtenerUsuarioSesion()) => {
  window.location.replace(obtenerRutaInicioPorRol(usuario));
};

const requiereSesion = () => {
  const usuario = obtenerUsuarioSesion();

  if (!usuario) {
    window.location.replace('login.html');
    return null;
  }

  return usuario;
};

const requiereRol = (rolesPermitidos, rutaFallback = '') => {
  const usuario = requiereSesion();

  if (!usuario) {
    return null;
  }

  if (!usuarioTieneRol(usuario, rolesPermitidos)) {
    window.location.replace(rutaFallback || obtenerRutaInicioPorRol(usuario));
    return null;
  }

  return usuario;
};

const guardarRedirectDespuesLogin = (ruta) => {
  sessionStorage.setItem('edutech_redirect_post_login', ruta);
};

console.log('API conectada en:', API_BASE_URL);

window.EduTech = {
  API_BASE_URL,
  apiRequest,
  guardarUsuarioSesion,
  obtenerUsuarioSesion,
  obtenerIdUsuarioSesion,
  haySesionActiva,
  iniciarNuevaSesionNavegacion,
  limpiarEstadoTemporalNavegacion,
  asegurarEpochSesion,
  cerrarSesion,
  requiereSesion,
  requiereRol,
  guardarRedirectDespuesLogin,
  obtenerNombreRolUsuario,
  usuarioTieneRol,
  obtenerRutaInicioPorRol,
  usuarioPuedeAbrirRuta,
  redirigirSegunRol
};
