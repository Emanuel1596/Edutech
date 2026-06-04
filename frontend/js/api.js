const obtenerBaseUrlApi = () => {
  const hostname = window.location.hostname;

  if (hostname.includes('app.github.dev')) {
    const backendHost = hostname.replace('-3001.', '-3000.');
    return `https://${backendHost}/api`;
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

  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, configuracion);

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
  localStorage.setItem('edutech_usuario', JSON.stringify(usuario));
  localStorage.setItem('edutech_id_usuario', usuario.id_usuario);
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

const cerrarSesion = () => {
  localStorage.removeItem('edutech_usuario');
  localStorage.removeItem('edutech_id_usuario');
};

const requiereSesion = () => {
  const usuario = obtenerUsuarioSesion();

  if (!usuario) {
    window.location.href = 'login.html';
    return null;
  }

  return usuario;
};

console.log('API conectada en:', API_BASE_URL);

window.EduTech = {
  API_BASE_URL,
  apiRequest,
  guardarUsuarioSesion,
  obtenerUsuarioSesion,
  obtenerIdUsuarioSesion,
  cerrarSesion,
  requiereSesion
};