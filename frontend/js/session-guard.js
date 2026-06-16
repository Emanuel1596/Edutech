(() => {
  const paginasAutenticacion = new Set([
    'login.html',
    'registro.html',
    'recuperar-password.html'
  ]);

  const paginasProtegidas = new Set([
    'admin.html',
    'instructor.html',
    'mi-cuenta.html',
    'mis-cursos.html',
    'aula.html',
    'examen.html',
    'certificado.html'
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
    style.textContent = `
      html.edutech-session-checking body {
        visibility: hidden !important;
      }
    `;
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
  };

  const mostrar = () => {
    limpiarCargaVisual();
    document.documentElement.classList.remove('edutech-session-checking');

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

  const usuarioPuedeAbrir = (usuario, pagina) => {
    const rol = obtenerRol(usuario);

    if (pagina === 'admin.html') {
      return rol === 'admin';
    }

    if (pagina === 'instructor.html') {
      return rol === 'instructor';
    }

    if ([
      'mi-cuenta.html',
      'mis-cursos.html',
      'aula.html',
      'examen.html',
      'certificado.html'
    ].includes(pagina)) {
      return rol === 'alumno';
    }

    return true;
  };

  const mismaRuta = (destino) => {
    const [archivoDestino, hashDestino = ''] = destino.split('#');
    const pagina = paginaActual();
    const hashActual = window.location.hash.replace(/^#/, '');

    if (pagina !== archivoDestino) {
      return false;
    }

    if (!hashDestino) {
      return true;
    }

    return hashActual === hashDestino;
  };

  const reemplazar = (destino) => {
    ocultar();

    if (mismaRuta(destino)) {
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
      return reemplazar('login.html');
    }

    if (!usuarioPuedeAbrir(usuario, pagina)) {
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

  window.addEventListener('pagehide', () => {
    ocultar();
  });

  window.addEventListener('pageshow', () => {
    validar();
  });

  window.addEventListener('popstate', () => {
    window.setTimeout(validar, 0);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validar);
  } else {
    validar();
  }
})();
