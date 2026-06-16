const compraResultado = document.getElementById('compraResultado');
const compraSinDatos = document.getElementById('compraSinDatos');
const compraMensaje = document.getElementById('compraMensaje');
const compraOrden = document.getElementById('compraOrden');
const compraCurso = document.getElementById('compraCurso');
const compraInstructor = document.getElementById('compraInstructor');
const compraCorreo = document.getElementById('compraCorreo');
const compraTotal = document.getElementById('compraTotal');
const compraEstatus = document.getElementById('compraEstatus');
const compraFecha = document.getElementById('compraFecha');
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

const leerJsonStorage = (storage, clave) => {
  const valor = storage.getItem(clave);

  if (!valor) {
    return null;
  }

  try {
    return JSON.parse(valor);
  } catch (error) {
    return null;
  }
};

const obtenerCompraAprobada = () => {
  const compraSesion = leerJsonStorage(sessionStorage, 'edutech_compra_pendiente');

  if (compraSesion && (compraSesion.id_curso || (Array.isArray(compraSesion.cursos) && compraSesion.cursos.length > 0))) {
    return compraSesion;
  }

  const compraLocal = leerJsonStorage(localStorage, 'edutech_compra_aprobada_backend');

  if (compraLocal && (compraLocal.id_curso || (Array.isArray(compraLocal.cursos) && compraLocal.cursos.length > 0))) {
    return compraLocal;
  }

  return null;
};

const obtenerIdUrl = () => {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get('id');

  if (id && Number(id) > 0) {
    return id;
  }

  return null;
};

const esFechaValida = (fecha) => {
  if (!fecha) {
    return false;
  }

  const fechaObjeto = new Date(fecha);
  return !Number.isNaN(fechaObjeto.getTime());
};

const obtenerFechaCompra = (compra) => {
  const fecha = compra && (
    compra.fecha_compra ||
    compra.fecha_pago ||
    compra.fecha_inscripcion ||
    compra.fecha_orden ||
    compra.fecha_creacion ||
    compra.fecha
  );

  return esFechaValida(fecha) ? fecha : new Date().toISOString();
};

const formatearFecha = (fecha) => {
  const fechaFinal = esFechaValida(fecha) ? fecha : new Date().toISOString();
  const fechaObjeto = new Date(fechaFinal);

  return fechaObjeto.toLocaleString('es-MX');
};

const obtenerMapaFechasCompra = () => {
  const valor = leerJsonStorage(localStorage, 'edutech_fechas_compra_cursos');
  return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
};

const guardarFechaCompraCurso = (compra) => {
  if (!compra || (!compra.id_curso && (!Array.isArray(compra.cursos) || compra.cursos.length === 0))) {
    return;
  }

  const mapa = obtenerMapaFechasCompra();
  mapa[String(compra.id_curso)] = obtenerFechaCompra(compra);
  localStorage.setItem('edutech_fechas_compra_cursos', JSON.stringify(mapa));
};


const obtenerCursosCompra = (compra) => {
  if (!compra) {
    return [];
  }

  if (Array.isArray(compra.cursos) && compra.cursos.length > 0) {
    return compra.cursos.map((curso) => ({
      id_curso: curso.id_curso || curso.idCurso || curso.id,
      curso: curso.curso || curso.titulo || 'Curso EduTech',
      titulo: curso.titulo || curso.curso || 'Curso EduTech',
      instructor: curso.instructor || compra.instructor || 'Instructor EduTech',
      nivel: curso.nivel || curso.nombre_nivel || compra.nivel || compra.nombre_nivel || 'Curso disponible',
      nombre_nivel: curso.nombre_nivel || curso.nivel || compra.nombre_nivel || compra.nivel || '',
      precio: curso.precio || curso.precio_mxn || compra.precio || '$0 MXN',
      id_inscripcion: curso.id_inscripcion || curso.idInscripcion || null
    })).filter((curso) => curso.id_curso);
  }

  if (compra.id_curso) {
    return [{
      id_curso: compra.id_curso,
      curso: compra.curso || 'Curso EduTech',
      titulo: compra.curso || 'Curso EduTech',
      instructor: compra.instructor || 'Instructor EduTech',
      nivel: compra.nivel || compra.nombre_nivel || 'Curso disponible',
      nombre_nivel: compra.nombre_nivel || compra.nivel || '',
      precio: compra.precio || compra.total || '$0 MXN',
      id_inscripcion: compra.id_inscripcion || compra.idInscripcion || null
    }];
  }

  return [];
};

const guardarFechasCursosCompra = (compra) => {
  const cursos = obtenerCursosCompra(compra);
  const mapa = obtenerMapaFechasCompra();
  const fecha = obtenerFechaCompra(compra);

  cursos.forEach((curso) => {
    mapa[String(curso.id_curso)] = fecha;
  });

  localStorage.setItem('edutech_fechas_compra_cursos', JSON.stringify(mapa));
};

const obtenerListaMisCursos = () => {
  const cursosGuardados = localStorage.getItem('edutech_mis_cursos');

  if (!cursosGuardados) {
    return [];
  }

  try {
    const cursos = JSON.parse(cursosGuardados);
    return Array.isArray(cursos) ? cursos : [];
  } catch (error) {
    return [];
  }
};

const guardarCursoEnMisCursos = (compra) => {
  const cursosCompra = obtenerCursosCompra(compra);

  if (cursosCompra.length === 0) {
    return;
  }

  const cursos = obtenerListaMisCursos();
  const fechaCompra = obtenerFechaCompra(compra);

  cursosCompra.forEach((cursoCompra) => {
    const idCurso = String(cursoCompra.id_curso);
    const existe = cursos.some((curso) => String(curso.id_curso) === idCurso);
    const cursoActualizado = {
      id_curso: cursoCompra.id_curso,
      curso: cursoCompra.curso || cursoCompra.titulo || 'Curso EduTech',
      instructor: cursoCompra.instructor || compra.instructor || 'Instructor EduTech',
      nivel: cursoCompra.nivel || cursoCompra.nombre_nivel || compra.nivel || compra.nombre_nivel || 'Curso disponible',
      nombre_nivel: cursoCompra.nombre_nivel || cursoCompra.nivel || compra.nombre_nivel || compra.nivel || '',
      total_lecciones: cursoCompra.total_lecciones || compra.total_lecciones || 0,
      precio: cursoCompra.precio || compra.precio || compra.total || '$0 MXN',
      total: compra.total || cursoCompra.precio || '$0 MXN',
      id_orden: compra.id_orden || null,
      numero_orden: compra.numero_orden || null,
      id_pago: compra.id_pago || null,
      id_inscripcion: cursoCompra.id_inscripcion || compra.id_inscripcion || compra.idInscripcion || null,
      correo: compra.correo || '',
      fecha_compra: fechaCompra,
      fecha_inscripcion: compra.fecha_inscripcion || fechaCompra,
      fecha_pago: compra.fecha_pago || fechaCompra,
      estatus: 'Aprobada'
    };

    if (!existe) {
      cursos.push(cursoActualizado);
    } else {
      const indice = cursos.findIndex((curso) => String(curso.id_curso) === idCurso);
      cursos[indice] = {
        ...cursos[indice],
        ...cursoActualizado,
        fecha_compra: cursoActualizado.fecha_compra || cursos[indice].fecha_compra,
        fecha_inscripcion: cursoActualizado.fecha_inscripcion || cursos[indice].fecha_inscripcion
      };
    }
  });

  localStorage.setItem('edutech_mis_cursos', JSON.stringify(cursos));
  localStorage.setItem('edutech_cursos_comprados_ids', JSON.stringify(cursos.map((curso) => Number(curso.id_curso)).filter((id) => Number.isInteger(id) && id > 0)));
  guardarFechasCursosCompra(compra);
};

const guardarCompraConfirmada = (compra) => {
  if (!compra || (!compra.id_curso && obtenerCursosCompra(compra).length === 0)) {
    return;
  }

  const compraConfirmada = {
    ...compra,
    estatus: 'Aprobada',
    fecha_compra: obtenerFechaCompra(compra),
    fecha_inscripcion: compra.fecha_inscripcion || obtenerFechaCompra(compra),
    fecha_pago: compra.fecha_pago || obtenerFechaCompra(compra)
  };

  localStorage.setItem('edutech_compra_aprobada_backend', JSON.stringify(compraConfirmada));
};

const pintarCompra = (compra) => {
  const cursosCompra = obtenerCursosCompra(compra);
  const esCompraMultiple = cursosCompra.length > 1;
  const curso = esCompraMultiple ? `${cursosCompra.length} cursos comprados` : (compra.curso || (cursosCompra[0] && cursosCompra[0].curso) || 'Curso EduTech');
  const nombre = compra.nombre ? `, ${compra.nombre}` : '';
  const orden = compra.numero_orden || (compra.id_orden ? `Orden #${compra.id_orden}` : 'Por confirmar');
  const total = compra.total || compra.precio || '$0 MXN';
  const fecha = obtenerFechaCompra(compra);

  if (compraOrden) {
    compraOrden.textContent = orden;
  }

  if (compraCurso) {
    compraCurso.textContent = curso;

    if (esCompraMultiple) {
      const lista = document.createElement('span');
      lista.className = 'purchase-confirmation-course-list';
      lista.textContent = cursosCompra.map((item) => item.curso || item.titulo || 'Curso EduTech').join(', ');
      compraCurso.appendChild(document.createElement('br'));
      compraCurso.appendChild(lista);
    }
  }

  if (compraInstructor) {
    const filaInstructor = compraInstructor.closest('.purchase-confirmation-row');
    if (esCompraMultiple) {
      if (filaInstructor) {
        filaInstructor.style.display = 'none';
      }
    } else {
      if (filaInstructor) {
        filaInstructor.style.display = '';
      }
      compraInstructor.textContent = compra.instructor || (cursosCompra[0] && cursosCompra[0].instructor) || 'Instructor EduTech';
    }
  }

  if (compraCorreo) {
    compraCorreo.textContent = compra.correo || 'Por definir';
  }

  if (compraTotal) {
    compraTotal.textContent = total;
  }

  if (compraEstatus) {
    compraEstatus.textContent = compra.estatus || 'Aprobada';
  }

  if (compraFecha) {
    compraFecha.textContent = formatearFecha(fecha);
  }

  if (compraMensaje) {
    compraMensaje.textContent = esCompraMultiple
      ? `Gracias por tu compra${nombre}. El pago fue aprobado y los ${cursosCompra.length} cursos quedaron registrados correctamente.`
      : `Gracias por tu compra${nombre}. El pago fue aprobado y el curso "${curso}" quedó registrado correctamente.`;
  }

  if (btnMisCursos) {
    btnMisCursos.href = compra.id_curso && !esCompraMultiple ? `mis-cursos.html?id=${compra.id_curso}` : 'mis-cursos.html';
  }

  document.title = `Compra aprobada - ${curso}`;
};

const compraCoincideConUrl = (compra) => {
  const idUrl = obtenerIdUrl();

  if (!idUrl) {
    return true;
  }

  const idsCompra = obtenerCursosCompra(compra).map((curso) => String(curso.id_curso));
  return String(compra.id_curso) === String(idUrl) || idsCompra.includes(String(idUrl));
};

const marcarPaginaLista = () => {
  if (window.EduTechMarcarPaginaLista) {
    window.EduTechMarcarPaginaLista();
  }
};

const cargarConfirmacionCompra = () => {
  ocultarElemento(compraResultado);
  ocultarElemento(compraSinDatos);

  const compra = obtenerCompraAprobada();

  if (!compra || (!compra.id_curso && obtenerCursosCompra(compra).length === 0) || !compraCoincideConUrl(compra)) {
    mostrarElemento(compraSinDatos);
    marcarPaginaLista();
    return;
  }

  guardarCompraConfirmada(compra);
  guardarFechasCursosCompra(compra);
  guardarCursoEnMisCursos(compra);
  pintarCompra(compra);
  mostrarElemento(compraResultado);
  marcarPaginaLista();
};

document.addEventListener('DOMContentLoaded', cargarConfirmacionCompra);
