const formularioContacto = document.getElementById('contactForm');

const reglasContacto = {
  contactNombre: {
    patron: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/,
    mensajeVacio: 'Escribe tu nombre y apellidos.',
    mensajeInvalido: 'El nombre y los apellidos solo pueden contener letras, espacios, acentos y ñ.'
  },
  contactCorreo: {
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensajeVacio: 'Escribe tu correo electrónico.',
    mensajeInvalido: 'Escribe un correo electrónico válido.'
  },
  contactAsunto: {
    patron: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,:;¿?¡!@#%()\-_/]+$/,
    mensajeVacio: 'Escribe el asunto del mensaje.',
    mensajeInvalido: 'El asunto solo puede contener letras, números, @ y signos básicos.'
  },
  contactMensaje: {
    minimo: 10,
    mensajeVacio: 'Escribe tu mensaje.',
    mensajeInvalido: 'El mensaje debe tener al menos 10 caracteres.'
  }
};

const obtenerCampoContacto = (id) => document.getElementById(id);

const obtenerContenedorContacto = (campo) => campo ? campo.closest('.form-field') : null;

const obtenerErrorContacto = (campo) => {
  const contenedor = obtenerContenedorContacto(campo);
  return contenedor ? contenedor.querySelector('.error-message') : null;
};

const mostrarErrorContacto = (campo, mensaje) => {
  const contenedor = obtenerContenedorContacto(campo);
  const error = obtenerErrorContacto(campo);

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

const limpiarErrorContacto = (campo) => {
  const contenedor = obtenerContenedorContacto(campo);
  const error = obtenerErrorContacto(campo);

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

const validarCampoContacto = (campo, mostrarVacio = false) => {
  if (!campo) {
    return false;
  }

  const regla = reglasContacto[campo.id];

  if (!regla) {
    return true;
  }

  const valor = campo.value.trim();

  if (valor === '') {
    limpiarErrorContacto(campo);

    if (mostrarVacio) {
      mostrarErrorContacto(campo, regla.mensajeVacio);
    }

    return false;
  }

  if (regla.minimo && valor.length < regla.minimo) {
    mostrarErrorContacto(campo, regla.mensajeInvalido);
    return false;
  }

  if (regla.patron && !regla.patron.test(valor)) {
    mostrarErrorContacto(campo, regla.mensajeInvalido);
    return false;
  }

  limpiarErrorContacto(campo);
  return true;
};

const activarValidacionContacto = () => {
  Object.keys(reglasContacto).forEach((id) => {
    const campo = obtenerCampoContacto(id);

    if (!campo) {
      return;
    }

    campo.addEventListener('focus', () => {
      if (campo.value.trim() === '') {
        limpiarErrorContacto(campo);
      }
    });

    campo.addEventListener('blur', () => {
      if (campo.value.trim() === '') {
        limpiarErrorContacto(campo);
      }
    });

    campo.addEventListener('input', () => {
      validarCampoContacto(campo, false);
    });
  });
};

const limpiarFormularioContacto = () => {
  Object.keys(reglasContacto).forEach((id) => {
    const campo = obtenerCampoContacto(id);

    if (campo) {
      limpiarErrorContacto(campo);
    }
  });
};

if (formularioContacto) {
  activarValidacionContacto();

  formularioContacto.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campos = Object.keys(reglasContacto).map(obtenerCampoContacto);
    const formularioValido = campos.every((campo) => validarCampoContacto(campo, true));
    const mensajeExito = document.getElementById('contactSuccess');

    if (!formularioValido) {
      if (mensajeExito) {
        mensajeExito.classList.remove('is-visible');
        mensajeExito.style.display = 'none';
      }

      return;
    }

    const mensaje = {
      nombre: obtenerCampoContacto('contactNombre').value.trim(),
      correo: obtenerCampoContacto('contactCorreo').value.trim(),
      asunto: obtenerCampoContacto('contactAsunto').value.trim(),
      mensaje: obtenerCampoContacto('contactMensaje').value.trim(),
      fecha: new Date().toISOString()
    };

    localStorage.setItem('edutech_ultimo_mensaje_contacto', JSON.stringify(mensaje));

    formularioContacto.reset();
    limpiarFormularioContacto();

    if (mensajeExito) {
      mensajeExito.classList.add('is-visible');
      mensajeExito.style.display = 'block';
      mensajeExito.textContent = 'Mensaje enviado correctamente. EduTech se pondrá en contacto contigo.';
    }
  });
}
