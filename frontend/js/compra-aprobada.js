const compraResultado = document.getElementById('compraResultado');
const compraSinDatos = document.getElementById('compraSinDatos');
const compraMensaje = document.getElementById('compraMensaje');
const compraCurso = document.getElementById('compraCurso');
const compraInstructor = document.getElementById('compraInstructor');
const compraCorreo = document.getElementById('compraCorreo');
const compraTotal = document.getElementById('compraTotal');
const compraEstatus = document.getElementById('compraEstatus');
const btnMisCursos = document.getElementById('btnMisCursos');

const mostrarElemento = (elemento) => {
  if (elemento) {
    elemento.style.setProperty('display', 'block', 'important');
  }
};

const ocultarElemento = (elemento) => {
  if (elemento) {
    elemento.style.setProperty('display', 'none', 'important');
  }
};

const obtenerCompraPendiente = () => {
  const compraGuardada = sessionStorage.getItem('edutech_compra_pendiente');

  if (!compraGuardada) {
    return null;
  }

  try {
    return JSON.parse(compraGuardada);
  } catch (error) {
    return null;
  }
};

const obtenerIdUrl = () => {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('id');
};

const guardarCursoEnMisCursos = (compra) => {
  if (!compra || !compra.id_curso) {
    return;
  }

  const cursosGuardados = localStorage.getItem('edutech_mis_cursos');
  let cursos = [];

  if (cursosGuardados) {
    try {
      cursos = JSON.parse(cursosGuardados);
    } catch (error) {
      cursos = [];
    }
  }

  const existe = cursos.some((curso) => String(curso.id_curso) === String(compra.id_curso));

  if (!existe) {
    cursos.push({
      id_curso: compra.id_curso,
      curso: compra.curso,
      instructor: compra.instructor,
      precio: compra.precio,
      total: compra.total,
      fecha_compra: new Date().toISOString(),
      estatus: 'Aprobada'
    });
  }

  localStorage.setItem('edutech_mis_cursos', JSON.stringify(cursos));
};

const pintarCompra = (compra) => {
  if (compraCurso) {
    compraCurso.textContent = compra.curso || 'Curso EduTech';
  }

  if (compraInstructor) {
    compraInstructor.textContent = compra.instructor || 'Instructor EduTech';
  }

  if (compraCorreo) {
    compraCorreo.textContent = compra.correo || 'Por definir';
  }

  if (compraTotal) {
    compraTotal.textContent = compra.total || compra.precio || '$0 MXN';
  }

  if (compraEstatus) {
    compraEstatus.textContent = 'Aprobada';
  }

  if (compraMensaje) {
    compraMensaje.textContent = `Gracias por tu compra${compra.nombre ? `, ${compra.nombre}` : ''}. El curso quedó registrado correctamente.`;
  }

  if (btnMisCursos && compra.id_curso) {
    btnMisCursos.href = `mis-cursos.html?id=${compra.id_curso}`;
  }

  document.title = `Compra aprobada - ${compra.curso || 'EduTech'}`;
};

const cargarConfirmacionCompra = () => {
  ocultarElemento(compraResultado);
  ocultarElemento(compraSinDatos);

  const compra = obtenerCompraPendiente();
  const idUrl = obtenerIdUrl();

  if (!compra || !compra.id_curso) {
    mostrarElemento(compraSinDatos);
    return;
  }

  if (idUrl && String(idUrl) !== String(compra.id_curso)) {
    mostrarElemento(compraSinDatos);
    return;
  }

  guardarCursoEnMisCursos(compra);
  pintarCompra(compra);
  mostrarElemento(compraResultado);
};

document.addEventListener('DOMContentLoaded', cargarConfirmacionCompra);
