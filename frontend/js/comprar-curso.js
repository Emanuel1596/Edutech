const compraForm = document.getElementById('compraCursoForm');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutNombre = document.getElementById('checkoutNombre');
const checkoutApellidos = document.getElementById('checkoutApellidos');
const checkoutCorreo = document.getElementById('checkoutCorreo');
const checkoutTelefono = document.getElementById('checkoutTelefono');
const checkoutDireccion = document.getElementById('checkoutDireccion');
const checkoutCiudad = document.getElementById('checkoutCiudad');
const checkoutProvincia = document.getElementById('checkoutProvincia');
const checkoutCodigoPostal = document.getElementById('checkoutCodigoPostal');
const checkoutSuccess = document.getElementById('checkoutSuccess');
const checkoutError = document.getElementById('checkoutError');
const checkoutBoton = document.getElementById('checkoutBoton');
const checkoutCursoLinea = document.getElementById('checkoutCursoLinea');
const resumenCurso = document.getElementById('resumenCurso');
const resumenInstructor = document.getElementById('resumenInstructor');
const resumenNivel = document.getElementById('resumenNivel');
const resumenLecciones = document.getElementById('resumenLecciones');
const resumenPrecio = document.getElementById('resumenPrecio');
const resumenTotal = document.getElementById('resumenTotal');

let cursoSeleccionado = null;

const limpiarTexto = (valor) => {
  return String(valor || '').trim();
};

const mostrarResumenCompra = () => {
  if (checkoutSummary) {
    checkoutSummary.style.setProperty('display', 'block', 'important');
  }
};

const ocultarResumenCompra = () => {
  if (checkoutSummary) {
    checkoutSummary.style.setProperty('display', 'none', 'important');
  }
};

const mostrarErrorCompra = (mensaje) => {
  if (checkoutError) {
    checkoutError.textContent = mensaje;
    checkoutError.classList.add('is-visible');
  }

  if (checkoutSuccess) {
    checkoutSuccess.classList.remove('is-visible');
  }
};

const ocultarErrorCompra = () => {
  if (checkoutError) {
    checkoutError.textContent = '';
    checkoutError.classList.remove('is-visible');
  }
};

const mostrarExitoCompra = () => {
  if (checkoutSuccess) {
    checkoutSuccess.classList.add('is-visible');
  }

  ocultarErrorCompra();
};

const bloquearBotonCompra = (bloquear) => {
  if (checkoutBoton) {
    checkoutBoton.disabled = bloquear;
  }
};

const marcarError = (input, tieneError) => {
  if (!input) {
    return;
  }

  const campo = input.closest('.form-field');

  if (campo) {
    campo.classList.toggle('has-error', tieneError);
  }
};

const obtenerParametroId = () => {
  const parametros = new URLSearchParams(window.location.search);
  const idPorQuery = parametros.get('id');

  if (idPorQuery) {
    sessionStorage.setItem('edutech_curso_compra_id', idPorQuery);
    sessionStorage.setItem('edutech_curso_detalle_id', idPorQuery);
    return idPorQuery;
  }

  const idCompra = sessionStorage.getItem('edutech_curso_compra_id');

  if (idCompra) {
    return idCompra;
  }

  const idDetalle = sessionStorage.getItem('edutech_curso_detalle_id');

  if (idDetalle) {
    sessionStorage.setItem('edutech_curso_compra_id', idDetalle);
    return idDetalle;
  }

  return null;
};

const formatearPrecio = (precio) => {
  const numero = Number(precio);

  if (Number.isNaN(numero)) {
    return '$0 MXN';
  }

  return `$${numero.toLocaleString('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })} MXN`;
};

const obtenerInstructor = (curso) => {
  const nombre = curso.nombre_instructor || '';
  const apellido = curso.apellido_paterno_instructor || '';
  const instructor = `${nombre} ${apellido}`.trim();

  return instructor || 'Instructor EduTech';
};

const pintarResumenCurso = (curso) => {
  const titulo = curso.titulo || 'Curso EduTech';
  const instructor = obtenerInstructor(curso);
  const nivel = curso.nombre_nivel || 'Por definir';
  const lecciones = curso.total_lecciones || 'Por definir';
  const precio = formatearPrecio(curso.precio_mxn);

  document.title = `Comprar ${titulo} - EduTech`;

  if (checkoutCursoLinea) {
    checkoutCursoLinea.textContent = `Estás comprando: ${titulo}`;
  }

  if (resumenCurso) {
    resumenCurso.textContent = titulo;
  }

  if (resumenInstructor) {
    resumenInstructor.textContent = instructor;
  }

  if (resumenNivel) {
    resumenNivel.textContent = nivel;
  }

  if (resumenLecciones) {
    resumenLecciones.textContent = lecciones;
  }

  if (resumenPrecio) {
    resumenPrecio.textContent = precio;
  }

  if (resumenTotal) {
    resumenTotal.textContent = precio;
  }
};

const cargarCursoCompra = async () => {
  ocultarResumenCompra();
  bloquearBotonCompra(true);

  const idCurso = obtenerParametroId();

  if (!idCurso) {
    mostrarErrorCompra('No se indicó qué curso se va a comprar.');
    return;
  }

  if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    mostrarErrorCompra('No se pudo conectar con la API.');
    return;
  }

  try {
    const respuesta = await window.EduTech.apiRequest(`/cursos/${idCurso}`);
    const curso = respuesta.curso || respuesta.data || respuesta;

    if (!curso || !curso.id_curso) {
      mostrarErrorCompra('No se encontró el curso seleccionado.');
      return;
    }

    cursoSeleccionado = curso;
    sessionStorage.setItem('edutech_curso_compra_id', String(curso.id_curso));
    pintarResumenCurso(curso);
    ocultarErrorCompra();
    bloquearBotonCompra(false);
    mostrarResumenCompra();
  } catch (error) {
    mostrarErrorCompra('No se pudo cargar la información del curso seleccionado.');
  }
};

const validarFormularioCompra = () => {
  let valido = true;

  const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const patronTelefono = /^\d{10}$/;
  const patronDireccion = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s#.,\-]*$/;
  const patronCP = /^$|^\d{5}$/;

  const nombreOk = patronNombre.test(limpiarTexto(checkoutNombre.value));
  marcarError(checkoutNombre, !nombreOk);
  valido = valido && nombreOk;

  const apellidosOk = patronNombre.test(limpiarTexto(checkoutApellidos.value));
  marcarError(checkoutApellidos, !apellidosOk);
  valido = valido && apellidosOk;

  const correoOk = patronCorreo.test(limpiarTexto(checkoutCorreo.value));
  marcarError(checkoutCorreo, !correoOk);
  valido = valido && correoOk;

  const telefonoOk = patronTelefono.test(limpiarTexto(checkoutTelefono.value));
  marcarError(checkoutTelefono, !telefonoOk);
  valido = valido && telefonoOk;

  const direccionOk = patronDireccion.test(limpiarTexto(checkoutDireccion.value));
  marcarError(checkoutDireccion, !direccionOk);
  valido = valido && direccionOk;

  const ciudad = limpiarTexto(checkoutCiudad.value);
  const ciudadOk = ciudad === '' || patronNombre.test(ciudad);
  marcarError(checkoutCiudad, !ciudadOk);
  valido = valido && ciudadOk;

  const codigoPostalOk = patronCP.test(limpiarTexto(checkoutCodigoPostal.value));
  marcarError(checkoutCodigoPostal, !codigoPostalOk);
  valido = valido && codigoPostalOk;

  if (!cursoSeleccionado || !cursoSeleccionado.id_curso) {
    mostrarErrorCompra('No hay curso seleccionado para comprar.');
    valido = false;
  }

  return valido;
};

const guardarCompraPendiente = () => {
  const precio = formatearPrecio(cursoSeleccionado.precio_mxn);
  const datos = {
    id_curso: cursoSeleccionado.id_curso,
    curso: cursoSeleccionado.titulo || 'Curso EduTech',
    instructor: obtenerInstructor(cursoSeleccionado),
    precio,
    total: precio,
    nombre: limpiarTexto(checkoutNombre.value),
    apellidos: limpiarTexto(checkoutApellidos.value),
    correo: limpiarTexto(checkoutCorreo.value),
    telefono: limpiarTexto(checkoutTelefono.value)
  };

  sessionStorage.setItem('edutech_compra_pendiente', JSON.stringify(datos));
};

const manejarEnvioCompra = (evento) => {
  evento.preventDefault();

  ocultarErrorCompra();

  if (!validarFormularioCompra()) {
    mostrarErrorCompra('Revisa los datos marcados antes de continuar.');
    return;
  }

  guardarCompraPendiente();
  mostrarExitoCompra();

  window.setTimeout(() => {
    window.location.href = `compra-aprobada.html?id=${cursoSeleccionado.id_curso}`;
  }, 650);
};

if (compraForm) {
  compraForm.addEventListener('submit', manejarEnvioCompra);

  [checkoutNombre, checkoutApellidos, checkoutCorreo, checkoutTelefono, checkoutDireccion, checkoutCiudad, checkoutProvincia, checkoutCodigoPostal].forEach((input) => {
    if (!input) {
      return;
    }

    input.addEventListener('input', () => {
      const campo = input.closest('.form-field');

      if (campo && campo.classList.contains('has-error')) {
        validarFormularioCompra();
      }
    });

    input.addEventListener('blur', validarFormularioCompra);
  });
}

document.addEventListener('DOMContentLoaded', cargarCursoCompra);
