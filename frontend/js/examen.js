const marcarPaginaExamenLista = () => {
  if (window.EduTechMarcarPaginaLista) {
    window.EduTechMarcarPaginaLista();
  }
};

const qs = (selector) => document.querySelector(selector);
const byId = (id) => document.getElementById(id);

const examenMensaje = byId('examenMensaje');
const examenLeccion = byId('examenLeccion');
const examenIntro = byId('examenIntro');
const examenCuestionario = byId('examenCuestionario');
const examenResultado = byId('examenResultado');
const examenTitulo = byId('examenTitulo');
const examenPreguntaTituloCurso = byId('examenPreguntaTituloCurso');
const examenTiempo = byId('examenTiempo');
const examenMinima = byId('examenMinima');
const examenIntentos = byId('examenIntentos');
const examenPreguntasCantidad = byId('examenPreguntasCantidad');
const examenIniciar = byId('examenIniciar');
const examenAnterior = byId('examenAnterior');
const examenSiguiente = byId('examenSiguiente');
const examenEnviar = byId('examenEnviar');
const examenPreguntaActual = byId('examenPreguntaActual');
const examenBarraProgreso = byId('examenBarraProgreso');
const examenTemporizador = byId('examenTemporizador');
const formExamen = byId('formExamen');
const examenVolverLeccion = byId('examenVolverLeccion');
const examenIntentosBox = byId('examenIntentosBox');
const examenIntentosSelect = byId('examenIntentosSelect');
const llmsStartQuiz = byId('llms_start_quiz');

const examenLeccionTitulo = byId('examenLeccionTitulo');
const examenAutor = byId('examenAutor');
const examenVolverCursoLeccion = byId('examenVolverCursoLeccion');
const examenVolverCursoInferior = byId('examenVolverCursoInferior');
const examenCursoInferior = byId('examenCursoInferior');
const examenLeccionTiempo = byId('examenLeccionTiempo');
const examenLeccionIntentos = byId('examenLeccionIntentos');
const examenLeccionMinima = byId('examenLeccionMinima');
const examenTextoIntroUno = byId('examenTextoIntroUno');
const examenTextoIntroDos = byId('examenTextoIntroDos');
const examenSyllabus = byId('examenSyllabus');
const examenProgresoNumero = byId('examenProgresoNumero');
const examenProgresoBarra = byId('examenProgresoBarra');
const examenLeccionAnteriorLink = byId('examenLeccionAnteriorLink');
const examenLeccionAnteriorTexto = byId('examenLeccionAnteriorTexto');

let examenActual = null;
let idCursoActual = null;
let idUsuarioActual = null;
let indicePreguntaActual = 0;
let respuestasSeleccionadas = {};
let segundosRestantes = 0;
let temporizadorIntervalo = null;

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

const escaparHtml = (valor) => String(valor || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const obtenerParametroIdCurso = () => {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get('id') || parametros.get('idCurso') || sessionStorage.getItem('edutech_curso_detalle_id');
  return id && Number(id) > 0 ? String(id) : null;
};

const obtenerParametroQuiz = () => {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('quiz') === '1' || parametros.get('vista') === 'quiz';
};

const obtenerParametroIdInscripcion = () => {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get('idInscripcion') || parametros.get('id_inscripcion') || sessionStorage.getItem('edutech_id_inscripcion_actual');
  return id && Number(id) > 0 ? String(id) : null;
};

const obtenerUrlRegresoCurso = () => {
  const idCurso = idCursoActual || obtenerParametroIdCurso() || '';
  const idInscripcion = obtenerParametroIdInscripcion();

  if (idInscripcion) {
    const parametros = new URLSearchParams();
    parametros.set('idInscripcion', String(idInscripcion));

    if (idCurso) {
      parametros.set('idCurso', String(idCurso));
    }

    return `aula.html?${parametros.toString()}`;
  }

  return `detalle-curso.html?id=${idCurso}`;
};

const obtenerParametroResultado = () => {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('resultado') === '1' || parametros.get('vista') === 'resultado';
};

const obtenerUsuario = () => {
  if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
    return window.EduTech.obtenerUsuarioSesion();
  }

  try {
    return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
  } catch (error) {
    return null;
  }
};

const obtenerIdUsuario = () => {
  if (window.EduTech && typeof window.EduTech.obtenerIdUsuarioSesion === 'function') {
    return window.EduTech.obtenerIdUsuarioSesion();
  }

  const usuario = obtenerUsuario();
  return localStorage.getItem('edutech_id_usuario') || (usuario && (usuario.id_usuario || usuario.id));
};

const obtenerNombreUsuario = () => {
  const usuario = obtenerUsuario();
  return (usuario && (usuario.nombre || usuario.name || usuario.email)) || 'Alumno';
};

const obtenerCursoLocal = () => {
  const claves = ['edutech_mis_cursos', 'edutech_catalogo_cursos'];

  for (const clave of claves) {
    try {
      const cursos = JSON.parse(localStorage.getItem(clave) || '[]');

      if (!Array.isArray(cursos)) {
        continue;
      }

      const curso = cursos.find((item) => String(item.id_curso || item.idCurso || item.id) === String(idCursoActual));

      if (curso) {
        return curso;
      }
    } catch (error) {
      // El respaldo local no debe detener la pantalla.
    }
  }

  return null;
};

const mostrarMensaje = (mensaje, esError = false) => {
  if (!examenMensaje) {
    return;
  }

  examenMensaje.textContent = mensaje;
  examenMensaje.style.display = 'block';
  examenMensaje.style.color = esError ? '#ff5c5c' : '#19d37d';
};

const ocultarMensaje = () => {
  if (!examenMensaje) {
    return;
  }

  examenMensaje.textContent = '';
  examenMensaje.style.display = 'none';
};

const mostrar = (elemento, display = 'block') => {
  if (elemento) {
    elemento.style.display = display;
  }
};

const ocultar = (elemento) => {
  if (elemento) {
    elemento.style.display = 'none';
  }
};

const mostrarSoloVista = (vista) => {
  [examenLeccion, examenIntro, examenCuestionario, examenResultado].forEach(ocultar);
  mostrar(vista);
};

const formatearFecha = (fecha) => {
  if (!fecha) {
    return 'Fecha no disponible';
  }

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return 'Fecha no disponible';
  }

  return valor.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatearTiempoLargo = (segundos) => {
  const total = Math.max(0, Number(segundos) || 0);
  const minutos = Math.floor(total / 60);
  const restante = total % 60;

  if (minutos <= 0) {
    return `${restante} segundos`;
  }

  if (restante === 0) {
    return `${minutos} minutos`;
  }

  return `${minutos} minutos, ${restante} segundos`;
};

const obtenerTiempoUsadoSegundos = () => {
  const limite = Math.max(0, obtenerTiempoMinutos() * 60);

  if (limite <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(limite, limite - Math.max(0, segundosRestantes)));
};

const obtenerResultadosLocales = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem('edutech_resultados_examenes') || '[]');
    return Array.isArray(guardados) ? guardados : [];
  } catch (error) {
    return [];
  }
};

const obtenerHistorialResultadosLocales = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem('edutech_resultados_examenes_historial') || '[]');
    return Array.isArray(guardados) ? guardados : [];
  } catch (error) {
    return [];
  }
};

const obtenerResultadoLocalCurso = () => {
  const resultados = obtenerResultadosLocales();
  const directo = resultados.find((item) => String(item.id_curso) === String(idCursoActual));

  if (directo) {
    return directo;
  }

  const historial = obtenerHistorialResultadosLocales()
    .filter((item) => String(item.id_curso) === String(idCursoActual))
    .sort((a, b) => Number(b.numero_intento || 0) - Number(a.numero_intento || 0));

  return historial[0] || null;
};

const guardarResultadoLocal = (resultado) => {
  if (!resultado || !resultado.id_curso) {
    return;
  }

  const normalizado = {
    ...resultado,
    id_curso: Number(resultado.id_curso),
    calificacion: Number(resultado.calificacion || 0),
    aprobado: resultado.aprobado === true || resultado.aprobado === 'true',
    fecha_fin: resultado.fecha_fin || new Date().toISOString()
  };

  let resultados = obtenerResultadosLocales();
  const indice = resultados.findIndex((item) => String(item.id_curso) === String(normalizado.id_curso));

  if (indice >= 0) {
    resultados[indice] = normalizado;
  } else {
    resultados.push(normalizado);
  }

  let historial = obtenerHistorialResultadosLocales();
  const indiceHistorial = historial.findIndex((item) => {
    return String(item.id_curso) === String(normalizado.id_curso)
      && String(item.id_intento || item.numero_intento || '') === String(normalizado.id_intento || normalizado.numero_intento || '');
  });

  if (indiceHistorial >= 0) {
    historial[indiceHistorial] = normalizado;
  } else {
    historial.push(normalizado);
  }

  localStorage.setItem('edutech_resultados_examenes', JSON.stringify(resultados));
  localStorage.setItem('edutech_resultados_examenes_historial', JSON.stringify(historial));

  if (normalizado.aprobado && normalizado.certificado) {
    const certificados = JSON.parse(localStorage.getItem('edutech_certificados') || '[]');
    const lista = Array.isArray(certificados) ? certificados : [];
    const certificadoLocal = {
      ...normalizado.certificado,
      id_curso: normalizado.id_curso,
      titulo_curso: normalizado.titulo_curso || normalizado.curso || 'Curso EduTech',
      fecha_emision: normalizado.certificado.fecha_emision || normalizado.fecha_fin,
      fecha_aprobacion: normalizado.fecha_fin,
      calificacion: normalizado.calificacion
    };
    const clave = certificadoLocal.id_certificado
      ? String(certificadoLocal.id_certificado)
      : String(certificadoLocal.codigo_certificado || certificadoLocal.id_inscripcion || normalizado.id_curso);
    const indiceCertificado = lista.findIndex((item) => {
      const claveItem = item.id_certificado
        ? String(item.id_certificado)
        : String(item.codigo_certificado || item.id_inscripcion || item.id_curso);
      return claveItem === clave;
    });

    if (indiceCertificado >= 0) {
      lista[indiceCertificado] = certificadoLocal;
    } else {
      lista.push(certificadoLocal);
    }

    localStorage.setItem('edutech_certificados', JSON.stringify(lista));
  }
};

const actualizarProgresoLocalExamen = (resultado) => {
  if (!resultado || !(resultado.aprobado === true || resultado.aprobado === 'true')) {
    return;
  }

  try {
    const cursos = JSON.parse(localStorage.getItem('edutech_mis_cursos') || '[]');

    if (!Array.isArray(cursos)) {
      return;
    }

    const indice = cursos.findIndex((curso) => String(curso.id_curso || curso.id) === String(resultado.id_curso));

    if (indice < 0) {
      return;
    }

    cursos[indice].porcentaje_avance = 100;
    cursos[indice].lecciones_completadas = cursos[indice].total_lecciones || cursos[indice].lecciones_completadas || 0;
    localStorage.setItem('edutech_mis_cursos', JSON.stringify(cursos));
  } catch (error) {
    // El respaldo local no debe romper el examen.
  }
};

const obtenerPreguntas = () => Array.isArray(examenActual && examenActual.preguntas) ? examenActual.preguntas : [];

const obtenerTituloCurso = () => {
  const cursoLocal = obtenerCursoLocal();
  return (examenActual && (examenActual.titulo_curso || examenActual.curso)) ||
    (cursoLocal && (cursoLocal.titulo || cursoLocal.nombre_curso || cursoLocal.nombre)) ||
    'Curso';
};

const obtenerTituloExamen = () => {
  const tituloCurso = obtenerTituloCurso();
  return `Examen Final – ${tituloCurso}`;
};

const obtenerMinima = () => `${Number((examenActual && examenActual.calificacion_minima) || 0).toFixed(0)}%`;
const obtenerIntentos = () => Number((examenActual && (examenActual.intentos_restantes ?? examenActual.max_intentos)) || 0);
const obtenerTiempoMinutos = () => Number((examenActual && examenActual.tiempo_limite_minutos) || 0);


const puedePresentarExamen = () => {
  if (!examenActual) {
    return false;
  }

  if (examenActual.puede_presentar === false || examenActual.puede_presentar === 'false') {
    return false;
  }

  const intentosDisponibles = Number(
    examenActual.intentos_restantes
      ?? examenActual.intentos_disponibles
      ?? examenActual.max_intentos
      ?? 1
  );

  return Number.isNaN(intentosDisponibles) || intentosDisponibles > 0;
};

const obtenerValorCampo = (objeto, claves = []) => {
  if (!objeto || typeof objeto !== 'object') {
    return '';
  }

  for (const clave of claves) {
    if (objeto[clave] !== undefined && objeto[clave] !== null && String(objeto[clave]).trim() !== '') {
      return String(objeto[clave]).trim();
    }
  }

  return '';
};

const esUrlImagen = (valor) => /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(String(valor || '').trim());

const separarTextoImagen = (texto) => {
  const original = String(texto || '').trim();
  const resultado = {
    texto: original,
    imagen: ''
  };

  if (!original) {
    return resultado;
  }

  const markdown = original.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (markdown) {
    resultado.imagen = markdown[1].trim();
    resultado.texto = original.replace(markdown[0], '').trim();
    return resultado;
  }

  const etiquetaImagen = original.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (etiquetaImagen) {
    resultado.imagen = etiquetaImagen[1].trim();
    resultado.texto = original.replace(etiquetaImagen[0], '').trim();
    return resultado;
  }

  const url = original.match(/https?:\/\/[^\s"')]+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s"')]+)?/i);
  if (url) {
    resultado.imagen = url[0].trim();
    resultado.texto = original.replace(url[0], '').trim();
    return resultado;
  }

  if (esUrlImagen(original)) {
    resultado.imagen = original;
    resultado.texto = '';
  }

  return resultado;
};

const crearImagenPregunta = (src, alt = '') => {
  if (!src) {
    return null;
  }

  const figura = crearElemento('figure', 'tdc-question-media');
  const imagen = document.createElement('img');
  imagen.src = src;
  imagen.alt = alt || 'Imagen de la pregunta';
  imagen.loading = 'lazy';
  imagen.decoding = 'async';
  figura.appendChild(imagen);
  return figura;
};

const pintarIntentosPrevios = (intentos = []) => {
  if (!examenIntentosBox || !examenIntentosSelect) {
    return;
  }

  examenIntentosSelect.innerHTML = '<option value="">-- Seleccione un intento --</option>';

  if (!Array.isArray(intentos) || intentos.length === 0) {
    ocultar(examenIntentosBox);
    return;
  }

  intentos.forEach((intento) => {
    const opcion = document.createElement('option');
    const numero = intento.numero_intento || intento.id_intento || 1;
    const calificacion = Number(intento.calificacion || 0).toFixed(0);
    const estado = intento.aprobado ? '¡Aprobado!' : (intento.id_estado_intento ? 'Incompleto' : 'No aprobado');
    opcion.value = String(intento.id_intento || intento.numero_intento || '');
    opcion.textContent = `Intento # ${numero} - ${calificacion}% ( ${estado} )`;
    examenIntentosSelect.appendChild(opcion);
  });

  mostrar(examenIntentosBox);
};


const pintarEstadoBotonLeccion = () => {
  if (!llmsStartQuiz) {
    return;
  }

  let aviso = document.getElementById('examenAvisoIntentosMaximos');

  if (!aviso && llmsStartQuiz.parentElement) {
    aviso = crearElemento('p', 'tdc-attempt-limit-message');
    aviso.id = 'examenAvisoIntentosMaximos';
    llmsStartQuiz.parentElement.appendChild(aviso);
  }

  if (!puedePresentarExamen()) {
    llmsStartQuiz.disabled = true;
    llmsStartQuiz.textContent = 'Máximo de intentos alcanzado';
    llmsStartQuiz.classList.add('tdc-main-button-disabled');

    if (aviso) {
      aviso.textContent = 'Ya alcanzaste el máximo de intentos disponibles. Revisa tu calificación en Mi cuenta > Mis calificaciones.';
      aviso.style.display = 'block';
    }

    return;
  }

  llmsStartQuiz.disabled = false;
  llmsStartQuiz.textContent = 'Realizar cuestionario';
  llmsStartQuiz.classList.remove('tdc-main-button-disabled');

  if (aviso) {
    aviso.textContent = '';
    aviso.style.display = 'none';
  }
};

const pintarSyllabus = () => {
  if (!examenSyllabus) {
    return;
  }

  const cursoLocal = obtenerCursoLocal();
  const modulos = Array.isArray(cursoLocal && cursoLocal.modulos) ? cursoLocal.modulos : [];
  examenSyllabus.innerHTML = '';

  if (modulos.length === 0) {
    examenSyllabus.innerHTML = `
      <li class="llms-section llms-section--opened">
        <div class="section-header"><span class="llms-collapse-caret"><i class="fa fa-caret-down"></i><i class="fa fa-caret-right"></i></span><span class="section-title">Examen Final</span></div>
        <ul class="llms-lesson current-lesson"><li><span class="llms-lesson-complete"><i class="fa fa-check-circle"></i></span><span class="lesson-title"><a href="#">Examen Final</a></span></li></ul>
      </li>
      <li class="llms-section llms-syllabus-footer"><a class="llms-button-text" href="#">Abrir todo</a><span> · </span><a class="llms-button-text" href="#">Cerrar todo</a></li>
    `;
    return;
  }

  modulos.forEach((modulo) => {
    const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];
    const esModuloExamen = String(modulo.titulo || '').toLowerCase().includes('examen final');
    const li = crearElemento('li', `llms-section ${esModuloExamen ? 'llms-section--opened' : 'llms-section--closed'}`);
    li.innerHTML = `
      <div class="section-header">
        <span class="llms-collapse-caret"><i class="fa fa-caret-down"></i><i class="fa fa-caret-right"></i></span>
        <span class="section-title">${escaparHtml(modulo.titulo || 'Módulo')}</span>
      </div>
    `;

    lecciones.forEach((leccion) => {
      const titulo = leccion.titulo || 'Lección';
      const esExamen = String(titulo).toLowerCase().includes('examen final') || esModuloExamen;
      const completada = leccion.completada === true || leccion.esta_completada === true || leccion.completada === 'true';
      const ul = crearElemento('ul', `llms-lesson ${esExamen ? 'current-lesson' : ''}`.trim());
      ul.innerHTML = `
        <li>
          <span class="llms-lesson-complete ${completada ? 'done' : ''}"><i class="fa fa-check-circle"></i></span>
          <span class="lesson-title ${completada ? 'done' : ''}"><a href="#">${escaparHtml(titulo)}</a></span>
        </li>
      `;
      li.appendChild(ul);
    });

    examenSyllabus.appendChild(li);
  });

  const footer = crearElemento('li', 'llms-section llms-syllabus-footer');
  footer.innerHTML = '<a class="llms-button-text" href="#">Abrir todo</a><span> · </span><a class="llms-button-text" href="#">Cerrar todo</a>';
  examenSyllabus.appendChild(footer);
};

const pintarProgresoLateral = () => {
  const cursoLocal = obtenerCursoLocal();
  const avance = Number((cursoLocal && (cursoLocal.porcentaje_avance || cursoLocal.avance)) || 3.7);
  const porcentaje = Number.isFinite(avance) ? Math.max(0, Math.min(100, avance)) : 3.7;
  const texto = `${porcentaje % 1 === 0 ? porcentaje.toFixed(0) : porcentaje.toFixed(1)}%`;

  if (examenProgresoNumero) {
    examenProgresoNumero.textContent = texto;
  }

  if (examenProgresoBarra) {
    examenProgresoBarra.style.width = texto;
  }
};

const pintarLeccion = (examen) => {
  examenActual = examen;
  const tituloCurso = obtenerTituloCurso();
  const idCurso = idCursoActual || '';
  const tiempo = obtenerTiempoMinutos();
  const intentos = Number((examen && examen.max_intentos) || obtenerIntentos() || 2);

  document.title = 'Examen Final - EduTech';

  if (examenLeccionTitulo) {
    examenLeccionTitulo.textContent = 'Examen Final';
  }

  if (examenAutor) {
    examenAutor.textContent = (examen && (examen.nombre_instructor || examen.instructor)) || 'Instructor EduTech';
  }

  if (examenVolverCursoLeccion) {
    examenVolverCursoLeccion.textContent = tituloCurso;
    examenVolverCursoLeccion.href = obtenerUrlRegresoCurso();
  }

  if (examenVolverCursoInferior) {
    examenVolverCursoInferior.href = obtenerUrlRegresoCurso();
  }

  if (examenCursoInferior) {
    examenCursoInferior.textContent = 'Volver al curso';
  }

  if (examenLeccionAnteriorLink) {
    examenLeccionAnteriorLink.href = obtenerUrlRegresoCurso();
  }

  if (examenLeccionAnteriorTexto) {
    examenLeccionAnteriorTexto.textContent = 'Lección anterior';
  }

  if (examenLeccionTiempo) {
    examenLeccionTiempo.textContent = `${tiempo || 30} minutos`;
  }

  if (examenLeccionIntentos) {
    examenLeccionIntentos.textContent = `${intentos || 2} intentos`;
  }

  if (examenLeccionMinima) {
    examenLeccionMinima.textContent = `${obtenerMinima()} de respuestas correctas`;
  }

  if (examenTextoIntroUno) {
    examenTextoIntroUno.innerHTML = `¡Estamos llegando al final del curso! Con lo que aprendimos vas a poder tener un manejo básico de <strong>${escaparHtml(tituloCurso)}</strong> para realizar tus primeras actividades completas. No te olvides que, para seguir aprendiendo, te recomendamos repasar todas las lecciones del curso.`;
  }

  if (examenTextoIntroDos) {
    examenTextoIntroDos.textContent = 'Fue un largo camino, de mucho esfuerzo y práctica pero llegamos finalmente al examen final. Para rendirlo y obtener el correspondiente certificado tenés que tener en cuenta lo siguiente:';
  }

  pintarSyllabus();
  pintarProgresoLateral();
  pintarIntentosPrevios(examen.intentos || []);
  pintarEstadoBotonLeccion();
  ocultarMensaje();
  mostrarSoloVista(examenLeccion);
};

const pintarIntroCuestionario = () => {
  if (!examenActual) {
    return;
  }

  const preguntas = obtenerPreguntas();
  const titulo = obtenerTituloExamen();

  document.title = `${titulo} - EduTech`;

  if (examenTitulo) {
    examenTitulo.textContent = titulo;
  }

  if (examenPreguntaTituloCurso) {
    examenPreguntaTituloCurso.textContent = titulo;
  }

  if (examenTiempo) {
    examenTiempo.textContent = `${obtenerTiempoMinutos() || 0} minutos`;
  }

  if (examenMinima) {
    examenMinima.textContent = obtenerMinima();
  }

  if (examenIntentos) {
    examenIntentos.textContent = String(obtenerIntentos());
  }

  if (examenPreguntasCantidad) {
    examenPreguntasCantidad.textContent = String(preguntas.length || (examenActual.cantidad_preguntas || 0));
  }

  if (examenVolverLeccion) {
    examenVolverLeccion.href = `examen.html?id=${idCursoActual}`;
  }

  pintarIntentosPrevios(examenActual.intentos || []);

  if (!puedePresentarExamen()) {
    if (examenIniciar) {
      examenIniciar.disabled = true;
      examenIniciar.textContent = 'Máximo de intentos alcanzado';
      examenIniciar.classList.add('tdc-main-button-disabled');
    }
    mostrarMensaje('Ya alcanzaste el máximo de intentos disponibles. Revisa tu calificación en Mi cuenta > Mis calificaciones.', false);
  } else if (examenIniciar) {
    examenIniciar.disabled = false;
    examenIniciar.textContent = 'Empezar cuestionario';
    examenIniciar.classList.remove('tdc-main-button-disabled');
  }

  mostrarSoloVista(examenIntro);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const navegarAIntroCuestionario = (evento) => {
  if (evento) {
    evento.preventDefault();
  }

  if (!examenActual) {
    mostrarMensaje('No se pudo cargar la información del examen.', true);
    return;
  }

  if (!puedePresentarExamen()) {
    pintarEstadoBotonLeccion();
    mostrarMensaje('Ya alcanzaste el máximo de intentos disponibles. Revisa tu calificación en Mi cuenta > Mis calificaciones.', false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const parametros = new URLSearchParams(window.location.search);
  parametros.set('id', String(idCursoActual || obtenerParametroIdCurso() || ''));
  parametros.set('vista', 'quiz');
  window.history.pushState({ edutechVistaExamen: 'quiz' }, '', `${window.location.pathname}?${parametros.toString()}`);

  empezarCuestionario({ forzarInicioVisual: true });
};

const manejarRegresoNavegadorExamen = () => {
  if (!examenActual) {
    return;
  }

  detenerTemporizador();

  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get('vista') === 'quiz') {
    empezarCuestionario({ forzarInicioVisual: true });
    return;
  }

  pintarLeccion(examenActual);
};

const formatearTiempo = (segundos) => {
  const total = Math.max(0, segundos);
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const restante = total % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(restante).padStart(2, '0')}`;
};

const detenerTemporizador = () => {
  if (temporizadorIntervalo) {
    clearInterval(temporizadorIntervalo);
    temporizadorIntervalo = null;
  }
};

const iniciarTemporizador = () => {
  detenerTemporizador();
  segundosRestantes = Math.max(1, obtenerTiempoMinutos() * 60);

  if (examenTemporizador) {
    examenTemporizador.innerHTML = `<i class="far fa-clock" aria-hidden="true"></i> ${formatearTiempo(segundosRestantes)}`;
  }

  temporizadorIntervalo = setInterval(() => {
    segundosRestantes -= 1;

    if (examenTemporizador) {
      examenTemporizador.innerHTML = `<i class="far fa-clock" aria-hidden="true"></i> ${formatearTiempo(Math.max(0, segundosRestantes))}`;
    }

    if (segundosRestantes <= 0) {
      detenerTemporizador();
      enviarExamenAutomaticoPorTiempo();
    }
  }, 1000);
};

const guardarSeleccionPreguntaActual = () => {
  const pregunta = obtenerPreguntas()[indicePreguntaActual];

  if (!pregunta) {
    return;
  }

  const seleccionado = document.querySelector(`input[name="pregunta_${pregunta.id_pregunta}"]:checked`);

  if (seleccionado) {
    respuestasSeleccionadas[String(pregunta.id_pregunta)] = Number(seleccionado.value);
  }
};

const separarPreguntaYCodigo = (texto) => {
  const original = String(texto || '').trim();

  if (!original) {
    return { pregunta: 'Pregunta', codigo: '' };
  }

  if (original.includes('```')) {
    const partes = original.split('```');
    return { pregunta: partes[0].trim(), codigo: (partes[1] || '').replace(/^\w+\n/, '').trim() };
  }

  if (original.includes('\n')) {
    const lineas = original.split('\n');
    const posiblesCodigo = lineas.slice(1).join('\n').trim();

    if (posiblesCodigo && /[{}();=]|for\s*\(|if\s*\(|SELECT|INSERT|UPDATE|DELETE/i.test(posiblesCodigo)) {
      return { pregunta: lineas[0].trim(), codigo: posiblesCodigo };
    }
  }

  return { pregunta: original, codigo: '' };
};

const pintarPreguntaActual = () => {
  const preguntas = obtenerPreguntas();
  const pregunta = preguntas[indicePreguntaActual];

  if (!pregunta || !examenPreguntaActual) {
    return;
  }

  const numero = indicePreguntaActual + 1;
  const total = preguntas.length;
  const opciones = Array.isArray(pregunta.opciones) ? pregunta.opciones : [];
  const respuestaGuardada = respuestasSeleccionadas[String(pregunta.id_pregunta)];
  const textoPregunta = pregunta.texto_pregunta || pregunta.pregunta || `Pregunta ${numero}`;
  const preguntaConImagen = separarTextoImagen(textoPregunta);
  const contenido = separarPreguntaYCodigo(preguntaConImagen.texto || textoPregunta);
  const imagenPregunta = obtenerValorCampo(pregunta, ['imagen_url', 'url_imagen', 'imagen', 'archivo_imagen', 'ruta_imagen']) || preguntaConImagen.imagen;

  examenPreguntaActual.innerHTML = '';

  const titulo = crearElemento('h2', 'llms-question-text tdc-question-title', contenido.pregunta);
  examenPreguntaActual.appendChild(titulo);

  if (contenido.codigo) {
    const pre = crearElemento('pre', 'tdc-code-block');
    const code = crearElemento('code', null, contenido.codigo);
    pre.appendChild(code);
    examenPreguntaActual.appendChild(pre);
  }

  const figuraPregunta = crearImagenPregunta(imagenPregunta, contenido.pregunta);
  if (figuraPregunta) {
    examenPreguntaActual.appendChild(figuraPregunta);
  }

  const opcionesContenedor = crearElemento('div', 'llms-question-choices tdc-question-choices');
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  opciones.forEach((opcion, index) => {
    const etiqueta = document.createElement('label');
    etiqueta.className = 'llms-choice tdc-choice-row';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `pregunta_${pregunta.id_pregunta}`;
    input.value = String(opcion.id_opcion);
    input.checked = String(respuestaGuardada || '') === String(opcion.id_opcion);

    if (input.checked) {
      etiqueta.classList.add('tdc-choice-selected');
    }

    const letra = crearElemento('span', 'tdc-choice-letter', letras[index] || String(index + 1));
    const opcionConImagen = separarTextoImagen(opcion.texto_opcion || opcion.opcion || 'Opción');
    const texto = crearElemento('span', 'tdc-choice-text', opcionConImagen.texto || '');
    const imagenOpcion = obtenerValorCampo(opcion, ['imagen_url', 'url_imagen', 'imagen', 'archivo_imagen', 'ruta_imagen']) || opcionConImagen.imagen;

    if (imagenOpcion) {
      const figuraOpcion = crearImagenPregunta(imagenOpcion, opcionConImagen.texto || `Opción ${letras[index] || index + 1}`);
      figuraOpcion.classList.add('tdc-choice-media');
      texto.appendChild(figuraOpcion);
    }

    input.addEventListener('change', () => {
      opcionesContenedor.querySelectorAll('.tdc-choice-row').forEach((fila) => fila.classList.remove('tdc-choice-selected'));
      etiqueta.classList.add('tdc-choice-selected');
      respuestasSeleccionadas[String(pregunta.id_pregunta)] = Number(input.value);
    });

    etiqueta.appendChild(input);
    etiqueta.appendChild(letra);
    etiqueta.appendChild(texto);
    opcionesContenedor.appendChild(etiqueta);
  });

  examenPreguntaActual.appendChild(opcionesContenedor);

  const contador = crearElemento('div', 'llms-question-count tdc-question-count', `${numero} / ${total}`);
  examenPreguntaActual.appendChild(contador);

  if (examenBarraProgreso) {
    examenBarraProgreso.style.width = `${(numero / Math.max(total, 1)) * 100}%`;
  }

  if (examenAnterior) {
    examenAnterior.disabled = indicePreguntaActual === 0;
    examenAnterior.style.setProperty('display', indicePreguntaActual === 0 ? 'none' : 'inline-flex', 'important');
  }

  if (examenSiguiente) {
    examenSiguiente.style.setProperty('display', indicePreguntaActual === total - 1 ? 'none' : 'inline-flex', 'important');
  }

  if (examenEnviar) {
    examenEnviar.textContent = 'Completar cuestionario';
    examenEnviar.style.setProperty('display', indicePreguntaActual === total - 1 ? 'inline-flex' : 'none', 'important');
  }
};

const empezarCuestionario = (opcionesInicio = {}) => {
  if (!examenActual) {
    mostrarMensaje('No se pudo cargar la información del examen.', true);
    return;
  }

  const forzarInicioVisual = opcionesInicio && opcionesInicio.forzarInicioVisual === true;

  if (!puedePresentarExamen()) {
    pintarEstadoBotonLeccion();
    mostrarMensaje('Ya alcanzaste el máximo de intentos disponibles. Revisa tu calificación en Mi cuenta > Mis calificaciones.', false);
    mostrarSoloVista(examenLeccion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const preguntas = obtenerPreguntas();

  if (preguntas.length === 0) {
    mostrarMensaje('Este examen no tiene preguntas activas. Carga el SQL de preguntas o revisa la ruta del backend.', true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  ocultarMensaje();

  if (examenPreguntaTituloCurso) {
    examenPreguntaTituloCurso.textContent = obtenerTituloExamen();
  }

  document.title = `${obtenerTituloExamen()} - EduTech`;

  indicePreguntaActual = 0;
  respuestasSeleccionadas = {};
  mostrarSoloVista(examenCuestionario);
  iniciarTemporizador();
  pintarPreguntaActual();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const preguntaSiguiente = () => {
  guardarSeleccionPreguntaActual();
  const preguntas = obtenerPreguntas();

  if (indicePreguntaActual < preguntas.length - 1) {
    indicePreguntaActual += 1;
    pintarPreguntaActual();
  }
};

const preguntaAnterior = () => {
  guardarSeleccionPreguntaActual();

  if (indicePreguntaActual > 0) {
    indicePreguntaActual -= 1;
    pintarPreguntaActual();
  }
};

const obtenerRespuestasFormulario = () => {
  guardarSeleccionPreguntaActual();

  return obtenerPreguntas().map((pregunta) => ({
    id_pregunta: pregunta.id_pregunta,
    id_opcion: respuestasSeleccionadas[String(pregunta.id_pregunta)] || null
  }));
};

const pintarMetaEvaluacionResultado = (intentosRestantes = null) => {
  const intentos = intentosRestantes === null ? obtenerIntentos() : intentosRestantes;
  const preguntas = obtenerPreguntas();
  return `
    <h2 class="llms-quiz-meta-title">Información de la Evaluación</h2>
    <ul class="llms-quiz-meta-info tdc-result-meta-bottom">
      <li class="llms-quiz-meta-item llms-passing-percent"><strong>Calificación mínima de aprobación:</strong> <span class="llms-pass-perc">${obtenerMinima()}</span></li>
      <li class="llms-quiz-meta-item llms-attempts"><strong>Otros intentos:</strong> <span class="llms-attempts">${intentos}</span></li>
      <li class="llms-quiz-meta-item llms-question-count"><strong>Preguntas:</strong> <span class="llms-question-count">${preguntas.length || (examenActual && examenActual.cantidad_preguntas) || 0}</span></li>
      <li class="llms-quiz-meta-item llms-time-limit"><strong>Límite de tiempo:</strong> <span class="llms-time-limit">${obtenerTiempoMinutos()} minutos</span></li>
    </ul>
  `;
};

const limpiarTextoResultado = (valor) => {
  const contenido = separarTextoImagen(String(valor || '')).texto || String(valor || '');
  return separarPreguntaYCodigo(contenido).pregunta || contenido || 'Pregunta';
};

const crearListaRespuestasResultado = (respuesta) => {
  const textoOpcion = respuesta.texto_opcion || respuesta.opcion || 'Sin respuesta';
  const partes = Array.isArray(textoOpcion) ? textoOpcion : String(textoOpcion).split('|').map((item) => item.trim()).filter(Boolean);
  const opciones = partes.length > 0 ? partes : [textoOpcion];

  return opciones.map((opcion) => {
    const opcionConImagen = separarTextoImagen(opcion);
    const texto = opcionConImagen.texto ? escaparHtml(opcionConImagen.texto) : '';
    const imagen = opcionConImagen.imagen
      ? `<figure class="tdc-result-answer-media"><img src="${escaparHtml(opcionConImagen.imagen)}" alt="${texto || 'Respuesta seleccionada'}" loading="lazy" decoding="async"></figure>`
      : '';
    return `<li class="llms-quiz-attempt-answer">${texto}${imagen}</li>`;
  }).join('');
};

const crearClaveIntentoResultado = (intento) => {
  if (!intento) {
    return '';
  }

  return String(intento.id_intento || intento.numero_intento || intento.fecha_fin || intento.fecha_inicio || '');
};

const obtenerHistorialIntentosResultado = (resultadoActual) => {
  const acumulado = [];
  const agregar = (intento) => {
    if (!intento) {
      return;
    }

    const idCursoIntento = intento.id_curso || resultadoActual.id_curso || idCursoActual;

    if (String(idCursoIntento) !== String(resultadoActual.id_curso || idCursoActual)) {
      return;
    }

    acumulado.push({
      ...intento,
      id_curso: idCursoIntento
    });
  };

  obtenerHistorialResultadosLocales().forEach(agregar);

  if (Array.isArray(examenActual && examenActual.intentos)) {
    examenActual.intentos.forEach(agregar);
  }

  if (Array.isArray(resultadoActual.intentos)) {
    resultadoActual.intentos.forEach(agregar);
  }

  agregar(resultadoActual);

  const mapa = new Map();

  acumulado.forEach((intento) => {
    const clave = crearClaveIntentoResultado(intento);

    if (!clave) {
      return;
    }

    const intentoActual = mapa.get(clave);
    const respuestasActuales = Array.isArray(intentoActual && intentoActual.respuestas) ? intentoActual.respuestas : [];
    const respuestasNuevas = Array.isArray(intento && intento.respuestas) ? intento.respuestas : [];

    if (intentoActual && respuestasActuales.length > 0 && respuestasNuevas.length === 0) {
      mapa.set(clave, {
        ...intento,
        ...intentoActual
      });
      return;
    }

    mapa.set(clave, intento);
  });

  return Array.from(mapa.values()).sort((a, b) => {
    const intentoA = Number(a.numero_intento || a.id_intento || 0);
    const intentoB = Number(b.numero_intento || b.id_intento || 0);

    if (intentoA !== intentoB) {
      return intentoA - intentoB;
    }

    return new Date(a.fecha_fin || a.fecha_inicio || 0).getTime() - new Date(b.fecha_fin || b.fecha_inicio || 0).getTime();
  });
};

const crearOpcionIntentoResultado = (intento, resultadoActual) => {
  const numero = intento.numero_intento || intento.id_intento || 1;
  const calificacion = Number(intento.calificacion || 0);
  const estado = intento.aprobado === true || intento.aprobado === 'true' ? '¡Aprobado!' : 'No aprobado';
  const seleccionado = crearClaveIntentoResultado(intento) === crearClaveIntentoResultado(resultadoActual) ? ' selected' : '';

  return `<option value="${escaparHtml(crearClaveIntentoResultado(intento))}"${seleccionado}>Intento # ${numero} - ${Math.max(0, Math.min(100, calificacion)).toFixed(0)}% ( ${estado} )</option>`;
};

const pintarResultado = (resultado) => {
  if (!examenResultado || !resultado) {
    return;
  }

  detenerTemporizador();
  guardarResultadoLocal(resultado);
  actualizarProgresoLocalExamen(resultado);

  const aprobado = resultado.aprobado === true || resultado.aprobado === 'true';
  const correctas = Number(resultado.respuestas_correctas || 0);
  const total = Number(resultado.total_preguntas || obtenerPreguntas().length || 0);
  const calificacion = Number(resultado.calificacion || 0);
  const calificacionSegura = Math.max(0, Math.min(100, Number.isNaN(calificacion) ? 0 : calificacion));
  const fecha = formatearFecha(resultado.fecha_fin || resultado.fecha_inicio);
  const duracion = resultado.tiempo_total_segundos ? formatearTiempoLargo(resultado.tiempo_total_segundos) : formatearTiempoLargo(obtenerTiempoUsadoSegundos());
  const respuestas = Array.isArray(resultado.respuestas) ? resultado.respuestas : [];
  const titulo = obtenerTituloExamen();
  const numeroIntento = resultado.numero_intento || 1;
  const intentosRestantes = Math.max(0, Number(resultado.intentos_restantes ?? (obtenerIntentos() - numeroIntento)));
  const estadoTexto = aprobado ? '¡Aprobado!' : 'No aprobado';
  const historialIntentos = obtenerHistorialIntentosResultado(resultado);

  const historial = `
    <section class="llms-quiz-results-history tdc-result-history">
      <h2 class="llms-quiz-results-title">Ver intentos anteriores</h2>
      <label for="llms-quiz-attempt-select-final" class="sr-only">Seleccione un intento</label>
      <select id="llms-quiz-attempt-select-final">
        <option value="">-- Seleccione un intento --</option>
        ${historialIntentos.map((intento) => crearOpcionIntentoResultado(intento, resultado)).join('')}
      </select>
    </section>
  `;

  const respuestasHtml = respuestas.length > 0 ? `
    <section class="llms-quiz-results-main tdc-results-list">
      <ol class="llms-quiz-attempt-results">
        ${respuestas.map((respuesta, indice) => {
          const esCorrecta = respuesta.es_correcta === true || respuesta.es_correcta === 'true';
          const textoPregunta = limpiarTextoResultado(respuesta.texto_pregunta || respuesta.pregunta || `Pregunta ${indice + 1}`);
          const puntos = esCorrecta ? '1 / 1 puntos' : '0 / 1 puntos';
          const tipoEstado = esCorrecta ? 'correct' : 'incorrect';
          const icono = esCorrecta ? 'fa-check' : 'fa-times';
          const etiqueta = esCorrecta ? 'Respuesta correcta' : 'Respuesta incorrecta';

          return `
            <li class="llms-quiz-attempt-question type--choice status--graded ${tipoEstado}" data-question-id="${escaparHtml(respuesta.id_pregunta || indice + 1)}" data-points="1" data-points-curr="${esCorrecta ? '1' : '0'}">
              <header class="llms-quiz-attempt-question-header">
                <button class="toggle-answer tdc-result-toggle" type="button" aria-expanded="false">
                  <h3 class="llms-question-title">${escaparHtml(textoPregunta)}</h3>
                  <span class="llms-points">${puntos}</span>
                  <span class="llms-status-icon-tip tip--top-left" data-tip="${etiqueta}"><i class="llms-status-icon fa ${icono}" aria-hidden="true"></i></span>
                </button>
              </header>
              <section class="llms-quiz-attempt-question-main">
                <div class="llms-quiz-attempt-answer-section llms-student-answer">
                  <p class="llms-quiz-results-label student-answer">Respuesta seleccionada</p>
                  <ul class="llms-quiz-attempt-answers">${crearListaRespuestasResultado(respuesta)}</ul>
                </div>
              </section>
            </li>
          `;
        }).join('')}
      </ol>
    </section>
  ` : `
    <section class="llms-quiz-results-main tdc-results-list tdc-results-empty">
      <p>No se recibieron los detalles de cada respuesta. Revisa que el backend esté actualizado con este ZIP.</p>
    </section>
  `;

  const botonIntento = intentosRestantes > 0
    ? `<div class="llms-quiz-buttons llms-button-wrapper tdc-result-buttons"><button type="button" class="llms-button-action button tdc-main-button" id="examenNuevoIntentoResultado">Empezar cuestionario</button></div>`
    : '';

  examenResultado.className = `tdc-view tdc-quiz-result-view ${aprobado ? 'tdc-result-approved' : 'tdc-result-failed'}`;
  examenResultado.innerHTML = `
    <div class="ast-container tdc-quiz-container tdc-result-container">
      <main class="site-main tdc-quiz-main">
        <article class="llms_quiz type-llms_quiz status-publish hentry ast-article-single tdc-quiz-article">
          <div class="entry-content clear">
            <div class="llms-quiz-wrapper tdc-result-wrapper" id="llms-quiz-wrapper-result">
              <div class="llms-quiz-results tdc-final-summary">
                <div class="tdc-result-grid">
                  <aside class="llms-quiz-results-aside tdc-result-aside">
                    <header class="entry-header tdc-entry-header tdc-result-entry-header">
                      <h1 class="entry-title">${escaparHtml(titulo)}</h1>
                    </header>
                    <div class="llms-return tdc-result-return"><a href="examen.html?id=${resultado.id_curso || idCursoActual}">Volver a la lección</a></div>
                    <h2 class="llms-quiz-results-title">Intento # ${numeroIntento} Resultados</h2>
                    <div class="llms-donut default ${aprobado ? 'passing' : 'failing'}" data-perc="${calificacionSegura.toFixed(0)}" style="--tdc-score:${calificacionSegura}%;">
                      <div class="inside">
                        <div class="percentage">${calificacionSegura.toFixed(0)}<small>%</small><div class="caption">${estadoTexto}</div></div>
                      </div>
                    </div>
                    <ul class="llms-quiz-meta-info tdc-result-meta-aside">
                      <li class="llms-quiz-meta-item"><strong>Respuestas correctas:</strong> <span>${correctas} / ${total}</span></li>
                      <li class="llms-quiz-meta-item"><strong>Completado:</strong> <span>${escaparHtml(fecha)}</span></li>
                      <li class="llms-quiz-meta-item"><strong>Tiempo total:</strong> <span>${escaparHtml(duracion)}</span></li>
                    </ul>
                    ${historial}
                    ${pintarMetaEvaluacionResultado(intentosRestantes)}
                    ${botonIntento}
                  </aside>
                  ${respuestasHtml}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  `;

  examenResultado.querySelectorAll('.tdc-result-toggle').forEach((boton) => {
    boton.addEventListener('click', () => {
      const item = boton.closest('.llms-quiz-attempt-question');
      const abierto = item.classList.toggle('tdc-result-open');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  });

  const selectIntentoFinal = byId('llms-quiz-attempt-select-final');
  if (selectIntentoFinal) {
    selectIntentoFinal.addEventListener('change', () => {
      const intentoSeleccionado = historialIntentos.find((intento) => crearClaveIntentoResultado(intento) === selectIntentoFinal.value);

      if (intentoSeleccionado) {
        pintarResultado(intentoSeleccionado);
      }
    });
  }

  const botonNuevoIntento = byId('examenNuevoIntentoResultado');
  if (botonNuevoIntento) {
    botonNuevoIntento.addEventListener('click', () => empezarCuestionario({ forzarInicioVisual: false }));
  }

  mostrarSoloVista(examenResultado);
  ocultarMensaje();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const enviarExamen = async (evento, permitirIncompleto = false) => {
  if (evento) {
    evento.preventDefault();
  }

  ocultarMensaje();
  const respuestas = obtenerRespuestasFormulario();
  const faltantes = respuestas.some((respuesta) => !respuesta.id_opcion);

  if (faltantes && !permitirIncompleto) {
    mostrarMensaje('Debes seleccionar una respuesta para continuar.', true);
    return;
  }

  if (examenEnviar) {
    examenEnviar.disabled = true;
    examenEnviar.textContent = 'Preparando nota final...';
  }

  try {
    const tiempoTotalSegundos = obtenerTiempoUsadoSegundos();
    const datos = await window.EduTech.apiRequest(`/usuarios/${idUsuarioActual}/cursos/${idCursoActual}/examen/responder`, {
      method: 'POST',
      body: {
        respuestas: respuestas.filter((respuesta) => respuesta.id_opcion),
        tiempo_total_segundos: tiempoTotalSegundos
      }
    });

    pintarResultado(datos.resultado);
  } catch (error) {
    const mensajeError = error && error.message ? error.message : 'No se pudo enviar el examen.';
    const esMaximoIntentos = /intentos disponibles|máximo de intentos|maximo de intentos/i.test(mensajeError);
    mostrarMensaje(esMaximoIntentos ? 'Máximo de intentos alcanzado. Revisa tu calificación en Mi cuenta > Mis calificaciones.' : mensajeError, true);

    if (esMaximoIntentos) {
      if (examenActual) {
        examenActual.puede_presentar = false;
        examenActual.intentos_restantes = 0;
      }
      pintarEstadoBotonLeccion();
    }

    if (examenEnviar) {
      examenEnviar.disabled = false;
      examenEnviar.textContent = 'Completar cuestionario';
    }
  }
};

const enviarExamenAutomaticoPorTiempo = () => {
  mostrarMensaje('El tiempo terminó. Se enviaron las respuestas registradas.', true);
  enviarExamen(null, true);
};

const cargarExamen = async () => {
  try {
    ocultarMensaje();
    [examenLeccion, examenIntro, examenCuestionario, examenResultado].forEach(ocultar);

    idCursoActual = obtenerParametroIdCurso();
    idUsuarioActual = obtenerIdUsuario();

    if (!idCursoActual) {
      mostrarMensaje('No se identificó el curso del examen.', true);
      return;
    }

    if (!idUsuarioActual) {
      if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
        window.EduTech.guardarRedirectDespuesLogin(`examen.html?id=${idCursoActual}`);
      }

      mostrarMensaje('Inicia sesión para presentar el examen.', true);
      window.setTimeout(() => {
        window.location.href = 'login.html';
      }, 900);
      return;
    }

    const datos = await window.EduTech.apiRequest(`/usuarios/${idUsuarioActual}/cursos/${idCursoActual}/examen`);
    const examen = datos.examen || null;

    if (!examen) {
      mostrarMensaje('No se encontró el examen final del curso.', true);
      return;
    }

    examenActual = examen;

    if (obtenerParametroResultado()) {
      const resultadoLocal = obtenerResultadoLocalCurso();

      try {
        const datosResultado = await window.EduTech.apiRequest(`/usuarios/${idUsuarioActual}/cursos/${idCursoActual}/examen/resultado`);
        const resultadoBackend = datosResultado && datosResultado.resultado;
        const respuestasBackend = Array.isArray(resultadoBackend && resultadoBackend.respuestas) ? resultadoBackend.respuestas : [];
        const respuestasLocales = Array.isArray(resultadoLocal && resultadoLocal.respuestas) ? resultadoLocal.respuestas : [];

        if (resultadoBackend && (respuestasBackend.length > 0 || respuestasLocales.length === 0)) {
          pintarResultado(resultadoBackend);
          return;
        }
      } catch (errorResultado) {
        // Si no se puede consultar, se usa el respaldo local.
      }

      if (resultadoLocal) {
        pintarResultado(resultadoLocal);
        return;
      }
    }

    if (obtenerParametroQuiz()) {
      empezarCuestionario({ forzarInicioVisual: true });
    } else {
      pintarLeccion(examen);
    }
  } catch (error) {
    mostrarMensaje(error && error.message ? error.message : 'No se pudo cargar el examen final.', true);
  } finally {
    marcarPaginaExamenLista();
  }
};

document.addEventListener('click', (evento) => {
  const botonInicio = evento.target.closest('#llms_start_quiz');

  if (botonInicio) {
    navegarAIntroCuestionario(evento);
  }
});

if (examenIniciar) {
  examenIniciar.addEventListener('click', () => empezarCuestionario({ forzarInicioVisual: true }));
}

if (examenSiguiente) {
  examenSiguiente.addEventListener('click', preguntaSiguiente);
}

if (examenAnterior) {
  examenAnterior.addEventListener('click', preguntaAnterior);
}

if (formExamen) {
  formExamen.addEventListener('submit', enviarExamen);
}

window.addEventListener('popstate', manejarRegresoNavegadorExamen);

document.addEventListener('DOMContentLoaded', cargarExamen);
