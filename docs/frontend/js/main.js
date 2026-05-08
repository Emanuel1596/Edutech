document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".menu-toggle");

  if (button) {
    button.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
  }
});


// Validación visual de la pantalla de registro.
// Basada en los requerimientos de EduTech: nombre/apellidos válidos,
// correo y confirmación, contraseña y confirmación.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#registroForm");
  if (!form) return;

  const nombre = form.querySelector("#nombre");
  const apellidos = form.querySelector("#apellidos");
  const correo = form.querySelector("#correo");
  const confirmarCorreo = form.querySelector("#confirmarCorreo");
  const password = form.querySelector("#password");
  const confirmarPassword = form.querySelector("#confirmarPassword");
  const success = form.querySelector("#registroSuccess");

  const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, hasError) {
    const field = input.closest(".form-field");
    if (!field) return;
    field.classList.toggle("has-error", hasError);
  }

  function validar() {
    let ok = true;

    const nombreOk = patronNombre.test(nombre.value.trim());
    setError(nombre, !nombreOk);
    ok = ok && nombreOk;

    const apellidosOk = patronNombre.test(apellidos.value.trim());
    setError(apellidos, !apellidosOk);
    ok = ok && apellidosOk;

    const correoOk = patronCorreo.test(correo.value.trim());
    setError(correo, !correoOk);
    ok = ok && correoOk;

    const confirmarCorreoOk = confirmarCorreo.value.trim() === correo.value.trim() && correoOk;
    setError(confirmarCorreo, !confirmarCorreoOk);
    ok = ok && confirmarCorreoOk;

    const passwordOk = password.value.length >= 8;
    setError(password, !passwordOk);
    ok = ok && passwordOk;

    const confirmarPasswordOk = confirmarPassword.value === password.value && passwordOk;
    setError(confirmarPassword, !confirmarPasswordOk);
    ok = ok && confirmarPasswordOk;

    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validar()) {
      window.location.href = "mi-escritorio.html";
    } else {
      success.classList.remove("is-visible");
    }
  });

  [nombre, apellidos, correo, confirmarCorreo, password, confirmarPassword].forEach(function (input) {
    input.addEventListener("blur", validar);
  });
});

// Validación visual de la pantalla de inicio de sesión.
// Prototipo: después de 5 intentos fallidos, bloquea visualmente el formulario.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const correo = form.querySelector("#loginCorreo");
  const password = form.querySelector("#loginPassword");
  const success = form.querySelector("#loginSuccess");
  const warning = form.querySelector("#loginWarning");
  const blocked = form.querySelector("#loginBlocked");

  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let intentosFallidos = 0;
  const limiteIntentos = 5;

  function setError(input, hasError) {
    const field = input.closest(".form-field");
    if (!field) return;
    field.classList.toggle("has-error", hasError);
  }

  function bloquearFormulario() {
    form.classList.add("is-blocked");
    if (blocked) blocked.classList.add("is-visible");
    if (warning) warning.classList.remove("is-visible");
    if (success) success.classList.remove("is-visible");
  }

  function validarLogin() {
    let ok = true;

    const correoOk = patronCorreo.test(correo.value.trim());
    setError(correo, !correoOk);
    ok = ok && correoOk;

    const passwordOk = password.value.trim().length > 0;
    setError(password, !passwordOk);
    ok = ok && passwordOk;

    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (form.classList.contains("is-blocked")) return;

    // En este prototipo no hay base de datos real; se simula intento fallido.
    validarLogin();
    intentosFallidos++;

    if (intentosFallidos >= limiteIntentos) {
      bloquearFormulario();
      return;
    }

    if (warning) warning.classList.add("is-visible");
    if (success) success.classList.remove("is-visible");
    if (blocked) blocked.classList.remove("is-visible");
  });

  [correo, password].forEach(function (input) {
    input.addEventListener("blur", validarLogin);
  });
});


// Validación visual de contacto y solicitud de instructor.
// Reglas usadas en el prototipo:
// - Nombre: solo letras, espacios, acentos y ñ.
// - Correo: formato de correo.
// - Asunto: se permite texto normal, números, @ y signos básicos.
document.addEventListener("DOMContentLoaded", function () {
  const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const patronAsunto = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s@.,;:¿?¡!()\-]+$/;
  const patronUrl = /^https?:\/\/.+\..+/i;

  function setError(input, hasError) {
    const field = input.closest(".form-field");
    if (!field) return;
    field.classList.toggle("has-error", hasError);
  }

  function textoLleno(input) {
    return input && input.value.trim().length > 0;
  }

  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    const nombre = contactForm.querySelector("#contactNombre");
    const correo = contactForm.querySelector("#contactCorreo");
    const asunto = contactForm.querySelector("#contactAsunto");
    const mensaje = contactForm.querySelector("#contactMensaje");
    const success = contactForm.querySelector("#contactSuccess");

    function validarContacto() {
      let ok = true;

      const nombreOk = patronNombre.test(nombre.value.trim());
      setError(nombre, !nombreOk);
      ok = ok && nombreOk;

      const correoOk = patronCorreo.test(correo.value.trim());
      setError(correo, !correoOk);
      ok = ok && correoOk;

      const asuntoOk = patronAsunto.test(asunto.value.trim());
      setError(asunto, !asuntoOk);
      ok = ok && asuntoOk;

      const mensajeOk = textoLleno(mensaje);
      setError(mensaje, !mensajeOk);
      ok = ok && mensajeOk;

      return ok;
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validarContacto()) {
        success.classList.add("is-visible");
        contactForm.reset();
      } else {
        success.classList.remove("is-visible");
      }
    });

    [nombre, correo, asunto, mensaje].forEach(function (input) {
      input.addEventListener("blur", validarContacto);
      input.addEventListener("input", function () {
        if (input.closest(".form-field").classList.contains("has-error")) validarContacto();
      });
    });
  }

  const instructorForm = document.querySelector("#instructorRequestForm");
  if (instructorForm) {
    const nombre = instructorForm.querySelector("#instructorNombre");
    const correo = instructorForm.querySelector("#instructorCorreo");
    const area = instructorForm.querySelector("#instructorArea");
    const experiencia = instructorForm.querySelector("#instructorExperiencia");
    const evidencia = instructorForm.querySelector("#instructorEvidencia");
    const motivo = instructorForm.querySelector("#instructorMotivo");
    const success = instructorForm.querySelector("#instructorSuccess");

    function validarSolicitudInstructor() {
      let ok = true;

      const nombreOk = patronNombre.test(nombre.value.trim());
      setError(nombre, !nombreOk);
      ok = ok && nombreOk;

      const correoOk = patronCorreo.test(correo.value.trim());
      setError(correo, !correoOk);
      ok = ok && correoOk;

      const areaOk = textoLleno(area);
      setError(area, !areaOk);
      ok = ok && areaOk;

      const experienciaOk = textoLleno(experiencia);
      setError(experiencia, !experienciaOk);
      ok = ok && experienciaOk;

      const evidenciaOk = patronUrl.test(evidencia.value.trim());
      setError(evidencia, !evidenciaOk);
      ok = ok && evidenciaOk;

      const motivoOk = textoLleno(motivo);
      setError(motivo, !motivoOk);
      ok = ok && motivoOk;

      return ok;
    }

    instructorForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validarSolicitudInstructor()) {
        success.classList.add("is-visible");
        instructorForm.reset();
      } else {
        success.classList.remove("is-visible");
      }
    });

    [nombre, correo, area, experiencia, evidencia, motivo].forEach(function (input) {
      input.addEventListener("blur", validarSolicitudInstructor);
      input.addEventListener("input", function () {
        if (input.closest(".form-field").classList.contains("has-error")) validarSolicitudInstructor();
      });
    });
  }
});


// Validación visual de recuperación de contraseña.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#recoverForm");
  if (!form) return;

  const correo = form.querySelector("#recoverCorreo");
  const success = form.querySelector("#recoverSuccess");
  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, hasError) {
    const field = input.closest(".form-field");
    if (!field) return;
    field.classList.toggle("has-error", hasError);
  }

  function validarRecover() {
    const ok = patronCorreo.test(correo.value.trim());
    setError(correo, !ok);
    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validarRecover()) {
      success.classList.add("is-visible");
      form.reset();
    } else {
      success.classList.remove("is-visible");
    }
  });

  correo.addEventListener("blur", validarRecover);
});

// Validación visual de adquisición de curso.
// Prototipo: se asume que el alumno ya inició sesión y se validan los datos de facturación.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#checkoutForm");
  if (!form) return;

  const nombre = form.querySelector("#checkoutNombre");
  const apellidos = form.querySelector("#checkoutApellidos");
  const direccion = form.querySelector("#checkoutDireccion");
  const ciudad = form.querySelector("#checkoutCiudad");
  const pais = form.querySelector("#checkoutPais");
  const provincia = form.querySelector("#checkoutProvincia");
  const codigoPostal = form.querySelector("#checkoutCodigoPostal");
  const telefono = form.querySelector("#checkoutTelefono");
  const success = form.querySelector("#checkoutSuccess");

  const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
  const patronDireccion = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s#.,\-]+$/;
  const patronCP = /^\d{5}$/;
  const patronTelefono = /^\d{10}$/;

  function setError(input, hasError) {
    if (!input) return;
    const field = input.closest(".form-field");
    if (!field) return;
    field.classList.toggle("has-error", hasError);
  }

  function tieneValor(input) {
    return input && input.value.trim().length > 0;
  }

  function validarCheckout() {
    let ok = true;

    const nombreOk = patronNombre.test(nombre.value.trim());
    setError(nombre, !nombreOk);
    ok = ok && nombreOk;

    const apellidosOk = patronNombre.test(apellidos.value.trim());
    setError(apellidos, !apellidosOk);
    ok = ok && apellidosOk;

    const direccionOk = patronDireccion.test(direccion.value.trim());
    setError(direccion, !direccionOk);
    ok = ok && direccionOk;

    const ciudadOk = patronNombre.test(ciudad.value.trim());
    setError(ciudad, !ciudadOk);
    ok = ok && ciudadOk;

    const paisOk = tieneValor(pais);
    setError(pais, !paisOk);
    ok = ok && paisOk;

    const provinciaOk = tieneValor(provincia);
    setError(provincia, !provinciaOk);
    ok = ok && provinciaOk;

    const codigoPostalOk = patronCP.test(codigoPostal.value.trim());
    setError(codigoPostal, !codigoPostalOk);
    ok = ok && codigoPostalOk;

    const telefonoOk = patronTelefono.test(telefono.value.trim());
    setError(telefono, !telefonoOk);
    ok = ok && telefonoOk;

    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validarCheckout()) {
      if (success) success.classList.add("is-visible");
      window.setTimeout(function () {
        window.location.href = "compra-aprobada.html";
      }, 650);
    } else if (success) {
      success.classList.remove("is-visible");
    }
  });

  [nombre, apellidos, direccion, ciudad, pais, provincia, codigoPostal, telefono].forEach(function (input) {
    if (!input) return;
    input.addEventListener("blur", validarCheckout);
    input.addEventListener("input", function () {
      const field = input.closest(".form-field");
      if (field && field.classList.contains("has-error")) validarCheckout();
    });
  });
});


// Mostrar u ocultar contraseña en los formularios.
document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".password-toggle");

  toggles.forEach(function (toggle) {
    const targetId = toggle.getAttribute("data-target");
    const input = targetId ? document.getElementById(targetId) : toggle.parentElement.querySelector("input");
    if (!input) return;

    toggle.addEventListener("click", function () {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(isHidden));
      toggle.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });
});

// Carrusel del hero de inicio.
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".hero-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
  const prev = carousel.querySelector(".hero-prev");
  const next = carousel.querySelector(".hero-next");

  if (!slides.length) return;

  let current = 0;
  let timer = null;
  let locked = false;

  function showSlide(index, direction) {
    if (locked || index === current) return;
    locked = true;

    const previous = current;
    current = (index + slides.length) % slides.length;

    slides[previous].classList.remove("active", "is-leaving-left", "is-leaving-right");
    slides[previous].classList.add(direction === "prev" ? "is-leaving-right" : "is-leaving-left");

    if (dots[previous]) dots[previous].classList.remove("active");

    slides[current].classList.remove("is-leaving-left", "is-leaving-right");
    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");

    window.setTimeout(function () {
      slides[previous].classList.remove("is-leaving-left", "is-leaving-right");
      locked = false;
    }, 680);
  }

  function nextSlide() {
    showSlide(current + 1, "next");
  }

  function prevSlide() {
    showSlide(current - 1, "prev");
  }

  function restartTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(nextSlide, 6500);
  }

  if (next) {
    next.addEventListener("click", function () {
      nextSlide();
      restartTimer();
    });
  }

  if (prev) {
    prev.addEventListener("click", function () {
      prevSlide();
      restartTimer();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      const direction = index < current ? "prev" : "next";
      showSlide(index, direction);
      restartTimer();
    });
  });

  carousel.addEventListener("mouseenter", function () {
    window.clearInterval(timer);
  });

  carousel.addEventListener("mouseleave", restartTimer);

  restartTimer();
});
