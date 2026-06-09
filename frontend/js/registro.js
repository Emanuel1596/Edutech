const formRegistro = document.getElementById('registroForm');
const registroSuccess = document.getElementById('registroSuccess');

if (!formRegistro || !registroSuccess) {
  console.error('No se encontró el formulario de registro.');
} else {
  const nombreInput = document.getElementById('nombre');
  const apellidosInput = document.getElementById('apellidos');
  const correoInput = document.getElementById('correo');
  const confirmarCorreoInput = document.getElementById('confirmarCorreo');
  const passwordInput = document.getElementById('password');
  const confirmarPasswordInput = document.getElementById('confirmarPassword');
  const botonRegistro = formRegistro.querySelector('.register-submit');

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxIntentos = 10;
  const tiempoBloqueoMs = 5000;
  const claveIntentos = 'edutech_registro_intentos';
  const claveBloqueo = 'edutech_registro_bloqueado_hasta';

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

  const limpiarErroresVisuales = () => {
    formRegistro.querySelectorAll('input').forEach((campo) => {
      quitarErrorCampo(campo);
    });
  };

  const mostrarMensajeGeneral = (mensaje, esError = false) => {
    registroSuccess.textContent = mensaje;
    registroSuccess.style.display = 'block';
    registroSuccess.style.color = esError ? '#ff5c5c' : '#19d37d';
  };

  const ocultarMensajeGeneral = () => {
    registroSuccess.textContent = '';
    registroSuccess.style.display = 'none';
  };

  const limpiarDatosAlumnoAnterior = () => {
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
  };

  const separarApellidos = (apellidos) => {
    const partes = apellidos.trim().split(/\s+/);

    return {
      apellido_paterno: partes[0] || '',
      apellido_materno: partes.slice(1).join(' ') || null
    };
  };

  const bloquearBotonRegistro = (texto) => {
    if (!botonRegistro) {
      return;
    }

    botonRegistro.disabled = true;
    botonRegistro.textContent = texto;
  };

  const desbloquearBotonRegistro = () => {
    if (!botonRegistro) {
      return;
    }

    botonRegistro.disabled = false;
    botonRegistro.textContent = 'Registrarse';
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
      desbloquearBotonRegistro();
      return false;
    }

    return true;
  };

  const activarBloqueoTemporal = () => {
    const bloqueoHasta = Date.now() + tiempoBloqueoMs;
    localStorage.setItem(claveBloqueo, String(bloqueoHasta));
    bloquearBotonRegistro('Registro bloqueado');
    mostrarMensajeGeneral('Demasiados intentos. Intenta más tarde.', true);

    setTimeout(() => {
      limpiarIntentos();
      desbloquearBotonRegistro();
      ocultarMensajeGeneral();
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

  const validarNombre = (mostrarVacio = false) => {
    const nombre = nombreInput.value.trim();

    if (!nombre) {
      quitarErrorCampo(nombreInput);

      if (mostrarVacio) {
        mostrarErrorCampo(nombreInput, 'El nombre es obligatorio.');
      }

      return false;
    }

    if (!regexNombre.test(nombre)) {
      mostrarErrorCampo(nombreInput, 'El nombre solo debe contener letras, espacios, acentos y ñ.');
      return false;
    }

    quitarErrorCampo(nombreInput);
    return true;
  };

  const validarApellidos = (mostrarVacio = false) => {
    const apellidos = apellidosInput.value.trim();

    if (!apellidos) {
      quitarErrorCampo(apellidosInput);

      if (mostrarVacio) {
        mostrarErrorCampo(apellidosInput, 'Los apellidos son obligatorios.');
      }

      return false;
    }

    if (!regexNombre.test(apellidos)) {
      mostrarErrorCampo(apellidosInput, 'Los apellidos solo deben contener letras, espacios, acentos y ñ.');
      return false;
    }

    quitarErrorCampo(apellidosInput);
    return true;
  };

  const validarCorreo = (mostrarVacio = false) => {
    const correo = correoInput.value.trim();

    if (!correo) {
      quitarErrorCampo(correoInput);

      if (mostrarVacio) {
        mostrarErrorCampo(correoInput, 'El correo electrónico es obligatorio.');
      }

      return false;
    }

    if (!regexCorreo.test(correo)) {
      mostrarErrorCampo(correoInput, 'Escribe un correo electrónico válido.');
      return false;
    }

    quitarErrorCampo(correoInput);
    return true;
  };

  const validarConfirmarCorreo = (mostrarVacio = false) => {
    const correo = correoInput.value.trim();
    const confirmarCorreo = confirmarCorreoInput.value.trim();

    if (!confirmarCorreo) {
      quitarErrorCampo(confirmarCorreoInput);

      if (mostrarVacio) {
        mostrarErrorCampo(confirmarCorreoInput, 'Debes confirmar tu correo electrónico.');
      }

      return false;
    }

    if (correo && correo !== confirmarCorreo) {
      mostrarErrorCampo(confirmarCorreoInput, 'La confirmación del correo debe coincidir.');
      return false;
    }

    quitarErrorCampo(confirmarCorreoInput);
    return true;
  };

  const validarPassword = (mostrarVacio = false) => {
    const password = passwordInput.value;

    if (!password) {
      quitarErrorCampo(passwordInput);

      if (mostrarVacio) {
        mostrarErrorCampo(passwordInput, 'La contraseña es obligatoria.');
      }

      return false;
    }

    if (password.length < 8) {
      mostrarErrorCampo(passwordInput, 'La contraseña debe tener mínimo 8 caracteres.');
      return false;
    }

    quitarErrorCampo(passwordInput);
    return true;
  };

  const validarConfirmarPassword = (mostrarVacio = false) => {
    const password = passwordInput.value;
    const confirmarPassword = confirmarPasswordInput.value;

    if (!confirmarPassword) {
      quitarErrorCampo(confirmarPasswordInput);

      if (mostrarVacio) {
        mostrarErrorCampo(confirmarPasswordInput, 'Debes confirmar tu contraseña.');
      }

      return false;
    }

    if (password && confirmarPassword !== password) {
      mostrarErrorCampo(confirmarPasswordInput, 'La confirmación de contraseña debe coincidir.');
      return false;
    }

    quitarErrorCampo(confirmarPasswordInput);
    return true;
  };

  [nombreInput, apellidosInput, correoInput, confirmarCorreoInput, passwordInput, confirmarPasswordInput].forEach((campo) => {
    campo.addEventListener('focus', () => limpiarSiCampoVacio(campo));
    campo.addEventListener('blur', () => limpiarSiCampoVacio(campo));
  });

  nombreInput.addEventListener('input', () => validarNombre(false));
  apellidosInput.addEventListener('input', () => validarApellidos(false));
  correoInput.addEventListener('input', () => {
    validarCorreo(false);

    if (confirmarCorreoInput.value.trim()) {
      validarConfirmarCorreo(false);
    }
  });
  confirmarCorreoInput.addEventListener('input', () => validarConfirmarCorreo(false));
  passwordInput.addEventListener('input', () => {
    validarPassword(false);

    if (confirmarPasswordInput.value) {
      validarConfirmarPassword(false);
    }
  });
  confirmarPasswordInput.addEventListener('input', () => validarConfirmarPassword(false));

  formRegistro.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (estaBloqueado()) {
      mostrarMensajeGeneral('Demasiados intentos. Intenta más tarde.', true);
      return;
    }

    ocultarMensajeGeneral();

    const formularioValido = [
      validarNombre(true),
      validarApellidos(true),
      validarCorreo(true),
      validarConfirmarCorreo(true),
      validarPassword(true),
      validarConfirmarPassword(true)
    ].every(Boolean);

    if (!formularioValido) {
      registrarIntento();
      return;
    }

    const { apellido_paterno, apellido_materno } = separarApellidos(apellidosInput.value);

    const datosRegistro = {
      nombre: nombreInput.value.trim(),
      apellido_paterno,
      apellido_materno,
      correo: correoInput.value.trim().toLowerCase(),
      password: passwordInput.value,
      telefono: null
    };

    try {
      bloquearBotonRegistro('Registrando...');

      if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
        throw {
          message: 'No se pudo conectar con la API. Revisa que api.js esté cargado.'
        };
      }

      const respuesta = await window.EduTech.apiRequest('/auth/registro', {
        method: 'POST',
        body: datosRegistro
      });

      const usuario = respuesta.usuario || respuesta.data || respuesta;

      if (window.EduTech && typeof window.EduTech.guardarUsuarioSesion === 'function') {
        limpiarDatosAlumnoAnterior();
        window.EduTech.guardarUsuarioSesion(usuario);
      }

      limpiarIntentos();
      limpiarErroresVisuales();
      mostrarMensajeGeneral('Registro correcto. Redirigiendo...', false);

      setTimeout(() => {
        window.location.href = 'mi-cuenta.html';
      }, 700);
    } catch (error) {
      desbloquearBotonRegistro();
      registrarIntento();

      const mensajeError = error.message || error.error || 'No se pudo completar el registro.';
      mostrarMensajeGeneral(mensajeError, true);
    }
  });
}
