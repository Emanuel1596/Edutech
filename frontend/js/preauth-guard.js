(() => {
  const pagina = (window.location.pathname.split('/').pop() || 'index.html').trim();
  const paginas = new Set([
    'admin.html',
    'instructor.html',
    'instructor-examen.html',
    'aula.html',
    'examen.html',
    'certificado.html',
    'mi-cuenta.html',
    'mis-cursos.html',
    'carrito.html',
    'comprar-curso.html',
    'compra-aprobada.html',
    'solicitud-instructor.html'
  ]);

  if (!paginas.has(pagina)) {
    return;
  }

  const instalarOcultamiento = () => {
    document.documentElement.classList.add('edutech-session-checking', 'edutech-preauth-checking');

    if (!document.getElementById('edutech-preauth-guard-style')) {
      const style = document.createElement('style');
      style.id = 'edutech-preauth-guard-style';
      style.textContent = 'html.edutech-preauth-checking body,html.edutech-session-checking body{display:none!important;visibility:hidden!important;}';
      document.head.appendChild(style);
    }
  };

  const obtenerUsuario = () => {
    try {
      return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
    } catch (error) {
      return null;
    }
  };

  const obtenerRol = (usuario) => {
    const idRol = Number(usuario?.id_rol || usuario?.idRol || 0);
    const rolTexto = String(usuario?.nombre_rol || usuario?.rol || '').trim().toLowerCase();

    if (idRol === 3 || rolTexto === 'administrador' || rolTexto === 'admin') {
      return 'admin';
    }

    if (idRol === 2 || rolTexto === 'instructor') {
      return 'instructor';
    }

    if (idRol === 1 || rolTexto === 'alumno' || rolTexto === 'estudiante') {
      return 'alumno';
    }

    return '';
  };

  const haySesion = () => localStorage.getItem('edutech_sesion_activa') === 'true' && Boolean(obtenerUsuario());

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

  const soloAlumno = new Set(['mi-cuenta.html', 'mis-cursos.html', 'aula.html', 'examen.html', 'certificado.html', 'carrito.html', 'comprar-curso.html', 'compra-aprobada.html', 'solicitud-instructor.html']);

  const mensajePorPagina = (archivo) => {
    if (archivo === 'admin.html') {
      return 'Esto solo está disponible para administradores.';
    }

    if (archivo === 'instructor.html' || archivo === 'instructor-examen.html') {
      return 'Esto solo está disponible para instructores.';
    }

    if (soloAlumno.has(archivo)) {
      return 'Esto solo está disponible para alumnos.';
    }

    return 'No tienes permiso para acceder a esta pantalla.';
  };

  const usuarioPuedeAbrir = (usuario, archivo) => {
    const rol = obtenerRol(usuario);

    if (archivo === 'admin.html') {
      return rol === 'admin';
    }

    if (archivo === 'instructor.html' || archivo === 'instructor-examen.html') {
      return rol === 'instructor';
    }

    if (soloAlumno.has(archivo)) {
      return rol === 'alumno';
    }

    return true;
  };

  const remplazar = (destino, mensaje = '') => {
    window.setTimeout(() => {
      if (mensaje) {
        window.alert(mensaje);
      }
      window.location.replace(destino);
    }, 0);
  };

  instalarOcultamiento();

  const usuario = obtenerUsuario();

  if (!haySesion() || !usuario) {
    sessionStorage.setItem('edutech_mensaje_acceso', pagina === 'solicitud-instructor.html'
      ? 'Inicia sesión para enviar la solicitud de instructor.'
      : 'Inicia sesión para continuar.');
    sessionStorage.setItem('edutech_redirect_post_login', `${pagina}${window.location.search || ''}${window.location.hash || ''}`);
    remplazar('login.html');
    return;
  }

  if (!usuarioPuedeAbrir(usuario, pagina)) {
    sessionStorage.removeItem('edutech_mensaje_acceso');
    sessionStorage.removeItem('edutech_mensaje_acceso_destino');
    remplazar(destinoPorRol(usuario), mensajePorPagina(pagina));
  }
})();
