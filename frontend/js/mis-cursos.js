const misCursosGrid = document.getElementById('misCursosGrid');
const misCursosVacio = document.getElementById('misCursosVacio');
const misCursosConteo = document.getElementById('misCursosConteo');

const mostrarElemento = (elemento) => {
  if (elemento) {
    elemento.style.setProperty('display', 'block', 'important');
  }
};

const mostrarGrid = (elemento) => {
  if (elemento) {
    elemento.style.setProperty('display', 'grid', 'important');
  }
};

const ocultarElemento = (elemento) => {
  if (elemento) {
    elemento.style.setProperty('display', 'none', 'important');
  }
};

const obtenerCursosComprados = () => {
  const cursosGuardados = localStorage.getItem('edutech_mis_cursos');

  if (!cursosGuardados) {
    return [];
  }

  try {
    const cursos = JSON.parse(cursosGuardados);

    if (Array.isArray(cursos)) {
      return cursos;
    }

    return [];
  } catch (error) {
    return [];
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) {
    return 'Fecha no disponible';
  }

  const fechaCompra = new Date(fecha);

  if (Number.isNaN(fechaCompra.getTime())) {
    return 'Fecha no disponible';
  }

  return fechaCompra.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const crearElemento = (etiqueta, clase, texto) => {
  const elemento = document.createElement(etiqueta);

  if (clase) {
    elemento.className = clase;
  }

  if (texto !== undefined && texto !== null) {
    elemento.textContent = texto;
  }

  return elemento;
};

const crearTarjetaCursoComprado = (curso) => {
  const tarjeta = crearElemento('article', 'my-course-card');

  const encabezado = crearElemento('div', 'my-course-card-header');
  const estado = crearElemento('span', 'my-course-status', curso.estatus || 'Aprobada');
  const fecha = crearElemento('span', 'my-course-date', formatearFecha(curso.fecha_compra));

  encabezado.appendChild(estado);
  encabezado.appendChild(fecha);

  const titulo = crearElemento('h3', null, curso.curso || 'Curso EduTech');

  const instructor = crearElemento('p', 'my-course-instructor', `Instructor: ${curso.instructor || 'Instructor EduTech'}`);
  const total = crearElemento('p', 'my-course-price', `Total: ${curso.total || curso.precio || '$0 MXN'}`);

  const acciones = crearElemento('div', 'my-course-actions');

  const acceso = crearElemento('a', 'my-courses-primary-action', 'Entrar al curso');
  acceso.href = curso.id_curso ? `escritorio-alumno.html?id=${curso.id_curso}` : 'escritorio-alumno.html';

  const detalle = crearElemento('a', 'my-courses-secondary-action', 'Ver detalle');
  detalle.href = curso.id_curso ? `detalle-curso.html?id=${curso.id_curso}` : 'cursos.html';

  acciones.appendChild(acceso);
  acciones.appendChild(detalle);

  tarjeta.appendChild(encabezado);
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(instructor);
  tarjeta.appendChild(total);
  tarjeta.appendChild(acciones);

  return tarjeta;
};

const pintarCursosComprados = () => {
  const cursos = obtenerCursosComprados();

  if (!misCursosGrid || !misCursosVacio) {
    return;
  }

  misCursosGrid.innerHTML = '';

  if (cursos.length === 0) {
    ocultarElemento(misCursosGrid);
    mostrarElemento(misCursosVacio);

    if (misCursosConteo) {
      misCursosConteo.textContent = 'No hay cursos comprados todavía.';
    }

    return;
  }

  cursos.forEach((curso) => {
    misCursosGrid.appendChild(crearTarjetaCursoComprado(curso));
  });

  ocultarElemento(misCursosVacio);
  mostrarGrid(misCursosGrid);

  if (misCursosConteo) {
    misCursosConteo.textContent = cursos.length === 1 ? '1 curso registrado.' : `${cursos.length} cursos registrados.`;
  }
};

document.addEventListener('DOMContentLoaded', pintarCursosComprados);
