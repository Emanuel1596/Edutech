(() => {
  const estado = {
    curso: null,
    modo: 'publica',
    lecciones: [],
    indiceLeccionActual: 0,
    examen: null,
    examenCargado: false
  };

  const elementos = {
    titulo: document.getElementById('previewTitulo'),
    descripcion: document.getElementById('previewDescripcion'),
    mensaje: document.getElementById('previewMensaje'),
    modoPublica: document.getElementById('previewModoPublica'),
    modoAula: document.getElementById('previewModoAula'),
    modoExamen: document.getElementById('previewModoExamen'),
    seccionPublica: document.getElementById('previewPublica'),
    seccionAula: document.getElementById('previewAula'),
    seccionExamen: document.getElementById('previewExamen'),
    metaPublica: document.getElementById('previewMetaPublica'),
    descripcionLarga: document.getElementById('previewDescripcionLarga'),
    instructor: document.getElementById('previewInstructor'),
    portada: document.getElementById('previewPortada'),
    precio: document.getElementById('previewPrecio'),
    contenidoPublico: document.getElementById('previewContenidoPublico'),
    aulaTitulo: document.getElementById('previewAulaTitulo'),
    aulaDescripcion: document.getElementById('previewAulaDescripcion'),
    aulaConteo: document.getElementById('previewAulaConteo'),
    aulaMenu: document.getElementById('previewAulaMenu'),
    leccionModulo: document.getElementById('previewLeccionModulo'),
    leccionTitulo: document.getElementById('previewLeccionTitulo'),
    leccionDuracion: document.getElementById('previewLeccionDuracion'),
    videoBox: document.getElementById('previewVideoBox'),
    leccionTexto: document.getElementById('previewLeccionTexto'),
    leccionRecursos: document.getElementById('previewLeccionRecursos'),
    leccionAnterior: document.getElementById('previewLeccionAnterior'),
    leccionSiguiente: document.getElementById('previewLeccionSiguiente'),
    examenTitulo: document.getElementById('previewExamenTitulo'),
    examenDescripcion: document.getElementById('previewExamenDescripcion'),
    examenMeta: document.getElementById('previewExamenMeta'),
    examenForm: document.getElementById('previewExamenForm'),
    examenRevisar: document.getElementById('previewExamenRevisar'),
    examenLimpiar: document.getElementById('previewExamenLimpiar'),
    examenResultado: document.getElementById('previewExamenResultado'),
    examenActions: document.getElementById('previewExamenActions')
  };

  const params = new URLSearchParams(window.location.search);
  const idCurso = Number(params.get('idCurso') || 0);

  const escaparHtml = (valor) => String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const formatearDinero = (valor) => Number(valor || 0).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
  });

  const minutosDesdeSegundos = (segundos) => {
    const numero = Number(segundos || 0);

    if (!numero) {
      return 0;
    }

    return Math.max(1, Math.round(numero / 60));
  };

  const obtenerNombreCompletoInstructor = (curso) => [
    curso.instructor_nombre,
    curso.instructor_apellido_paterno,
    curso.instructor_apellido_materno
  ].filter(Boolean).join(' ') || curso.instructor_correo || 'Instructor';

  const mostrarMensaje = (texto, esError = false) => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = texto;
    elementos.mensaje.classList.toggle('is-error', esError);
    elementos.mensaje.style.display = 'block';
  };

  const validarAdmin = () => {
    const usuario = window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function'
      ? window.EduTech.obtenerUsuarioSesion()
      : null;

    if (!usuario) {
      window.location.replace('login.html');
      return null;
    }

    if (!window.EduTech.usuarioTieneRol(usuario, 'Administrador')) {
      window.location.replace(window.EduTech.obtenerRutaInicioPorRol(usuario));
      return null;
    }

    if (window.EduTechSessionGuard && typeof window.EduTechSessionGuard.mostrar === 'function') {
      window.EduTechSessionGuard.mostrar();
    } else if (typeof window.EduTechMarcarPaginaLista === 'function') {
      window.EduTechMarcarPaginaLista();
    }

    return usuario;
  };

  const obtenerUrlEmbed = (url) => {
    const texto = String(url || '').trim();

    if (!texto) {
      return '';
    }

    const youtubeWatch = texto.match(/[?&]v=([^&]+)/);
    const youtubeShort = texto.match(/youtu\.be\/([^?&/]+)/);
    const vimeo = texto.match(/vimeo\.com\/(\d+)/);

    if (youtubeWatch) {
      return `https://www.youtube.com/embed/${encodeURIComponent(youtubeWatch[1])}`;
    }

    if (youtubeShort) {
      return `https://www.youtube.com/embed/${encodeURIComponent(youtubeShort[1])}`;
    }

    if (vimeo) {
      return `https://player.vimeo.com/video/${encodeURIComponent(vimeo[1])}`;
    }

    return texto;
  };

  const prepararLecciones = (curso) => {
    estado.lecciones = [];

    (curso.modulos || []).forEach((modulo) => {
      (modulo.lecciones || []).forEach((leccion) => {
        estado.lecciones.push({
          ...leccion,
          modulo_titulo: modulo.titulo,
          modulo_numero: modulo.numero_orden
        });
      });
    });
  };

  const pintarPublica = () => {
    const curso = estado.curso;

    elementos.metaPublica.innerHTML = `
      <p>Dificultad: <strong>${escaparHtml(curso.nombre_nivel || 'Sin nivel')}</strong></p>
      <p>Categorías: <strong>${escaparHtml((curso.categorias || []).join(', ') || 'Sin categorías')}</strong></p>
      <p>Lecciones: <strong>${escaparHtml(curso.total_lecciones || 0)}</strong></p>
      <p>Precio: <strong>${formatearDinero(curso.precio_mxn)}</strong></p>
    `;

    elementos.descripcionLarga.textContent = curso.descripcion || 'Sin descripción.';
    elementos.precio.textContent = `${formatearDinero(curso.precio_mxn)} MXN`.replace('MXN MXN', 'MXN');

    if (curso.imagen_portada) {
      elementos.portada.src = curso.imagen_portada;
      elementos.portada.alt = `Portada de ${curso.titulo}`;
    } else {
      elementos.portada.removeAttribute('src');
      elementos.portada.alt = 'Curso sin portada';
    }

    elementos.instructor.innerHTML = `
      <div class="preview-instructor-avatar">${escaparHtml(obtenerNombreCompletoInstructor(curso).charAt(0).toUpperCase())}</div>
      <div>
        <strong>${escaparHtml(obtenerNombreCompletoInstructor(curso))}</strong>
        <p>${escaparHtml(curso.instructor_correo || 'Sin correo')}</p>
      </div>
    `;

    elementos.contenidoPublico.innerHTML = (curso.modulos || []).map((modulo) => `
      <article class="preview-public-module">
        <h3>${escaparHtml(modulo.titulo)}</h3>
        ${(modulo.lecciones || []).map((leccion) => `
          <div class="preview-public-lesson">
            <span>✓</span>
            <p>${escaparHtml(leccion.titulo)}</p>
            <small>${escaparHtml(leccion.numero_orden)} de ${escaparHtml((modulo.lecciones || []).length)}</small>
          </div>
        `).join('')}
      </article>
    `).join('');
  };

  const pintarMenuAula = () => {
    elementos.aulaMenu.innerHTML = (estado.curso.modulos || []).map((modulo) => `
      <section class="preview-sidebar-module">
        <h4>${escaparHtml(modulo.titulo)}</h4>
        ${(modulo.lecciones || []).map((leccion) => {
          const indiceGlobal = estado.lecciones.findIndex((item) => Number(item.id_leccion) === Number(leccion.id_leccion));
          const activo = indiceGlobal === estado.indiceLeccionActual;

          return `
            <button type="button" class="preview-sidebar-lesson ${activo ? 'active' : ''}" data-indice="${indiceGlobal}">
              <span></span>
              ${escaparHtml(leccion.titulo)}
            </button>
          `;
        }).join('')}
      </section>
    `).join('');
  };

  const pintarLeccionActual = () => {
    const leccion = estado.lecciones[estado.indiceLeccionActual];

    if (!leccion) {
      elementos.leccionTitulo.textContent = 'Sin lecciones';
      elementos.videoBox.innerHTML = '<p>Este curso todavía no tiene lecciones.</p>';
      elementos.leccionTexto.textContent = '';
      elementos.leccionRecursos.innerHTML = '<p>Sin recursos.</p>';
      return;
    }

    elementos.leccionModulo.textContent = leccion.modulo_titulo || 'Módulo';
    elementos.leccionTitulo.textContent = leccion.titulo || 'Lección';
    elementos.leccionDuracion.textContent = `Tiempo estimado: ${minutosDesdeSegundos(leccion.duracion_segundos)} minutos`;
    elementos.leccionTexto.textContent = leccion.texto_descriptivo || 'Sin contenido descriptivo.';

    const tipoVideo = String(leccion.nombre_tipo_video || '').toLowerCase();
    const urlVideo = leccion.url_video || '';

    if (tipoVideo === 'local' || /^assets\/videos\//i.test(urlVideo)) {
      elementos.videoBox.innerHTML = `
        <video controls>
          <source src="${escaparHtml(urlVideo)}">
          Tu navegador no puede reproducir este video.
        </video>
      `;
    } else {
      elementos.videoBox.innerHTML = `
        <iframe
          src="${escaparHtml(obtenerUrlEmbed(urlVideo))}"
          title="${escaparHtml(leccion.titulo)}"
          allowfullscreen>
        </iframe>
      `;
    }

    const recursos = Array.isArray(leccion.recursos) ? leccion.recursos : [];

    if (recursos.length === 0) {
      elementos.leccionRecursos.innerHTML = '<p>Sin recursos adicionales.</p>';
    } else {
      elementos.leccionRecursos.innerHTML = recursos.map((recurso) => `
        <a class="preview-resource-item" href="${escaparHtml(recurso.url_recurso)}" target="_blank" rel="noopener">
          <strong>${escaparHtml(recurso.titulo)}</strong>
          <span>${escaparHtml(recurso.descripcion || 'Recurso de la lección')}</span>
        </a>
      `).join('');
    }

    elementos.leccionAnterior.disabled = estado.indiceLeccionActual === 0;
    elementos.leccionSiguiente.disabled = estado.indiceLeccionActual >= estado.lecciones.length - 1;
    pintarMenuAula();
  };

  const pintarAula = () => {
    elementos.aulaTitulo.textContent = estado.curso.titulo;
    elementos.aulaDescripcion.textContent = estado.curso.descripcion || '';
    elementos.aulaConteo.textContent = `0 de ${estado.lecciones.length} lecciones completadas`;
    pintarMenuAula();
    pintarLeccionActual();
  };


  const pintarExamenSinDatos = (texto = 'Este curso todavía no tiene examen configurado.') => {
    if (elementos.examenTitulo) {
      elementos.examenTitulo.textContent = 'Examen final';
    }

    if (elementos.examenDescripcion) {
      elementos.examenDescripcion.textContent = 'Revisión del examen sin límite de tiempo y sin guardar calificación.';
    }

    if (elementos.examenMeta) {
      elementos.examenMeta.innerHTML = '';
    }

    if (elementos.examenForm) {
      elementos.examenForm.innerHTML = `<p class="preview-exam-empty">${escaparHtml(texto)}</p>`;
    }

    if (elementos.examenResultado) {
      elementos.examenResultado.style.display = 'none';
      elementos.examenResultado.textContent = '';
    }

    if (elementos.examenActions) {
      elementos.examenActions.hidden = true;
    }
  };

  const pintarExamen = () => {
    const examen = estado.examen;

    if (!examen) {
      pintarExamenSinDatos();
      return;
    }

    const preguntas = Array.isArray(examen.preguntas) ? examen.preguntas : [];

    elementos.examenTitulo.textContent = examen.titulo || 'Examen final';
    elementos.examenDescripcion.textContent = examen.descripcion || 'Revisión del examen sin límite de tiempo y sin guardar calificación.';

    elementos.examenMeta.innerHTML = `
      <span>Preguntas configuradas: ${escaparHtml(preguntas.length)}</span>
      <span>Calificación mínima original: ${escaparHtml(examen.calificacion_minima || 0)}%</span>
      <span>Tiempo original del alumno: ${escaparHtml(examen.tiempo_limite_minutos || 0)} min</span>
      <span>Intentos originales del alumno: ${escaparHtml(examen.max_intentos || 0)}</span>
    `;

    if (preguntas.length === 0) {
      pintarExamenSinDatos('El examen existe, pero todavía no tiene preguntas activas.');
      return;
    }

    if (elementos.examenActions) {
      elementos.examenActions.hidden = false;
    }

    elementos.examenForm.innerHTML = preguntas.map((pregunta, indice) => `
      <article class="preview-exam-question" data-id-pregunta="${pregunta.id_pregunta}">
        <h3>Pregunta ${indice + 1}</h3>
        <p>${escaparHtml(pregunta.texto_pregunta)}</p>
        <div class="preview-exam-options">
          ${(pregunta.opciones || []).map((opcion) => `
            <label class="preview-exam-option">
              <input
                type="radio"
                name="preview_pregunta_${pregunta.id_pregunta}"
                value="${opcion.id_opcion}"
                data-correcta="${opcion.es_correcta ? 'true' : 'false'}">
              <span>${escaparHtml(opcion.texto_opcion)}</span>
            </label>
          `).join('')}
        </div>
        <small class="preview-exam-feedback"></small>
      </article>
    `).join('');

    elementos.examenResultado.style.display = 'none';
    elementos.examenResultado.textContent = '';
  };

  const cargarExamenPreview = async () => {
    if (estado.examenCargado) {
      pintarExamen();
      return;
    }

    const usuario = validarAdmin();

    if (!usuario) {
      return;
    }

    try {
      pintarExamenSinDatos('Cargando examen...');
      const datos = await window.EduTech.apiRequest(`/admin/cursos/${encodeURIComponent(idCurso)}/examen-preview?idAdmin=${encodeURIComponent(usuario.id_usuario)}`);
      estado.examen = datos.examen || null;
      estado.examenCargado = true;
      pintarExamen();
    } catch (error) {
      estado.examenCargado = true;
      estado.examen = null;
      pintarExamenSinDatos(error.message || 'No se pudo cargar el examen.');
    }
  };

  const revisarExamenPreview = () => {
    const preguntas = Array.from(elementos.examenForm.querySelectorAll('.preview-exam-question'));

    if (preguntas.length === 0) {
      return;
    }

    let respondidas = 0;
    let correctas = 0;

    preguntas.forEach((pregunta) => {
      const seleccionada = pregunta.querySelector('input[type="radio"]:checked');
      const feedback = pregunta.querySelector('.preview-exam-feedback');

      pregunta.classList.remove('is-correct', 'is-wrong', 'is-empty');

      if (!seleccionada) {
        pregunta.classList.add('is-empty');

        if (feedback) {
          feedback.textContent = 'Sin respuesta en esta vista previa.';
        }

        return;
      }

      respondidas += 1;

      if (seleccionada.dataset.correcta === 'true') {
        correctas += 1;
        pregunta.classList.add('is-correct');

        if (feedback) {
          feedback.textContent = 'Correcta.';
        }
      } else {
        pregunta.classList.add('is-wrong');
        const correcta = pregunta.querySelector('input[data-correcta="true"]');
        const textoCorrecto = correcta ? correcta.closest('label')?.querySelector('span')?.textContent : 'No configurada';

        if (feedback) {
          feedback.textContent = `Incorrecta. Respuesta correcta: ${textoCorrecto}`;
        }
      }
    });

    const total = preguntas.length;
    const porcentaje = total ? Math.round((correctas / total) * 100) : 0;

    elementos.examenResultado.textContent = `Vista previa: ${correctas} de ${total} correctas (${porcentaje}%). Respondidas: ${respondidas}. No se guardó calificación.`;
    elementos.examenResultado.style.display = 'block';
  };

  const limpiarExamenPreview = () => {
    if (!elementos.examenForm) {
      return;
    }

    elementos.examenForm.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = false;
    });

    elementos.examenForm.querySelectorAll('.preview-exam-question').forEach((pregunta) => {
      pregunta.classList.remove('is-correct', 'is-wrong', 'is-empty');
    });

    elementos.examenForm.querySelectorAll('.preview-exam-feedback').forEach((feedback) => {
      feedback.textContent = '';
    });

    if (elementos.examenResultado) {
      elementos.examenResultado.style.display = 'none';
      elementos.examenResultado.textContent = '';
    }
  };

  const cambiarModo = (modo) => {
    estado.modo = ['aula', 'examen'].includes(modo) ? modo : 'publica';

    elementos.seccionPublica.hidden = estado.modo !== 'publica';
    elementos.seccionAula.hidden = estado.modo !== 'aula';
    elementos.seccionExamen.hidden = estado.modo !== 'examen';

    elementos.seccionPublica.classList.toggle('active', estado.modo === 'publica');
    elementos.seccionAula.classList.toggle('active', estado.modo === 'aula');
    elementos.seccionExamen.classList.toggle('active', estado.modo === 'examen');
    elementos.modoPublica.classList.toggle('active', estado.modo === 'publica');
    elementos.modoAula.classList.toggle('active', estado.modo === 'aula');
    elementos.modoExamen.classList.toggle('active', estado.modo === 'examen');

    if (estado.modo === 'examen') {
      cargarExamenPreview();
    }

    const url = new URL(window.location.href);
    url.searchParams.set('modo', estado.modo);
    window.history.replaceState({}, '', url.toString());
  };

  const pintarCurso = () => {
    const curso = estado.curso;

    elementos.titulo.textContent = curso.titulo;
    elementos.descripcion.textContent = curso.descripcion || 'Sin descripción.';

    prepararLecciones(curso);
    pintarPublica();
    pintarAula();
    cambiarModo(['aula', 'examen'].includes(params.get('modo')) ? params.get('modo') : 'publica');
  };

  const cargarCurso = async () => {
    const usuario = validarAdmin();

    if (!usuario) {
      return;
    }

    if (!idCurso) {
      mostrarMensaje('No se recibió el curso a revisar.', true);
      return;
    }

    try {
      const datos = await window.EduTech.apiRequest(`/admin/cursos/${encodeURIComponent(idCurso)}/preview?idAdmin=${encodeURIComponent(usuario.id_usuario)}`);
      estado.curso = datos.curso;
      pintarCurso();
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo cargar la vista previa del curso.', true);
    }
  };

  const configurarEventos = () => {
    elementos.modoPublica.addEventListener('click', () => cambiarModo('publica'));
    elementos.modoAula.addEventListener('click', () => cambiarModo('aula'));
    elementos.modoExamen.addEventListener('click', () => cambiarModo('examen'));

    elementos.examenRevisar.addEventListener('click', revisarExamenPreview);
    elementos.examenLimpiar.addEventListener('click', limpiarExamenPreview);

    elementos.leccionAnterior.addEventListener('click', () => {
      if (estado.indiceLeccionActual > 0) {
        estado.indiceLeccionActual -= 1;
        pintarLeccionActual();
      }
    });

    elementos.leccionSiguiente.addEventListener('click', () => {
      if (estado.indiceLeccionActual < estado.lecciones.length - 1) {
        estado.indiceLeccionActual += 1;
        pintarLeccionActual();
      }
    });

    elementos.aulaMenu.addEventListener('click', (evento) => {
      const boton = evento.target.closest('.preview-sidebar-lesson');

      if (!boton) {
        return;
      }

      estado.indiceLeccionActual = Number(boton.dataset.indice || 0);
      pintarLeccionActual();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    configurarEventos();
    cargarCurso();
  });
})();
