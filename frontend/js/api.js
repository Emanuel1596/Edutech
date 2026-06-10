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
  const configuracion = {
    method: opciones.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
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

const guardarUsuarioSesion = (usuario) => {
  if (!usuario) {
    return;
  }

  localStorage.setItem('edutech_usuario', JSON.stringify(usuario));
  localStorage.setItem('edutech_id_usuario', String(usuario.id_usuario || usuario.id || ''));
  localStorage.setItem('edutech_sesion_activa', 'true');
};

const obtenerUsuarioSesion = () => {
  const usuarioGuardado = localStorage.getItem('edutech_usuario');

  if (!usuarioGuardado) {
    return null;
  }

  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    return null;
  }
};

const obtenerIdUsuarioSesion = () => {
  return localStorage.getItem('edutech_id_usuario');
};

const haySesionActiva = () => {
  return localStorage.getItem('edutech_sesion_activa') === 'true' && Boolean(obtenerUsuarioSesion());
};

const cerrarSesion = () => {
  const claves = [
    'edutech_usuario',
    'edutech_id_usuario',
    'edutech_sesion_activa',
    'edutech_perfil_alumno',
    'edutech_mis_cursos',
    'edutech_avances_cursos',
    'edutech_curso_compra_id',
    'edutech_curso_detalle_id',
    'edutech_compra_pendiente',
    'edutech_compra_aprobada_backend',
    'edutech_redirect_post_login',
    'edutech_redirect_after_login'
  ];

  claves.forEach((clave) => {
    localStorage.removeItem(clave);
    sessionStorage.removeItem(clave);
  });
};

const requiereSesion = () => {
  const usuario = obtenerUsuarioSesion();

  if (!usuario) {
    window.location.href = 'login.html';
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
  cerrarSesion,
  requiereSesion,
  guardarRedirectDespuesLogin
};