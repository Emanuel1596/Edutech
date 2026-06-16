(() => {
  const estado = {
    usuario: null,
    curso: null,
    examen: null
  };

  const elementos = {
    mensaje: document.getElementById('instructorExamenMensaje'),
    cursoId: document.getElementById('instructorExamenCursoId'),
    tituloCurso: document.getElementById('instructorExamenTituloCurso'),
    descripcionCurso: document.getElementById('instructorExamenDescripcionCurso'),
    form: document.getElementById('instructorExamenForm'),
    titulo: document.getElementById('instructorExamenTitulo'),
    descripcion: document.getElementById('instructorExamenDescripcion'),
    moduloTexto: document.getElementById('instructorExamenModuloTexto'),
    tiempo: document.getElementById('instructorExamenTiempo'),
    intentos: document.getElementById('instructorExamenIntentos'),
    intentosModo: document.getElementById('instructorExamenIntentosModo'),
    intentosWrap: document.getElementById('instructorIntentosWrap'),
    calificacion: document.getElementById('instructorExamenCalificacion'),
    cantidadPreguntas: document.getElementById('instructorCantidadPreguntas'),
    preguntasMostrar: document.getElementById('instructorPreguntasMostrar'),
    crearPreguntas: document.getElementById('instructorCrearPreguntas'),
    preguntasCampos: document.getElementById('instructorPreguntasCampos'),
    estadoFormulario: document.getElementById('instructorExamenEstado'),
    volverEditar: document.getElementById('instructorVolverEditar'),
    volverEditarSuperior: document.getElementById('volverEditarCurso'),
    eliminarBorrador: document.getElementById('instructorEliminarBorrador')
  };

  const params = new URLSearchParams(window.location.search);
  const idCurso = Number(params.get('idCurso') || 0);

  const contieneLetras = (valor) => /[a-záéíóúüñ]/i.test(String(valor || ''));

  const escaparHtml = (valor) => String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const obtenerUsuarioSesion = () => (
    window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function'
      ? window.EduTech.obtenerUsuarioSesion()
      : null
  );

  const usuarioPuedeEntrar = (usuario) => (
    window.EduTech
    && typeof window.EduTech.usuarioTieneRol === 'function'
    && window.EduTech.usuarioTieneRol(usuario, ['Instructor', 'Administrador'])
  );

  const obtenerIdInstructor = () => Number(estado.usuario?.id_usuario || estado.usuario?.id || 0);

  const mantenerPantallaOculta = () => {
    document.documentElement.classList.add('edutech-protected-loading');
    if (document.body) {
      document.body.classList.add('edutech-data-pending', 'edutech-data-loading');
      document.body.classList.remove('edutech-data-ready');
    }
  };

  const revelarPantallaProtegida = () => {
    document.documentElement.classList.remove('edutech-protected-loading', 'edutech-guard-pending');
    document.documentElement.classList.add('edutech-guard-allowed');

    if (document.body) {
      document.body.classList.add('edutech-data-ready');
      document.body.classList.remove('edutech-data-pending', 'edutech-data-loading');
    }

    if (typeof window.EduTechMarcarPaginaLista === 'function') {
      window.EduTechMarcarPaginaLista();
    }
  };

  const redirigirSinMostrarContenido = (mensaje = 'No puedes acceder a ese curso porque no pertenece a tu cuenta de instructor.') => {
    mantenerPantallaOculta();
    sessionStorage.setItem('edutech_mensaje_acceso', mensaje);
    window.location.replace('instructor.html#cursos');
  };

  const esErrorDeAccesoAlCurso = (error) => {
    const mensaje = String(error?.message || error?.error || '').toLowerCase();
    return mensaje.includes('curso no encontrado para este instructor')
      || mensaje.includes('instructor no encontrado')
      || mensaje.includes('solo está disponible para instructores')
      || mensaje.includes('solo esta disponible para instructores')
      || mensaje.includes('no tienes permisos');
  };

  const LIMITES_EXAMEN = {
    tiempoMinimo: 30,
    tiempoMaximo: 180,
    intentosMaximos: 10
  };

  const actualizarVistaIntentos = () => {
    const modo = elementos.intentosModo?.value || 'limitados';
    const esIlimitado = modo === 'ilimitados';

    if (elementos.intentosWrap) {
      elementos.intentosWrap.hidden = esIlimitado;
    }

    if (esIlimitado) {
      elementos.intentos.value = '0';
      limpiarErrorCampo(elementos.intentos);
    } else if (!String(elementos.intentos.value || '').trim() || Number(elementos.intentos.value) < 1 || Number(elementos.intentos.value) > LIMITES_EXAMEN.intentosMaximos) {
      elementos.intentos.value = '2';
      limpiarErrorCampo(elementos.intentos);
    }
  };


  const mostrarMensaje = (texto, esError = false) => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = texto;
    elementos.mensaje.classList.toggle('is-error', esError);
    elementos.mensaje.hidden = false;
  };

  const ocultarMensaje = () => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = '';
    elementos.mensaje.classList.remove('is-error');
    elementos.mensaje.hidden = true;
  };

  const mostrarEstadoFormulario = (texto) => {
    if (!elementos.estadoFormulario) {
      return;
    }

    elementos.estadoFormulario.textContent = texto;
    elementos.estadoFormulario.hidden = false;
  };

  const ocultarEstadoFormulario = () => {
    if (!elementos.estadoFormulario) {
      return;
    }

    elementos.estadoFormulario.textContent = '';
    elementos.estadoFormulario.hidden = true;
  };

  const limpiarErrores = () => {
    document.querySelectorAll('.error-message').forEach((error) => {
      error.textContent = '';
    });

    document.querySelectorAll('.field-error, .is-invalid').forEach((campo) => {
      campo.classList.remove('field-error', 'is-invalid');
    });

    document.querySelectorAll('.instructor-field.has-error').forEach((grupo) => {
      grupo.classList.remove('has-error');
    });
  };

  const mostrarErrorCampo = (campo, mensaje) => {
    if (!campo) {
      return;
    }

    campo.classList.add('field-error', 'is-invalid');

    const grupo = campo.closest('.instructor-field');
    if (grupo) {
      grupo.classList.add('has-error');
    }

    const error = document.querySelector(`[data-error-for="${campo.id}"]`);

    if (error) {
      error.textContent = mensaje;
    }
  };

  const enfocarPrimerError = () => {
    const campo = document.querySelector('.field-error');

    if (campo && typeof campo.focus === 'function') {
      campo.focus();
    }
  };

  const limpiarErrorCampo = (campo) => {
    if (!campo) {
      return;
    }

    campo.classList.remove('field-error', 'is-invalid');

    const grupo = campo.closest('.instructor-field');
    if (grupo) {
      grupo.classList.remove('has-error');
    }

    const error = document.querySelector(`[data-error-for="${campo.id}"]`);
    if (error) {
      error.textContent = '';
    }
  };

  const validarTiempoEnTiempoReal = () => {
    const valorTexto = String(elementos.tiempo.value || '').trim();

    if (!valorTexto) {
      limpiarErrorCampo(elementos.tiempo);
      return true;
    }

    const valor = Number(valorTexto);

    if (!Number.isInteger(valor) || valor < LIMITES_EXAMEN.tiempoMinimo || valor > LIMITES_EXAMEN.tiempoMaximo) {
      mostrarErrorCampo(elementos.tiempo, `Usa un número entre ${LIMITES_EXAMEN.tiempoMinimo} y ${LIMITES_EXAMEN.tiempoMaximo}.`);
      return false;
    }

    limpiarErrorCampo(elementos.tiempo);
    return true;
  };

  const validarCantidadPreguntasEnTiempoReal = () => {
    const valorTexto = String(elementos.cantidadPreguntas.value || '').trim();

    if (!valorTexto) {
      limpiarErrorCampo(elementos.cantidadPreguntas);
      return true;
    }

    const valor = Number(valorTexto);

    if (!Number.isInteger(valor) || valor < 2 || valor > 50) {
      mostrarErrorCampo(elementos.cantidadPreguntas, 'El banco debe tener entre 2 y 50 preguntas.');
      return false;
    }

    limpiarErrorCampo(elementos.cantidadPreguntas);
    return true;
  };

  const obtenerTotalBancoPreguntas = () => Number(elementos.cantidadPreguntas?.value || 0);

  const validarPreguntasMostrarEnTiempoReal = () => {
    if (!elementos.preguntasMostrar) {
      return true;
    }

    const valorTexto = String(elementos.preguntasMostrar.value || '').trim();

    if (!valorTexto) {
      limpiarErrorCampo(elementos.preguntasMostrar);
      return true;
    }

    const valor = Number(valorTexto);
    const totalBanco = obtenerTotalBancoPreguntas();

    if (!Number.isInteger(valor) || valor < 1 || valor > 50) {
      mostrarErrorCampo(elementos.preguntasMostrar, 'Escribe una cantidad válida entre 1 y 50 preguntas.');
      return false;
    }

    if (Number.isInteger(totalBanco) && totalBanco > 0 && valor >= totalBanco) {
      mostrarErrorCampo(elementos.preguntasMostrar, 'Debe ser menor que el banco para que el examen pueda variar.');
      return false;
    }

    limpiarErrorCampo(elementos.preguntasMostrar);
    return true;
  };

  const validarCantidadOpcionesCampo = (campo) => {
    if (!campo) {
      return false;
    }

    const valorTexto = String(campo.value || '').trim();

    if (!valorTexto) {
      limpiarErrorCampo(campo);
      return true;
    }

    const valor = Number(valorTexto);

    if (!Number.isInteger(valor) || valor < 2 || valor > 6) {
      mostrarErrorCampo(campo, 'Solo se aceptan entre 2 y 6 opciones.');
      return false;
    }

    limpiarErrorCampo(campo);
    return true;
  };

  const validarCalificacionEnTiempoReal = () => {
    const valorTexto = String(elementos.calificacion.value || '').trim();

    if (!valorTexto) {
      limpiarErrorCampo(elementos.calificacion);
      return true;
    }

    const valor = Number(valorTexto);

    if (!Number.isFinite(valor) || valor < 60 || valor > 100) {
      mostrarErrorCampo(elementos.calificacion, 'Usa un número entre 60 y 100.');
      return false;
    }

    limpiarErrorCampo(elementos.calificacion);
    return true;
  };

  const crearOpcionHtml = (indicePregunta, indiceOpcion, opcion = {}) => `
    <div class="instructor-exam-option-row" data-option-index="${indiceOpcion}">
      <label class="mi-cuenta-field instructor-field" for="pregunta_${indicePregunta}_opcion_${indiceOpcion}">
        <span>Opción ${indiceOpcion}</span>
        <input
          autocomplete="off"
          id="pregunta_${indicePregunta}_opcion_${indiceOpcion}"
          class="instructorOpcionTexto"
          maxlength="250"
          type="text"
          value="${escaparHtml(opcion.texto_opcion || '')}">
        <small class="error-message" data-error-for="pregunta_${indicePregunta}_opcion_${indiceOpcion}"></small>
      </label>

      <label class="instructor-exam-correct">
        <input
          type="radio"
          name="pregunta_${indicePregunta}_correcta"
          class="instructorOpcionCorrecta"
          ${opcion.es_correcta ? 'checked' : ''}>
        <span>Respuesta correcta</span>
      </label>
    </div>
  `;

  const crearPreguntaHtml = (indicePregunta, pregunta = {}) => {
    const opciones = Array.isArray(pregunta.opciones) && pregunta.opciones.length > 0
      ? pregunta.opciones
      : [
        { texto_opcion: '', es_correcta: true },
        { texto_opcion: '', es_correcta: false }
      ];

    return `
      <article class="instructor-exam-question" data-question-index="${indicePregunta}">
        <h3>Pregunta ${indicePregunta}</h3>

        <div class="instructor-exam-question-grid">
          <label class="mi-cuenta-field instructor-field" for="pregunta_${indicePregunta}_texto">
            <span>Texto de la pregunta</span>
            <textarea id="pregunta_${indicePregunta}_texto" class="instructorPreguntaTexto" rows="4">${escaparHtml(pregunta.texto_pregunta || '')}</textarea>
            <small class="error-message" data-error-for="pregunta_${indicePregunta}_texto"></small>
          </label>

          <div>
            <label class="mi-cuenta-field instructor-field" for="pregunta_${indicePregunta}_cantidad_opciones">
              <span>¿Cuántas opciones tendrá?</span>
              <input
                autocomplete="off"
                id="pregunta_${indicePregunta}_cantidad_opciones"
                class="instructorCantidadOpciones"
                inputmode="numeric"
                placeholder="Ejemplo: 4"
                type="text"
                value="${escaparHtml(opciones.length)}">
              <small class="error-message" data-error-for="pregunta_${indicePregunta}_cantidad_opciones"></small>
            </label>

            <button class="instructor-form-text-button instructorCrearOpciones" type="button">
              Crear opciones
            </button>
          </div>
        </div>

        <div class="instructor-exam-options">
          ${opciones.map((opcion, indice) => crearOpcionHtml(indicePregunta, indice + 1, opcion)).join('')}
        </div>
      </article>
    `;
  };

  const pintarPreguntas = (cantidad, preguntasExistentes = []) => {
    const total = Number(cantidad || 0);

    if (!Number.isInteger(total) || total < 1 || total > 50) {
      mostrarErrorCampo(elementos.cantidadPreguntas, 'Escribe una cantidad válida entre 1 y 50 preguntas.');
      return;
    }

    elementos.preguntasCampos.innerHTML = Array.from({ length: total }, (_, indice) => (
      crearPreguntaHtml(indice + 1, preguntasExistentes[indice] || {})
    )).join('');
  };

  const pintarOpcionesPregunta = (tarjetaPregunta) => {
    const indicePregunta = Number(tarjetaPregunta.dataset.questionIndex || 0);
    const inputCantidad = tarjetaPregunta.querySelector('.instructorCantidadOpciones');
    const contenedor = tarjetaPregunta.querySelector('.instructor-exam-options');
    const cantidad = Number(inputCantidad.value || 0);

    if (!Number.isInteger(cantidad) || cantidad < 2 || cantidad > 6) {
      mostrarErrorCampo(inputCantidad, 'Solo se aceptan entre 2 y 6 opciones.');
      inputCantidad.focus();
      return;
    }

    const opcionesActuales = Array.from(tarjetaPregunta.querySelectorAll('.instructor-exam-option-row')).map((fila) => ({
      texto_opcion: fila.querySelector('.instructorOpcionTexto')?.value || '',
      es_correcta: Boolean(fila.querySelector('.instructorOpcionCorrecta')?.checked)
    }));

    contenedor.innerHTML = Array.from({ length: cantidad }, (_, indice) => {
      const opcion = opcionesActuales[indice] || {
        texto_opcion: '',
        es_correcta: indice === 0
      };

      return crearOpcionHtml(indicePregunta, indice + 1, opcion);
    }).join('');

    const correctaMarcada = contenedor.querySelector('.instructorOpcionCorrecta:checked');

    if (!correctaMarcada) {
      const primera = contenedor.querySelector('.instructorOpcionCorrecta');

      if (primera) {
        primera.checked = true;
      }
    }
  };

  const cargarDatos = async () => {
    estado.usuario = obtenerUsuarioSesion();

    if (!estado.usuario) {
      if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
        window.EduTech.guardarRedirectDespuesLogin(`instructor-examen.html?idCurso=${encodeURIComponent(idCurso)}`);
      }

      window.location.replace('login.html');
      return;
    }

    if (!usuarioPuedeEntrar(estado.usuario)) {
      const destino = window.EduTech && typeof window.EduTech.obtenerRutaInicioPorRol === 'function'
        ? window.EduTech.obtenerRutaInicioPorRol(estado.usuario)
        : 'mi-cuenta.html';

      window.location.replace(destino);
      return;
    }

    if (!idCurso) {
      revelarPantallaProtegida();
      mostrarMensaje('No se recibió el curso para configurar el examen.', true);
      return;
    }

    const idInstructor = obtenerIdInstructor();
    const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}/examen`);

    estado.curso = datos.curso;
    estado.examen = datos.examen;

    if (elementos.cursoId) {
      elementos.cursoId.value = String(idCurso);
    }

    if (elementos.tituloCurso) {
      elementos.tituloCurso.textContent = estado.curso?.titulo || 'Examen del curso';
    }

    if (elementos.descripcionCurso) {
      elementos.descripcionCurso.textContent = estado.curso?.descripcion || 'Configura el examen final del curso.';
    }

    const urlEditar = 'instructor.html#crear';

    if (elementos.volverEditar) {
      elementos.volverEditar.href = urlEditar;
      elementos.volverEditar.addEventListener('click', () => {
        sessionStorage.setItem('edutech_instructor_editar_curso_id', String(idCurso));
      });
    }

    if (elementos.volverEditarSuperior) {
      elementos.volverEditarSuperior.href = urlEditar;
      elementos.volverEditarSuperior.addEventListener('click', () => {
        sessionStorage.setItem('edutech_instructor_editar_curso_id', String(idCurso));
      });
    }

    if (estado.examen) {
      elementos.titulo.value = estado.examen.titulo || '';
      if (elementos.descripcion) {
        elementos.descripcion.value = estado.examen.descripcion || '';
      }
      if (elementos.moduloTexto) {
        elementos.moduloTexto.value = estado.examen.texto_introductorio || estado.examen.texto_descriptivo || estado.examen.descripcion_larga || estado.examen.descripcion || '';
      }
      elementos.tiempo.value = estado.examen.tiempo_limite_minutos || '';
      if (elementos.intentosModo) {
        elementos.intentosModo.value = Number(estado.examen.max_intentos || 0) > 0 ? 'limitados' : 'ilimitados';
      }
      elementos.intentos.value = Number(estado.examen.max_intentos || 0) > 0 ? String(estado.examen.max_intentos) : '0';
      elementos.calificacion.value = estado.examen.calificacion_minima || '';
      const totalBancoPreguntas = Array.isArray(estado.examen.preguntas) ? estado.examen.preguntas.length : 0;
      elementos.cantidadPreguntas.value = totalBancoPreguntas ? String(totalBancoPreguntas) : '';
      if (elementos.preguntasMostrar) {
        elementos.preguntasMostrar.value = estado.examen.cantidad_preguntas
          ? String(estado.examen.cantidad_preguntas)
          : (totalBancoPreguntas ? String(totalBancoPreguntas) : '');
      }
      pintarPreguntas(elementos.cantidadPreguntas.value, estado.examen.preguntas || []);
    } else {
      elementos.titulo.value = 'Examen final';
      if (elementos.descripcion) {
        elementos.descripcion.value = 'Evaluación final del curso.';
      }
      if (elementos.moduloTexto) {
        elementos.moduloTexto.value = 'Lee cuidadosamente cada pregunta. Recuerda que este examen sirve para comprobar lo aprendido en el curso.';
      }
      elementos.tiempo.value = '30';
      if (elementos.intentosModo) {
        elementos.intentosModo.value = 'limitados';
      }
      elementos.intentos.value = '2';
      elementos.calificacion.value = '70';
      elementos.cantidadPreguntas.value = '';
      if (elementos.preguntasMostrar) {
        elementos.preguntasMostrar.value = '';
      }
      elementos.preguntasCampos.innerHTML = '';
    }

    actualizarVistaIntentos();
    validarTiempoEnTiempoReal();
    validarIntentosEnTiempoReal();
    validarCalificacionEnTiempoReal();
    validarCantidadPreguntasEnTiempoReal();
    validarPreguntasMostrarEnTiempoReal();

    revelarPantallaProtegida();
  };

  const obtenerDatosFormulario = () => {
    const preguntas = Array.from(elementos.preguntasCampos.querySelectorAll('.instructor-exam-question')).map((tarjetaPregunta, indicePregunta) => {
      const opciones = Array.from(tarjetaPregunta.querySelectorAll('.instructor-exam-option-row')).map((fila, indiceOpcion) => ({
        texto_opcion: fila.querySelector('.instructorOpcionTexto')?.value.trim() || '',
        es_correcta: Boolean(fila.querySelector('.instructorOpcionCorrecta')?.checked),
        numero_orden: indiceOpcion + 1
      }));

      return {
        texto_pregunta: tarjetaPregunta.querySelector('.instructorPreguntaTexto')?.value.trim() || '',
        numero_orden: indicePregunta + 1,
        opciones
      };
    });

    return {
      titulo: elementos.titulo.value.trim(),
      descripcion: elementos.moduloTexto ? elementos.moduloTexto.value.trim() : 'Evaluación final del curso.',
      texto_introductorio: elementos.moduloTexto ? elementos.moduloTexto.value.trim() : 'Evaluación final del curso.',
      tiempo_limite_minutos: elementos.tiempo.value.trim(),
      max_intentos: (elementos.intentosModo?.value === 'ilimitados' ? '0' : elementos.intentos.value.trim()),
      calificacion_minima: elementos.calificacion.value.trim(),
      cantidad_preguntas: elementos.preguntasMostrar ? elementos.preguntasMostrar.value.trim() : String(preguntas.length),
      preguntas
    };
  };

  const validarFormulario = (datos) => {
    limpiarErrores();
    ocultarEstadoFormulario();

    const errores = [];

    if (datos.titulo.length < 5 || !contieneLetras(datos.titulo)) {
      errores.push('El título del examen debe tener al menos 5 caracteres y contener texto.');
      mostrarErrorCampo(elementos.titulo, 'Escribe un título válido.');
    }

    if (!datos.texto_introductorio || datos.texto_introductorio.length < 2 || !contieneLetras(datos.texto_introductorio)) {
      errores.push('El texto descriptivo del examen debe contener texto válido.');
      mostrarErrorCampo(elementos.moduloTexto, 'Escribe una descripción válida.');
    }

    const tiempo = Number(datos.tiempo_limite_minutos);
    const intentos = Number(datos.max_intentos);
    const intentosIlimitados = intentos === 0;
    const calificacion = Number(datos.calificacion_minima);

    if (!Number.isInteger(tiempo) || tiempo < LIMITES_EXAMEN.tiempoMinimo || tiempo > LIMITES_EXAMEN.tiempoMaximo) {
      errores.push(`El tiempo límite debe estar entre ${LIMITES_EXAMEN.tiempoMinimo} y ${LIMITES_EXAMEN.tiempoMaximo} minutos.`);
      mostrarErrorCampo(elementos.tiempo, `Usa un número entre ${LIMITES_EXAMEN.tiempoMinimo} y ${LIMITES_EXAMEN.tiempoMaximo}.`);
    }

    if (!intentosIlimitados && (!Number.isInteger(intentos) || intentos < 1 || intentos > LIMITES_EXAMEN.intentosMaximos)) {
      errores.push(`Si el examen tiene intentos limitados, debes usar un número entre 1 y ${LIMITES_EXAMEN.intentosMaximos}.`);
      mostrarErrorCampo(elementos.intentos, `Usa un número entre 1 y ${LIMITES_EXAMEN.intentosMaximos}.`);
    }

    if (!Number.isFinite(calificacion) || calificacion < 60 || calificacion > 100) {
      errores.push('La calificación mínima debe estar entre 60 y 100.');
      mostrarErrorCampo(elementos.calificacion, 'Usa un número entre 60 y 100.');
    }

    if (!Array.isArray(datos.preguntas) || datos.preguntas.length < 2) {
      errores.push('Crea al menos 2 preguntas para formar el banco aleatorio.');
      mostrarErrorCampo(elementos.cantidadPreguntas, 'Crea al menos 2 preguntas para formar el banco aleatorio.');
    }

    const preguntasAMostrar = Number(datos.cantidad_preguntas);

    if (!Number.isInteger(preguntasAMostrar) || preguntasAMostrar < 1 || preguntasAMostrar > 50) {
      errores.push('Indica cuántas preguntas se mostrarán al alumno.');
      mostrarErrorCampo(elementos.preguntasMostrar, 'Escribe una cantidad válida entre 1 y 50 preguntas.');
    } else if (Array.isArray(datos.preguntas) && datos.preguntas.length > 0 && preguntasAMostrar >= datos.preguntas.length) {
      errores.push('Las preguntas a mostrar deben ser menores que el banco para que el examen pueda variar entre intentos.');
      mostrarErrorCampo(elementos.preguntasMostrar, 'Debe ser menor que el banco para que el examen pueda variar.');
    }

    datos.preguntas.forEach((pregunta, indicePregunta) => {
      const campoPregunta = document.getElementById(`pregunta_${indicePregunta + 1}_texto`);

      if (pregunta.texto_pregunta.length < 5 || !contieneLetras(pregunta.texto_pregunta)) {
        errores.push(`La pregunta ${indicePregunta + 1} debe contener texto válido.`);
        mostrarErrorCampo(campoPregunta, 'Escribe una pregunta válida.');
      }

      if (!Array.isArray(pregunta.opciones) || pregunta.opciones.length < 2) {
        errores.push(`La pregunta ${indicePregunta + 1} debe tener al menos 2 opciones.`);
      }

      const correctas = pregunta.opciones.filter((opcion) => opcion.es_correcta).length;

      if (correctas !== 1) {
        errores.push(`La pregunta ${indicePregunta + 1} debe tener una sola respuesta correcta.`);
      }

      pregunta.opciones.forEach((opcion, indiceOpcion) => {
        const campoOpcion = document.getElementById(`pregunta_${indicePregunta + 1}_opcion_${indiceOpcion + 1}`);

        if (opcion.texto_opcion.length < 1 || !contieneLetras(opcion.texto_opcion)) {
          errores.push(`La opción ${indiceOpcion + 1} de la pregunta ${indicePregunta + 1} debe contener texto.`);
          mostrarErrorCampo(campoOpcion, 'Escribe una opción válida.');
        }
      });
    });

    return errores;
  };

  const guardarExamen = async (activar = false) => {
    const datos = obtenerDatosFormulario();
    const errores = validarFormulario(datos);

    if (errores.length > 0) {
      mostrarEstadoFormulario('Revisa los campos marcados en rojo antes de continuar.');
      enfocarPrimerError();
      throw new Error('examen_invalido');
    }

    const idInstructor = obtenerIdInstructor();

    return window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}/examen`, {
      method: 'POST',
      body: {
        ...datos,
        activar
      }
    });
  };

  const enviarRevision = async () => {
    const idInstructor = obtenerIdInstructor();

    return window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}/enviar-revision`, {
      method: 'POST'
    });
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    const accion = evento.submitter?.value || 'guardar_borrador';

    try {
      ocultarMensaje();
      ocultarEstadoFormulario();

      if (evento.submitter) {
        evento.submitter.disabled = true;
      }

      await guardarExamen(accion === 'enviar_revision');

      if (accion === 'enviar_revision') {
        const datosRevision = await enviarRevision();
        mostrarMensaje(datosRevision.message || 'Curso enviado a revisión correctamente.');

        window.setTimeout(() => {
          window.location.href = 'instructor.html#cursos';
        }, 700);

        return;
      }

      mostrarMensaje('Examen guardado como borrador.');

      window.setTimeout(() => {
        window.location.href = 'instructor.html#cursos';
      }, 700);
    } catch (error) {
      if (error && error.message === 'examen_invalido') {
        return;
      }

      const mensaje = error && error.message ? error.message : 'No se pudo guardar el examen.';
      ocultarMensaje();
      mostrarEstadoFormulario(mensaje);

      if (elementos.estadoFormulario && typeof elementos.estadoFormulario.scrollIntoView === 'function') {
        elementos.estadoFormulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (evento.submitter) {
        evento.submitter.disabled = false;
      }
    }
  };

  const validarIntentosEnTiempoReal = () => {
    if (!elementos.intentos || elementos.intentosWrap?.hidden) {
      limpiarErrorCampo(elementos.intentos);
      return true;
    }

    const valorTexto = String(elementos.intentos.value || '').trim();

    if (!valorTexto) {
      limpiarErrorCampo(elementos.intentos);
      return true;
    }

    const valor = Number(valorTexto);

    if (!Number.isInteger(valor) || valor < 1 || valor > LIMITES_EXAMEN.intentosMaximos) {
      mostrarErrorCampo(elementos.intentos, `Usa un número entre 1 y ${LIMITES_EXAMEN.intentosMaximos}.`);
      return false;
    }

    limpiarErrorCampo(elementos.intentos);
    return true;
  };

  const configurarEventos = () => {
    elementos.crearPreguntas.addEventListener('click', () => {
      const cantidad = Number(elementos.cantidadPreguntas.value || 0);

      if (!validarCantidadPreguntasEnTiempoReal()) {
        elementos.cantidadPreguntas.focus();
        return;
      }

      if (elementos.preguntasMostrar && String(elementos.preguntasMostrar.value || '').trim()) {
        if (!validarPreguntasMostrarEnTiempoReal()) {
          elementos.preguntasMostrar.focus();
          return;
        }
      } else {
        limpiarErrorCampo(elementos.preguntasMostrar);
      }

      pintarPreguntas(cantidad);
    });

    elementos.preguntasCampos.addEventListener('input', (evento) => {
      const campoOpciones = evento.target.closest('.instructorCantidadOpciones');

      if (campoOpciones) {
        campoOpciones.value = campoOpciones.value.replace(/\D/g, '');
        validarCantidadOpcionesCampo(campoOpciones);
      }
    });

    elementos.preguntasCampos.addEventListener('click', (evento) => {
      const boton = evento.target.closest('.instructorCrearOpciones');

      if (!boton) {
        return;
      }

      evento.preventDefault();
      const tarjeta = boton.closest('.instructor-exam-question');
      const campoOpciones = tarjeta.querySelector('.instructorCantidadOpciones');

      if (!validarCantidadOpcionesCampo(campoOpciones)) {
        campoOpciones.focus();
        return;
      }

      pintarOpcionesPregunta(tarjeta);
    });

    elementos.form.addEventListener('submit', manejarSubmit);

    [elementos.tiempo, elementos.intentos, elementos.cantidadPreguntas, elementos.preguntasMostrar].filter(Boolean).forEach((campo) => {
      campo.addEventListener('input', () => {
        campo.value = campo.value.replace(/\D/g, '');

        if (campo === elementos.tiempo) {
          validarTiempoEnTiempoReal();
        }

        if (campo === elementos.intentos) {
          validarIntentosEnTiempoReal();
        }

        if (campo === elementos.cantidadPreguntas) {
          validarCantidadPreguntasEnTiempoReal();
          validarPreguntasMostrarEnTiempoReal();
        }

        if (campo === elementos.preguntasMostrar) {
          validarPreguntasMostrarEnTiempoReal();
        }
      });
    });

    if (elementos.intentosModo) {
      elementos.intentosModo.addEventListener('change', () => {
        limpiarErrores();
        actualizarVistaIntentos();
      });
    }

    elementos.calificacion.addEventListener('input', () => {
      elementos.calificacion.value = elementos.calificacion.value.replace(/[^0-9.]/g, '');
      validarCalificacionEnTiempoReal();
    });

    elementos.form.addEventListener('input', () => {
      ocultarEstadoFormulario();
    });
  };

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      mantenerPantallaOculta();
      configurarEventos();
      await cargarDatos();
    } catch (error) {
      if (esErrorDeAccesoAlCurso(error)) {
        redirigirSinMostrarContenido('No puedes acceder a ese curso porque no pertenece a tu cuenta de instructor.');
        return;
      }

      revelarPantallaProtegida();
      mostrarMensaje(error && error.message ? error.message : 'No se pudo cargar el examen.', true);
    }
  });
})();
