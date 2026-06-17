(() => {
  const paginasAutenticacion = new Set([
    'login.html',
    'registro.html',
    'recuperar-password.html'
  ]);

  const paginasProtegidas = new Set([
    'admin.html',
    'instructor.html',
    'instructor-examen.html',
    'mi-cuenta.html',
    'mis-cursos.html',
    'aula.html',
    'examen.html',
    'certificado.html',
    'pago-paypal.html',
    'carrito.html',
    'comprar-curso.html',
    'compra-aprobada.html',
    'solicitud-instructor.html'
  ]);

  const paginaActual = () => {
    const archivo = window.location.pathname.split('/').pop();
    return archivo || 'index.html';
  };

  const esPaginaControlada = () => {
    const pagina = paginaActual();
    return paginasAutenticacion.has(pagina) || paginasProtegidas.has(pagina);
  };

  const instalarEstilo = () => {
    if (document.getElementById('edutech-session-guard-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'edutech-session-guard-style';
    style.textContent = 'html.edutech-session-checking body{display:none!important;}';
    document.head.appendChild(style);
  };

  const ocultar = () => {
    if (!esPaginaControlada()) {
      return;
    }

    instalarEstilo();
    document.documentElement.classList.add('edutech-session-checking');
  };

  const limpiarCargaVisual = () => {
    if (!document.body) {
      return;
    }

    document.body.classList.remove('edutech-data-pending', 'edutech-data-loading');
    document.body.classList.add('edutech-data-ready');
  };

  const mostrar = () => {
    limpiarCargaVisual();
    document.documentElement.classList.remove(
      'edutech-session-checking',
      'edutech-preauth-checking',
      'edutech-guard-pending',
      'edutech-protected-loading'
    );

    if (typeof window.EduTechMarcarPaginaLista === 'function') {
      window.EduTechMarcarPaginaLista();
    }
  };

  const obtenerUsuario = () => {
    try {
      return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
    } catch (error) {
      return null;
    }
  };

  const haySesion = () => {
    return localStorage.getItem('edutech_sesion_activa') === 'true' && Boolean(obtenerUsuario());
  };

  const obtenerRol = (usuario) => {
    const idRol = Number(usuario?.id_rol || usuario?.idRol || 0);
    const textoRol = String(usuario?.nombre_rol || usuario?.rol || '').trim().toLowerCase();

    if (idRol === 3 || textoRol === 'administrador' || textoRol === 'admin') {
      return 'admin';
    }

    if (idRol === 2 || textoRol === 'instructor') {
      return 'instructor';
    }

    if (idRol === 1 || textoRol === 'alumno' || textoRol === 'estudiante') {
      return 'alumno';
    }

    return '';
  };

  const destinoPorRol = (usuario) => {
    const rol = obtenerRol(usuario);

    if (rol === 'admin') {
      return 'admin.html';
    }

    if (rol === 'instructor') {
      return 'instructor.html#dashboard';
    }

    return 'mi-cuenta.html#dashboard';
  };

  const soloAlumno = new Set([
    'mi-cuenta.html',
    'mis-cursos.html',
    'aula.html',
    'examen.html',
    'certificado.html',
    'pago-paypal.html',
    'carrito.html',
    'comprar-curso.html',
    'compra-aprobada.html',
    'solicitud-instructor.html'
  ]);

  const usuarioPuedeAbrir = (usuario, pagina) => {
    const rol = obtenerRol(usuario);

    if (pagina === 'admin.html') {
      return rol === 'admin';
    }

    if (pagina === 'instructor.html' || pagina === 'instructor-examen.html') {
      return rol === 'instructor';
    }

    if (soloAlumno.has(pagina)) {
      return rol === 'alumno';
    }

    return true;
  };

  const obtenerMensajePermiso = (pagina) => {
    if (pagina === 'admin.html') {
      return 'Esto solo está disponible para administradores.';
    }

    if (pagina === 'instructor.html' || pagina === 'instructor-examen.html') {
      return 'Esto solo está disponible para instructores.';
    }

    if (soloAlumno.has(pagina)) {
      return 'Esto solo está disponible para alumnos.';
    }

    return 'No tienes permiso para acceder a esta pantalla.';
  };

  const reemplazar = (destino) => {
    if (!destino) {
      mostrar();
      return true;
    }

    const actual = `${paginaActual()}${window.location.search || ''}${window.location.hash || ''}`;

    if (actual === destino) {
      mostrar();
      return true;
    }

    window.location.replace(destino);
    return true;
  };

  const validar = () => {
    const pagina = paginaActual();
    const usuario = obtenerUsuario();
    const sesion = haySesion();

    if (paginasAutenticacion.has(pagina)) {
      if (sesion && usuario) {
        return reemplazar(destinoPorRol(usuario));
      }

      mostrar();
      return false;
    }

    if (!paginasProtegidas.has(pagina)) {
      mostrar();
      return false;
    }

    if (!sesion || !usuario) {
      if (pagina === 'solicitud-instructor.html') {
        sessionStorage.setItem('edutech_redirect_post_login', 'solicitud-instructor.html');
        sessionStorage.setItem('edutech_mensaje_acceso', 'Inicia sesión para enviar la solicitud de instructor.');
      } else {
        sessionStorage.setItem('edutech_redirect_post_login', `${pagina}${window.location.search || ''}${window.location.hash || ''}`);
        sessionStorage.setItem('edutech_mensaje_acceso', 'Inicia sesión para continuar.');
      }

      return reemplazar('login.html');
    }

    if (!usuarioPuedeAbrir(usuario, pagina)) {
      sessionStorage.removeItem('edutech_mensaje_acceso');
      sessionStorage.removeItem('edutech_mensaje_acceso_destino');
      window.alert(obtenerMensajePermiso(pagina));
      return reemplazar(destinoPorRol(usuario));
    }

    mostrar();
    return false;
  };

  ocultar();

  window.EduTechSessionGuard = {
    validar,
    ocultar,
    mostrar,
    destinoPorRol,
    usuarioPuedeAbrir
  };

  window.addEventListener('pageshow', validar);
  window.addEventListener('storage', validar);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validar);
  } else {
    validar();
  }
})();
