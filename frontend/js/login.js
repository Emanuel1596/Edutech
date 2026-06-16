const formLogin = document.getElementById('loginForm');
const loginSuccess = document.getElementById('loginSuccess');
const loginWarning = document.getElementById('loginWarning');
const loginBlocked = document.getElementById('loginBlocked');

if (!formLogin) {
  console.error('No se encontró el formulario de login.');
} else {
  const correoInput = document.getElementById('loginCorreo') || document.getElementById('correo');
  const passwordInput = document.getElementById('loginPassword') || document.getElementById('password');
  const botonLogin = formLogin.querySelector('.login-submit');

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxIntentos = 10;
  const tiempoBloqueoMs = 5000;
  const claveIntentos = 'edutech_login_intentos';
  const claveBloqueo = 'edutech_login_bloqueado_hasta';

  const ocultarElemento = (elemento) => {
    if (elemento) {
      elemento.style.display = 'none';
    }
  };

  const mostrarElemento = (elemento, mensaje) => {
    if (!elemento) {
      return;
    }

    elemento.textContent = mensaje;
    elemento.style.display = 'block';
  };

  const ocultarMensajesGenerales = () => {
    ocultarElemento(loginSuccess);
    ocultarElemento(loginWarning);
    ocultarElemento(loginBlocked);
  };

  const obtenerContenedorCampo = (campo) => campo ? campo.closest('.form-field') : null;

  const limpiarSiCampoVacio = (campo) => {
    if (campo && campo.value.trim() === '') {
      quitarErrorCampo(campo);
    }
  };


  const quitarErrorCampo = (campo) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerContenedorCampo(campo);
    const mensaje = contenedor ? contenedor.querySelector('.error-message') : null;

    campo.classList.remove('error');
    campo.classList.remove('input-error');
    campo.classList.remove('is-invalid');
    campo.removeAttribute('aria-invalid');

    if (contenedor) {
      contenedor.classList.remove('has-error');
    }

    if (mensaje) {
      mensaje.textContent = '';
      mensaje.style.display = 'none';
    }
  };

  const mostrarErrorCampo = (campo, mensajeTexto) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerContenedorCampo(campo);
    const mensaje = contenedor ? contenedor.querySelector('.error-message') : null;

    campo.classList.add('is-invalid');
    campo.setAttribute('aria-invalid', 'true');

    if (contenedor) {
      contenedor.classList.add('has-error');
    }

    if (mensaje) {
      mensaje.textContent = mensajeTexto;
      mensaje.style.display = 'block';
    }
  };

  const bloquearBotonLogin = (texto) => {
    if (!botonLogin) {
      return;
    }

    botonLogin.disabled = true;
    botonLogin.textContent = texto;
  };

  const desbloquearBotonLogin = () => {
    if (!botonLogin) {
      return;
    }

    botonLogin.disabled = false;
    botonLogin.textContent = 'Iniciar sesión';
  };

  const obtenerIntentos = () => Number(localStorage.getItem(claveIntentos) || '0');
  const guardarIntentos = (intentos) => localStorage.setItem(claveIntentos, String(intentos));

  const limpiarIntentos = () => {
    localStorage.removeItem(claveIntentos);
    localStorage.removeItem(claveBloqueo);
  };

  const obtenerBloqueoHasta = () => Number(localStorage.getItem(claveBloqueo) || '0');

  const estaBloqueado = () => {
    const bloqueoHasta = obtenerBloqueoHasta();

    if (!bloqueoHasta) {
      return false;
    }

    if (Date.now() >= bloqueoHasta) {
      limpiarIntentos();
      desbloquearBotonLogin();
      return false;
    }

    return true;
  };

  const activarBloqueoTemporal = () => {
    const bloqueoHasta = Date.now() + tiempoBloqueoMs;
    localStorage.setItem(claveBloqueo, String(bloqueoHasta));
    bloquearBotonLogin('Login bloqueado');
    ocultarMensajesGenerales();
    mostrarElemento(loginBlocked, 'Demasiados intentos. Intenta más tarde.');

    setTimeout(() => {
      limpiarIntentos();
      desbloquearBotonLogin();
      ocultarMensajesGenerales();
    }, tiempoBloqueoMs);
  };

  const registrarIntento = () => {
    const intentos = obtenerIntentos() + 1;
    guardarIntentos(intentos);

    if (intentos >= maxIntentos) {
      activarBloqueoTemporal();
      return false;
    }

    return true;
  };

  const limpiarDatosAlumnoAnterior = (usuarioNuevo) => {
    const idAnterior = localStorage.getItem('edutech_id_usuario') || sessionStorage.getItem('edutech_id_usuario');
    const idNuevo = usuarioNuevo ? String(usuarioNuevo.id_usuario || usuarioNuevo.id || '') : '';

    if (!idAnterior || !idNuevo || String(idAnterior) !== idNuevo) {
      const claves = [
        'edutech_mis_cursos',
        'edutech_avances_cursos',
        'edutech_curso_compra_id',
        'edutech_curso_detalle_id',
        'edutech_compra_pendiente',
        'edutech_compra_aprobada_backend'
      ];

      claves.forEach((clave) => {
        localStorage.removeItem(clave);
        sessionStorage.removeItem(clave);
      });
    }
  };

  const validarCorreo = () => {
    const correo = correoInput.value.trim();

    quitarErrorCampo(correoInput);

    if (!correo) {
      return false;
    }

    return regexCorreo.test(correo);
  };

  const validarPassword = () => {
    const password = passwordInput.value;

    quitarErrorCampo(passwordInput);
    return Boolean(password);
  };

  [correoInput, passwordInput].forEach((campo) => {
    campo.addEventListener('focus', () => limpiarSiCampoVacio(campo));
    campo.addEventListener('blur', () => limpiarSiCampoVacio(campo));
  });

  correoInput.addEventListener('input', () => {
    ocultarMensajesGenerales();
    quitarErrorCampo(correoInput);
  });

  passwordInput.addEventListener('input', () => {
    ocultarMensajesGenerales();
    quitarErrorCampo(passwordInput);
  });

  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (estaBloqueado()) {
      ocultarMensajesGenerales();
      mostrarElemento(loginBlocked, 'Demasiados intentos. Intenta más tarde.');
      return;
    }

    ocultarMensajesGenerales();

    const formularioValido = [
      validarCorreo(),
      validarPassword()
    ].every(Boolean);

    if (!formularioValido) {
      registrarIntento();
      mostrarElemento(loginWarning, 'Revisa el correo y la contraseña e intenta nuevamente.');
      return;
    }

    const datosLogin = {
      correo: correoInput.value.trim().toLowerCase(),
      password: passwordInput.value
    };

    try {
      bloquearBotonLogin('Ingresando...');

      if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
        throw {
          message: 'No se pudo conectar con la API. Revisa que api.js esté cargado.'
        };
      }

      const respuesta = await window.EduTech.apiRequest('/auth/login', {
        method: 'POST',
        body: datosLogin
      });

      const usuario = respuesta.usuario || respuesta.data || respuesta;

      if (window.EduTech && typeof window.EduTech.guardarUsuarioSesion === 'function') {
        limpiarDatosAlumnoAnterior(usuario);
        window.EduTech.guardarUsuarioSesion(usuario);
      }

      limpiarIntentos();
      ocultarMensajesGenerales();
      mostrarElemento(loginSuccess, 'Inicio de sesión correcto. Redirigiendo...');

      const redireccion = sessionStorage.getItem('edutech_redirect_post_login') || sessionStorage.getItem('edutech_redirect_after_login');
      const rutaPorRol = window.EduTech && typeof window.EduTech.obtenerRutaInicioPorRol === 'function'
        ? window.EduTech.obtenerRutaInicioPorRol(usuario)
        : 'mi-cuenta.html';
      const redireccionPermitida = redireccion
        && window.EduTech
        && typeof window.EduTech.usuarioPuedeAbrirRuta === 'function'
        && window.EduTech.usuarioPuedeAbrirRuta(usuario, redireccion);
      const destinoLogin = redireccionPermitida ? redireccion : rutaPorRol;

      if (window.EduTech && typeof window.EduTech.iniciarNuevaSesionNavegacion === 'function') {
        window.EduTech.iniciarNuevaSesionNavegacion(destinoLogin);
      } else {
        sessionStorage.removeItem('edutech_redirect_post_login');
        sessionStorage.removeItem('edutech_redirect_after_login');
        sessionStorage.removeItem('edutech_mensaje_acceso');
        sessionStorage.removeItem('edutech_mensaje_acceso_destino');
      }

      if (typeof window.EduTechOcultarPaginaHistorial === 'function') {
        window.EduTechOcultarPaginaHistorial();
      }

      window.location.replace(destinoLogin);
    } catch (error) {
      desbloquearBotonLogin();
      registrarIntento();

      const mensajeOriginal = String(error.message || error.error || '');
      const mensajeError = /conectar|api|puerto|servidor/i.test(mensajeOriginal)
        ? mensajeOriginal
        : 'No pudimos iniciar sesión. Revisa el correo y la contraseña e intenta nuevamente.';

      ocultarMensajesGenerales();
      mostrarElemento(loginWarning, mensajeError);
    }
  });
}
