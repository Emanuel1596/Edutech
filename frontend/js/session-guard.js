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
    style.textContent = `
      html.edutech-session-checking body {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  const ocultar = () => {
    if (!esPaginaControlada()) {
      return;
    }

    instalarEstilo();
    document.documentElement.classList.add('edutech-session-checking', 'edutech-guard-pending', 'edutech-protected-loading');
  };

  const limpiarCargaVisual = () => {
    if (!document.body) {
      return;
    }

    document.body.classList.remove('edutech-data-pending', 'edutech-data-loading');
  };

  const mostrar = () => {
    limpiarCargaVisual();
    document.documentElement.classList.remove('edutech-session-checking', 'edutech-guard-pending', 'edutech-protected-loading');

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

  const generarEpochSesion = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const obtenerEpochSesion = () => {
    let epoch = sessionStorage.getItem('edutech_session_epoch');

    if (!epoch) {
      epoch = generarEpochSesion();
      sessionStorage.setItem('edutech_session_epoch', epoch);
    }

    return epoch;
  };

  const obtenerRutaRelativaActual = () => {
    const archivo = paginaActual();
    const query = window.location.search || '';
    const hash = window.location.hash || '';

    return `${archivo}${query}${hash}`;
  };

  const estadoHistorialValido = () => {
    const epoch = sessionStorage.getItem('edutech_session_epoch');
    const estado = history.state && typeof history.state === 'object' ? history.state : null;

    return Boolean(epoch && estado && estado.edutechAuthEpoch === epoch);
  };

  const etiquetarHistorialActual = (usuario) => {
    if (!usuario || !haySesion()) {
      return;
    }

    const epoch = obtenerEpochSesion();
    const rutaActual = obtenerRutaRelativaActual();

    try {
      const estadoActual = history.state && typeof history.state === 'object' ? history.state : {};
      history.replaceState({
        ...estadoActual,
        edutechAuthEpoch: epoch,
        edutechRuta: rutaActual
      }, document.title, window.location.href);
    } catch (error) {
      // No todos los navegadores permiten escribir history.state en todos los casos.
    }

    const pagina = paginaActual();

    if (!paginasAutenticacion.has(pagina)) {
      sessionStorage.setItem('edutech_ultima_ruta_segura', rutaActual);
    }
  };

  const destinoSeguroTrasHistorial = (usuario) => {
    const ultimaRuta = sessionStorage.getItem('edutech_ultima_ruta_segura') || '';

    if (ultimaRuta && usuarioPuedeAbrir(usuario, normalizarArchivoRuta(ultimaRuta))) {
      return ultimaRuta;
    }

    return destinoPorRol(usuario);
  };

  const limpiarMensajesAccesoObsoletos = () => {
    const mensaje = sessionStorage.getItem('edutech_mensaje_acceso') || '';
    const destino = sessionStorage.getItem('edutech_mensaje_acceso_destino') || '';
    const pagina = paginaActual();

    if (!mensaje) {
      return;
    }

    if (destino && destino !== pagina) {
      sessionStorage.removeItem('edutech_mensaje_acceso');
      sessionStorage.removeItem('edutech_mensaje_acceso_destino');
      return;
    }

    if (/inicia sesi[oó]n/i.test(mensaje) && pagina !== 'login.html') {
      sessionStorage.removeItem('edutech_mensaje_acceso');
      sessionStorage.removeItem('edutech_mensaje_acceso_destino');
    }
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

  const normalizarArchivoRuta = (ruta) => {
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

  const usuarioPuedeAbrir = (usuario, pagina) => {
    const rol = obtenerRol(usuario);

    if (pagina === 'admin.html') {
      return rol === 'admin';
    }

    if (pagina === 'instructor.html' || pagina === 'instructor-examen.html') {
      return rol === 'instructor';
    }

    if ([
      'mi-cuenta.html',
      'mis-cursos.html',
      'aula.html',
      'examen.html',
      'certificado.html',
      'pago-paypal.html',
      'solicitud-instructor.html'
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
      const usuario = obtenerUsuario();
      etiquetarHistorialActual(usuario);
      mostrar();
      return true;
    }

    window.location.replace(destino);
    return true;
  };

  const reemplazarPorHistorialAntiguo = (usuario) => {
    const destino = destinoSeguroTrasHistorial(usuario);
    ocultar();
    window.location.replace(destino);
    return true;
  };

  const validar = (opciones = {}) => {
    const pagina = paginaActual();
    const usuario = obtenerUsuario();
    const sesion = haySesion();
    const desdeHistorial = Boolean(opciones.desdeHistorial);

    if (sesion && usuario && desdeHistorial && esPaginaControlada() && !estadoHistorialValido()) {
      return reemplazarPorHistorialAntiguo(usuario);
    }

    if (paginasAutenticacion.has(pagina)) {
      if (sesion && usuario) {
        return reemplazar(destinoPorRol(usuario));
      }

      mostrar();
      return false;
    }

    if (!paginasProtegidas.has(pagina)) {
      if (sesion && usuario) {
        etiquetarHistorialActual(usuario);
      }
      mostrar();
      return false;
    }

    if (!sesion || !usuario) {
      if (pagina === 'solicitud-instructor.html') {
        sessionStorage.setItem('edutech_redirect_post_login', 'solicitud-instructor.html');
        sessionStorage.setItem('edutech_mensaje_acceso', 'Inicia sesión para enviar la solicitud de instructor.');
      } else {
        sessionStorage.setItem('edutech_mensaje_acceso', 'Inicia sesión para continuar.');
      }

      return reemplazar('login.html');
    }

    limpiarMensajesAccesoObsoletos();

    if (!usuarioPuedeAbrir(usuario, pagina)) {
      sessionStorage.removeItem('edutech_mensaje_acceso');
      sessionStorage.removeItem('edutech_mensaje_acceso_destino');
      return reemplazar(destinoPorRol(usuario));
    }

    etiquetarHistorialActual(usuario);
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

  window.addEventListener('beforeunload', () => {
    ocultar();
  });

  window.addEventListener('pageshow', (evento) => {
    const navegacion = performance.getEntriesByType
      ? performance.getEntriesByType('navigation')[0]
      : null;
    const desdeHistorial = Boolean(evento.persisted || (navegacion && navegacion.type === 'back_forward'));

    validar({ desdeHistorial });
  });

  window.addEventListener('popstate', () => {
    window.setTimeout(() => validar({ desdeHistorial: true }), 0);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validar);
  } else {
    validar();
  }
})();
