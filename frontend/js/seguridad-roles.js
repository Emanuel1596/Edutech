(() => {
  const normalizarRol = (valor) => String(valor || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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

  const obtenerRolUsuario = (usuario) => {
    const mapaRoles = {
      1: 'Alumno',
      2: 'Instructor',
      3: 'Administrador'
    };

    const rolDirecto = usuario && (usuario.nombre_rol || usuario.rol || usuario.tipo_usuario);

    if (rolDirecto) {
      return String(rolDirecto);
    }

    const idRol = Number(
      (usuario && (usuario.id_rol || usuario.idRol))
      || localStorage.getItem('edutech_id_rol')
    );

    return mapaRoles[idRol] || localStorage.getItem('edutech_nombre_rol') || '';
  };

  const obtenerDestinoPorRol = (rolNormalizado) => {
    if (!rolNormalizado) {
      return 'login.html';
    }

    if (rolNormalizado === 'alumno') {
      return 'mi-cuenta.html';
    }

    if (rolNormalizado === 'administrador') {
      return 'admin.html';
    }

    return 'index.html';
  };

  const usuario = obtenerUsuarioSesion();
  const rolNormalizado = normalizarRol(obtenerRolUsuario(usuario));
  const sesionActiva = localStorage.getItem('edutech_sesion_activa') === 'true';

  if (!usuario || !sesionActiva) {
    sessionStorage.setItem('edutech_mensaje_acceso', 'Inicia sesión para continuar.');
    window.location.replace('login.html');
    return;
  }

  if (rolNormalizado !== 'instructor') {
    sessionStorage.setItem('edutech_mensaje_acceso', 'No tienes permisos para abrir esa pantalla.');
    window.location.replace(obtenerDestinoPorRol(rolNormalizado));
    return;
  }

  document.documentElement.classList.remove('edutech-guard-pending');
  document.documentElement.classList.add('edutech-guard-allowed');
})();
