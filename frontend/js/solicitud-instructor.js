const formularioInstructor = document.getElementById('instructorRequestForm');

const reglasInstructor = {
  instructorNombre: {
    patron: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/,
    mensajeVacio: 'Escribe tu nombre completo.',
    mensajeInvalido: 'El nombre solo puede contener letras, espacios, acentos y ñ.'
  },
  instructorCorreo: {
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensajeVacio: 'Escribe tu correo electrónico.',
    mensajeInvalido: 'Escribe un correo electrónico válido.'
  },
  instructorArea: {
    minimo: 3,
    mensajeVacio: 'Escribe tu área de experiencia.',
    mensajeInvalido: 'El área de experiencia debe tener al menos 3 caracteres.'
  },
  instructorExperiencia: {
    minimo: 10,
    mensajeVacio: 'Describe tu experiencia.',
    mensajeInvalido: 'Describe tu experiencia con al menos 10 caracteres.'
  },
  instructorEvidencia: {
    patron: /^(https?:\/\/)[^\s]+\.[^\s]+$/,
    mensajeVacio: 'Agrega un enlace como evidencia.',
    mensajeInvalido: 'Agrega un enlace válido que empiece con http:// o https://.'
  },
  instructorMotivo: {
    minimo: 10,
    mensajeVacio: 'Escribe el motivo de tu solicitud.',
    mensajeInvalido: 'El motivo debe tener al menos 10 caracteres.'
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

    if (!campo) {
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

const crearSolicitudInstructor = () => {
  return {
    nombre_completo: obtenerCampoInstructor('instructorNombre').value.trim(),
    correo: obtenerCampoInstructor('instructorCorreo').value.trim(),
    area_experiencia: obtenerCampoInstructor('instructorArea').value.trim(),
    experiencia: obtenerCampoInstructor('instructorExperiencia').value.trim(),
    evidencia: obtenerCampoInstructor('instructorEvidencia').value.trim(),
    motivo: obtenerCampoInstructor('instructorMotivo').value.trim(),
    estado: 'pendiente',
    fecha: new Date().toISOString()
  };
};

if (formularioInstructor) {
  activarValidacionInstructor();

  formularioInstructor.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campos = Object.keys(reglasInstructor).map(obtenerCampoInstructor);
    const formularioValido = campos.every((campo) => validarCampoInstructor(campo, true));
    const mensajeExito = document.getElementById('instructorSuccess');

    if (!formularioValido) {
      if (mensajeExito) {
        mensajeExito.classList.remove('is-visible');
        mensajeExito.style.display = 'none';
      }

      return;
    }

    const solicitud = crearSolicitudInstructor();
    const solicitudesGuardadas = JSON.parse(localStorage.getItem('edutech_solicitudes_instructor') || '[]');

    solicitudesGuardadas.push(solicitud);
    localStorage.setItem('edutech_solicitudes_instructor', JSON.stringify(solicitudesGuardadas));

    formularioInstructor.reset();
    limpiarFormularioInstructor();

    if (mensajeExito) {
      mensajeExito.classList.add('is-visible');
      mensajeExito.style.display = 'block';
      mensajeExito.textContent = 'Solicitud enviada para revisión. El administrador revisará la información antes de habilitar el modo instructor.';
    }
  });
}
