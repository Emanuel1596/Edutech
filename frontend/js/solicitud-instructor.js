const formularioInstructor = document.getElementById('instructorRequestForm');

const correoBaseInstructor = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const dominiosCorreoInstructor = ['com', 'net', 'org', 'edu', 'mx', 'com.mx', 'edu.mx', 'gob.mx', 'gov'];
const contieneLetrasInstructor = (valor) => /[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/.test(String(valor || ''));
const enlacePerfilValidoInstructor = (valor) => {
  const texto = String(valor || '').trim();

  try {
    const url = new URL(texto);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    const partes = url.pathname.split('/').filter(Boolean);

    if (partes.length === 0) {
      return false;
    }

    if (host === 'github.com') {
      const bloqueados = new Set(['features', 'pricing', 'enterprise', 'explore', 'topics', 'collections', 'login', 'signup', 'about', 'marketplace']);
      return partes.length >= 1 && !bloqueados.has(partes[0].toLowerCase());
    }

    if (host === 'linkedin.com') {
      return partes.length >= 2 && ['in', 'company', 'school'].includes(partes[0].toLowerCase());
    }

    if (['gitlab.com', 'bitbucket.org', 'behance.net', 'dribbble.com', 'youtube.com', 'vimeo.com'].includes(host)) {
      return partes.length >= 1;
    }

    return partes.length >= 1;
  } catch (error) {
    return false;
  }
};

const correoInstructorValido = (correo) => {
  const valor = String(correo || '').trim().toLowerCase();

  if (!correoBaseInstructor.test(valor) || valor.includes('..')) {
    return false;
  }

  const dominio = valor.split('@')[1] || '';
  return dominiosCorreoInstructor.some((terminacion) => dominio === terminacion || dominio.endsWith(`.${terminacion}`));
};

const reglasInstructor = {
  instructorNombre: {
    patron: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/,
    mensajeVacio: 'Inicia sesión para cargar tu nombre.',
    mensajeInvalido: 'El nombre solo puede contener letras, espacios, acentos y ñ.'
  },
  instructorCorreo: {
    validar: correoInstructorValido,
    mensajeVacio: 'Inicia sesión para cargar tu correo electrónico.',
    mensajeInvalido: 'Escribe un correo electrónico válido. Usa un dominio como .com, .net, .org o .mx.'
  },
  instructorArea: {
    minimo: 3,
    maximo: 60,
    validar: contieneLetrasInstructor,
    mensajeVacio: 'Escribe tu área de experiencia.',
    mensajeInvalido: 'El área de experiencia debe tener texto; puede incluir números, pero no puede ser solo números.'
  },
  instructorExperiencia: {
    minimo: 10,
    maximo: 500,
    validar: contieneLetrasInstructor,
    mensajeVacio: 'Describe tu experiencia.',
    mensajeInvalido: 'Describe tu experiencia con texto; puede incluir números, pero no puede ser solo números.'
  },
  instructorEvidencia: {
    validar: enlacePerfilValidoInstructor,
    maximo: 200,
    mensajeVacio: 'Agrega un enlace como evidencia.',
    mensajeInvalido: 'Agrega un enlace directo a tu perfil o portafolio, no solo la página de inicio del sitio.'
  },
  instructorMotivo: {
    minimo: 10,
    maximo: 300,
    validar: contieneLetrasInstructor,
    mensajeVacio: 'Escribe el motivo de tu solicitud.',
    mensajeInvalido: 'El motivo debe tener texto; puede incluir números, pero no puede ser solo números.'
  }
};

const obtenerCampoInstructor = (id) => document.getElementById(id);

const obtenerContenedorInstructor = (campo) => campo ? campo.closest('.form-field') : null;

const obtenerErrorInstructor = (campo) => {
  const contenedor = obtenerContenedorInstructor(campo);
  return contenedor ? contenedor.querySelector('.error-message') : null;
};

const mostrarErrorInstructor = (campo, mensaje) => {
  const contenedor = obtenerContenedorInstructor(campo);
  const error = obtenerErrorInstructor(campo);

  if (contenedor) {
    contenedor.classList.add('has-error');
  }

  if (campo) {
    campo.classList.add('is-invalid');
    campo.setAttribute('aria-invalid', 'true');
  }

  if (error) {
    error.textContent = mensaje;
    error.style.display = 'block';
  }
};

const limpiarErrorInstructor = (campo) => {
  const contenedor = obtenerContenedorInstructor(campo);
  const error = obtenerErrorInstructor(campo);

  if (contenedor) {
    contenedor.classList.remove('has-error');
  }

  if (campo) {
    campo.classList.remove('is-invalid');
    campo.removeAttribute('aria-invalid');
  }

  if (error) {
    error.textContent = '';
    error.style.display = 'none';
  }
};

const validarCampoInstructor = (campo, mostrarVacio = false) => {
  if (!campo) {
    return false;
  }

  const regla = reglasInstructor[campo.id];

  if (!regla) {
    return true;
  }

  const valor = campo.value.trim();

  if (valor === '') {
    limpiarErrorInstructor(campo);

    if (mostrarVacio) {
      mostrarErrorInstructor(campo, regla.mensajeVacio);
    }

    return false;
  }

  if (regla.minimo && valor.length < regla.minimo) {
    mostrarErrorInstructor(campo, regla.mensajeInvalido);
    return false;
  }

  if (regla.maximo && valor.length > regla.maximo) {
    mostrarErrorInstructor(campo, regla.mensajeInvalido);
    return false;
  }

  if (regla.validar && !regla.validar(valor)) {
    mostrarErrorInstructor(campo, regla.mensajeInvalido);
    return false;
  }

  if (regla.patron && !regla.patron.test(valor)) {
    mostrarErrorInstructor(campo, regla.mensajeInvalido);
    return false;
  }

  limpiarErrorInstructor(campo);
  return true;
};

const activarValidacionInstructor = () => {
  Object.keys(reglasInstructor).forEach((id) => {
    const campo = obtenerCampoInstructor(id);

    if (!campo || campo.readOnly) {
      return;
    }

    campo.addEventListener('focus', () => {
      if (campo.value.trim() === '') {
        limpiarErrorInstructor(campo);
      }
    });

    campo.addEventListener('blur', () => {
      if (campo.value.trim() === '') {
        limpiarErrorInstructor(campo);
      }
    });

    campo.addEventListener('input', () => {
      validarCampoInstructor(campo, false);
    });
  });
};

const limpiarFormularioInstructor = () => {
  Object.keys(reglasInstructor).forEach((id) => {
    const campo = obtenerCampoInstructor(id);

    if (campo) {
      limpiarErrorInstructor(campo);
    }
  });
};

const obtenerUsuarioSesionInstructor = () => {
  if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
    return window.EduTech.obtenerUsuarioSesion();
  }

  try {
    return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
  } catch (error) {
    return null;
  }
};

const obtenerNombreCompletoUsuario = (usuario) => [
  usuario?.nombre,
  usuario?.apellido_paterno,
  usuario?.apellido_materno
].filter(Boolean).join(' ').trim();

const bloquearFormularioInstructor = (bloqueado) => {
  if (!formularioInstructor) {
    return;
  }

  Array.from(formularioInstructor.elements).forEach((campo) => {
    campo.disabled = bloqueado;
  });
};

const prepararSesionInstructor = () => {
  const usuario = obtenerUsuarioSesionInstructor();
  const sesionActiva = window.EduTech && typeof window.EduTech.haySesionActiva === 'function'
    ? window.EduTech.haySesionActiva()
    : localStorage.getItem('edutech_sesion_activa') === 'true';

  if (!usuario || !sesionActiva) {
    if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
      window.EduTech.guardarRedirectDespuesLogin('solicitud-instructor.html');
    } else {
      sessionStorage.setItem('edutech_redirect_post_login', 'solicitud-instructor.html');
    }

    sessionStorage.setItem('edutech_mensaje_acceso', 'Inicia sesión para enviar la solicitud de instructor.');
    window.location.replace('login.html');
    return null;
  }

  const nombreCampo = obtenerCampoInstructor('instructorNombre');
  const correoCampo = obtenerCampoInstructor('instructorCorreo');

  if (nombreCampo) {
    nombreCampo.value = obtenerNombreCompletoUsuario(usuario) || usuario.correo || '';
  }

  if (correoCampo) {
    correoCampo.value = usuario.correo || '';
  }

  return usuario;
};

const crearSolicitudInstructor = (usuario) => ({
  id_usuario: usuario.id_usuario || usuario.id || usuario.idUsuario,
  area_experiencia: obtenerCampoInstructor('instructorArea').value.trim(),
  experiencia: obtenerCampoInstructor('instructorExperiencia').value.trim(),
  evidencia: obtenerCampoInstructor('instructorEvidencia').value.trim(),
  motivo: obtenerCampoInstructor('instructorMotivo').value.trim()
});

if (formularioInstructor) {
  activarValidacionInstructor();

  const usuarioSesion = prepararSesionInstructor();

  formularioInstructor.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const usuario = obtenerUsuarioSesionInstructor();
    const campos = Object.keys(reglasInstructor).map(obtenerCampoInstructor);
    const formularioValido = campos.every((campo) => validarCampoInstructor(campo, true));
    const mensajeExito = document.getElementById('instructorSuccess');
    const boton = formularioInstructor.querySelector('button[type="submit"]');

    if (!usuario || !usuarioSesion) {
      prepararSesionInstructor();
      return;
    }

    if (!formularioValido) {
      if (mensajeExito) {
        mensajeExito.classList.remove('is-visible');
        mensajeExito.style.display = 'none';
      }

      return;
    }

    try {
      if (boton) {
        boton.disabled = true;
        boton.dataset.textoOriginal = boton.textContent;
        boton.textContent = 'Enviando solicitud...';
      }

      const datos = await window.EduTech.apiRequest('/solicitudes-instructor', {
        method: 'POST',
        body: crearSolicitudInstructor(usuario)
      });

      formularioInstructor.reset();
      limpiarFormularioInstructor();
      prepararSesionInstructor();

      if (mensajeExito) {
        mensajeExito.classList.add('is-visible');
        mensajeExito.style.display = 'block';
        mensajeExito.textContent = datos.message || 'Solicitud enviada para revisión. El administrador revisará la información.';
      }
    } catch (error) {
      if (mensajeExito) {
        mensajeExito.classList.add('is-visible');
        mensajeExito.style.display = 'block';
        mensajeExito.textContent = error.message || 'No se pudo enviar la solicitud. Intenta nuevamente.';
      }
    } finally {
      if (boton) {
        boton.disabled = false;
        boton.textContent = boton.dataset.textoOriginal || 'Enviar solicitud';
      }
    }
  });
}
