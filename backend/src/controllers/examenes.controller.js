const pool = require('../config/db');
const { generarCertificadoAprobacion } = require('../services/certificados.service');

const ESTADO_EXAMEN_ACTIVO = 'activo';
const ESTADO_INTENTO_FINALIZADO = 'finalizado';

const convertirNumero = (valor, respaldo = 0) => {
  const numero = Number(valor);
  return Number.isNaN(numero) ? respaldo : numero;
};

const asegurarColumnaTiempoTotalIntento = async (cliente) => {
  await cliente.query(`
    ALTER TABLE edutech.intento_examen
    ADD COLUMN IF NOT EXISTS tiempo_total_segundos INTEGER
  `);
};

const normalizarTiempoTotalSegundos = (valor, examen = {}) => {
  const numero = Math.floor(Number(valor));

  if (!Number.isFinite(numero) || numero < 0) {
    return 0;
  }

  const limite = convertirNumero(examen.tiempo_limite_minutos, 0) * 60;

  if (limite > 0) {
    return Math.min(numero, limite);
  }

  return numero;
};

const obtenerInscripcionUsuarioCurso = async (cliente, idUsuario, idCurso) => {
  const resultado = await cliente.query(
    `SELECT
      i.id_inscripcion,
      i.fecha_inscripcion,
      ei.nombre_estado_inscripcion,
      c.id_curso,
      c.titulo AS titulo_curso
     FROM edutech.inscripcion i
     INNER JOIN edutech.estado_inscripcion ei
      ON i.id_estado_inscripcion = ei.id_estado_inscripcion
     INNER JOIN edutech.orden_detalle od
      ON i.id_orden_detalle = od.id_orden_detalle
     INNER JOIN edutech.orden o
      ON od.id_orden = o.id_orden
     INNER JOIN edutech.curso c
      ON od.id_curso = c.id_curso
     WHERE o.id_usuario = $1
      AND c.id_curso = $2
      AND ei.nombre_estado_inscripcion IN ('activa', 'completada')
     ORDER BY i.fecha_inscripcion DESC
     LIMIT 1`,
    [idUsuario, idCurso]
  );

  return resultado.rows[0] || null;
};

const obtenerExamenActivoCurso = async (cliente, idCurso) => {
  const resultado = await cliente.query(
    `SELECT
      e.id_examen,
      e.id_curso,
      e.titulo,
      e.descripcion,
      e.descripcion AS texto_introductorio,
      e.descripcion AS texto_descriptivo,
      e.descripcion AS descripcion_larga,
      e.tiempo_limite_minutos,
      e.max_intentos,
      e.calificacion_minima,
      e.cantidad_preguntas,
      ee.nombre_estado_examen
     FROM edutech.examen e
     INNER JOIN edutech.estado_examen ee
      ON e.id_estado_examen = ee.id_estado_examen
     WHERE e.id_curso = $1
      AND ee.nombre_estado_examen = $2
     LIMIT 1`,
    [idCurso, ESTADO_EXAMEN_ACTIVO]
  );

  return resultado.rows[0] || null;
};

const obtenerProgresoContenidoCurso = async (cliente, idInscripcion, idCurso) => {
  const resultado = await cliente.query(
    `SELECT
      COUNT(DISTINCT l.id_leccion)::int AS total_lecciones,
      COUNT(DISTINCT CASE WHEN pl.completada = TRUE THEN l.id_leccion END)::int AS lecciones_completadas
     FROM edutech.modulo m
     INNER JOIN edutech.leccion l
      ON l.id_modulo = m.id_modulo
     LEFT JOIN edutech.progreso_leccion pl
      ON pl.id_leccion = l.id_leccion
      AND pl.id_inscripcion = $1
     WHERE m.id_curso = $2
      AND l.esta_activa = TRUE
      AND NOT (
        LOWER(m.titulo) LIKE '%examen final%'
        OR LOWER(l.titulo) LIKE '%examen final%'
      )`,
    [idInscripcion, idCurso]
  );

  const fila = resultado.rows[0] || { total_lecciones: 0, lecciones_completadas: 0 };
  const total = convertirNumero(fila.total_lecciones, 0);
  const completadas = convertirNumero(fila.lecciones_completadas, 0);

  return {
    total_lecciones: total,
    lecciones_completadas: completadas,
    contenido_completo: total === 0 || completadas >= total
  };
};

const obtenerResumenIntentos = async (cliente, idExamen, idInscripcion) => {
  const resultado = await cliente.query(
    `SELECT
      COUNT(*)::int AS intentos_realizados,
      COALESCE(MAX(numero_intento), 0)::int AS ultimo_numero_intento
     FROM edutech.intento_examen
     WHERE id_examen = $1
      AND id_inscripcion = $2`,
    [idExamen, idInscripcion]
  );

  return resultado.rows[0] || {
    intentos_realizados: 0,
    ultimo_numero_intento: 0
  };
};

const obtenerPreguntasExamen = async (cliente, idExamen, cantidadPreguntas) => {
  const resultado = await cliente.query(
    `SELECT
      p.id_pregunta,
      p.texto_pregunta,
      COALESCE(
        json_agg(
          json_build_object(
            'id_opcion', o.id_opcion,
            'texto_opcion', o.texto_opcion
          )
          ORDER BY o.id_opcion ASC
        ) FILTER (WHERE o.id_opcion IS NOT NULL),
        '[]'
      ) AS opciones
     FROM edutech.pregunta p
     INNER JOIN edutech.opcion_respuesta o
      ON p.id_pregunta = o.id_pregunta
     WHERE p.id_examen = $1
      AND p.esta_activa = TRUE
     GROUP BY p.id_pregunta, p.texto_pregunta
     ORDER BY random()
     LIMIT $2`,
    [idExamen, cantidadPreguntas]
  );

  return resultado.rows;
};

const obtenerUltimoResultado = async (cliente, idExamen, idInscripcion) => {
  const resultado = await cliente.query(
    `SELECT
      ie.id_intento,
      ie.numero_intento,
      ie.fecha_inicio,
      ie.fecha_fin,
      ie.calificacion,
      ie.aprobado,
      ie.tiempo_total_segundos,
      ei.nombre_estado_intento
     FROM edutech.intento_examen ie
     INNER JOIN edutech.estado_intento ei
      ON ie.id_estado_intento = ei.id_estado_intento
     WHERE ie.id_examen = $1
      AND ie.id_inscripcion = $2
     ORDER BY ie.numero_intento DESC
     LIMIT 1`,
    [idExamen, idInscripcion]
  );

  return resultado.rows[0] || null;
};


const obtenerRespuestasResultado = async (cliente, idIntento) => {
  if (!idIntento) {
    return [];
  }

  const resultado = await cliente.query(
    `SELECT
      pi.id_pregunta,
      p.texto_pregunta,
      ra.id_opcion,
      o.texto_opcion,
      ra.es_correcta,
      pi.numero_orden
     FROM edutech.pregunta_intento pi
     INNER JOIN edutech.pregunta p
      ON p.id_pregunta = pi.id_pregunta
     LEFT JOIN edutech.respuesta_alumno ra
      ON ra.id_intento = pi.id_intento
      AND ra.id_pregunta = pi.id_pregunta
     LEFT JOIN edutech.opcion_respuesta o
      ON o.id_opcion = ra.id_opcion
     WHERE pi.id_intento = $1
     ORDER BY pi.numero_orden ASC`,
    [idIntento]
  );

  return resultado.rows.map((fila) => ({
    id_pregunta: fila.id_pregunta,
    texto_pregunta: fila.texto_pregunta,
    id_opcion: fila.id_opcion,
    texto_opcion: fila.texto_opcion || 'Sin respuesta',
    es_correcta: Boolean(fila.es_correcta),
    numero_orden: fila.numero_orden
  }));
};

const obtenerExamenCurso = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idUsuario, idCurso } = req.params;

    await asegurarColumnaTiempoTotalIntento(cliente);

    const inscripcion = await obtenerInscripcionUsuarioCurso(cliente, idUsuario, idCurso);

    if (!inscripcion) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes una inscripción activa para este curso.'
      });
    }

    const examen = await obtenerExamenActivoCurso(cliente, idCurso);

    if (!examen) {
      return res.status(404).json({
        ok: false,
        message: 'Este curso todavía no tiene examen final activo.'
      });
    }

    const progresoCurso = await obtenerProgresoContenidoCurso(cliente, inscripcion.id_inscripcion, idCurso);
    const resumenIntentos = await obtenerResumenIntentos(cliente, examen.id_examen, inscripcion.id_inscripcion);
    const ultimoResultado = await obtenerUltimoResultado(cliente, examen.id_examen, inscripcion.id_inscripcion);
    const intentos = await obtenerIntentosExamen(cliente, examen.id_examen, inscripcion.id_inscripcion, examen);
    const maxIntentos = convertirNumero(examen.max_intentos, 1);
    const intentosRealizados = convertirNumero(resumenIntentos.intentos_realizados, 0);
    const intentosIlimitados = maxIntentos <= 0;
    const puedePorIntentos = intentosIlimitados ? true : intentosRealizados < maxIntentos;

    if (!progresoCurso.contenido_completo) {
      return res.json({
        ok: true,
        examen: {
          ...examen,
          id_inscripcion: inscripcion.id_inscripcion,
          titulo_curso: inscripcion.titulo_curso,
          intentos_realizados: intentosRealizados,
          intentos_restantes: intentosIlimitados ? null : Math.max(0, maxIntentos - intentosRealizados),
          puede_presentar: false,
          intentos_ilimitados: intentosIlimitados,
          bloqueado_por_progreso: true,
          mensaje_bloqueo: 'Completa todas las lecciones anteriores antes de presentar el examen final.',
          progreso_curso: progresoCurso,
          ultimo_resultado: ultimoResultado,
          intentos,
          preguntas: []
        }
      });
    }

    const cantidadPreguntas = Math.max(1, convertirNumero(examen.cantidad_preguntas, 1));
    const preguntas = await obtenerPreguntasExamen(cliente, examen.id_examen, cantidadPreguntas);

    res.json({
      ok: true,
      examen: {
        ...examen,
        id_inscripcion: inscripcion.id_inscripcion,
        titulo_curso: inscripcion.titulo_curso,
        intentos_realizados: intentosRealizados,
        intentos_restantes: intentosIlimitados ? null : Math.max(0, maxIntentos - intentosRealizados),
        puede_presentar: puedePorIntentos,
        intentos_ilimitados: intentosIlimitados,
        bloqueado_por_progreso: false,
        progreso_curso: progresoCurso,
        ultimo_resultado: ultimoResultado,
        intentos,
        preguntas
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el examen final.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};


const obtenerIntentosExamen = async (cliente, idExamen, idInscripcion, examen = {}) => {
  const resultado = await cliente.query(
    `SELECT
      id_intento,
      numero_intento,
      fecha_inicio,
      fecha_fin,
      calificacion,
      aprobado,
      tiempo_total_segundos
     FROM edutech.intento_examen
     WHERE id_examen = $1
      AND id_inscripcion = $2
     ORDER BY numero_intento ASC`,
    [idExamen, idInscripcion]
  );

  const intentos = [];

  for (const intento of resultado.rows) {
    const respuestas = await obtenerRespuestasResultado(cliente, intento.id_intento);
    const correctas = respuestas.filter((respuesta) => respuesta.es_correcta).length;

    intentos.push({
      ...intento,
      id_examen: Number(idExamen),
      total_preguntas: respuestas.length || convertirNumero(examen.cantidad_preguntas, 0),
      respuestas_correctas: correctas,
      calificacion_minima: examen.calificacion_minima,
      tiempo_total_segundos: intento.tiempo_total_segundos,
      respuestas
    });
  }

  return intentos;
};

const marcarLeccionExamenCompletada = async (cliente, idInscripcion, idCurso) => {
  const leccionResultado = await cliente.query(
    `SELECT l.id_leccion
     FROM edutech.modulo m
     INNER JOIN edutech.leccion l
      ON l.id_modulo = m.id_modulo
     WHERE m.id_curso = $1
      AND (
        LOWER(m.titulo) LIKE '%examen final%'
        OR LOWER(l.titulo) LIKE '%examen final%'
      )
     ORDER BY m.numero_orden DESC, l.numero_orden DESC
     LIMIT 1`,
    [idCurso]
  );

  const leccion = leccionResultado.rows[0];

  if (!leccion) {
    return;
  }

  await cliente.query(
    `INSERT INTO edutech.progreso_leccion
      (id_inscripcion, id_leccion, completada, fecha_completada)
     VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP)
     ON CONFLICT (id_inscripcion, id_leccion)
     DO UPDATE SET
      completada = TRUE,
      fecha_completada = CURRENT_TIMESTAMP`,
    [idInscripcion, leccion.id_leccion]
  );

  await cliente.query(
    `UPDATE edutech.inscripcion
     SET id_estado_inscripcion = (
       SELECT id_estado_inscripcion
       FROM edutech.estado_inscripcion
       WHERE nombre_estado_inscripcion = 'completada'
       LIMIT 1
     )
     WHERE id_inscripcion = $1
      AND EXISTS (
        SELECT 1
        FROM edutech.estado_inscripcion
        WHERE nombre_estado_inscripcion = 'completada'
      )`,
    [idInscripcion]
  );
};

const obtenerEstadoIntentoFinalizado = async (cliente) => {
  const resultado = await cliente.query(
    `SELECT id_estado_intento
     FROM edutech.estado_intento
     WHERE nombre_estado_intento = $1
     LIMIT 1`,
    [ESTADO_INTENTO_FINALIZADO]
  );

  if (!resultado.rows[0]) {
    throw new Error('No existe el estado de intento finalizado.');
  }

  return resultado.rows[0].id_estado_intento;
};

const normalizarRespuestas = (respuestas) => {
  if (!Array.isArray(respuestas)) {
    return [];
  }

  return respuestas
    .map((respuesta) => ({
      id_pregunta: Number(respuesta.id_pregunta),
      id_opcion: Number(respuesta.id_opcion)
    }))
    .filter((respuesta) => Number.isInteger(respuesta.id_pregunta) && Number.isInteger(respuesta.id_opcion));
};

const calificarRespuestas = async (cliente, idExamen, respuestas) => {
  if (respuestas.length === 0) {
    return [];
  }

  const idPreguntas = respuestas.map((respuesta) => respuesta.id_pregunta);
  const idOpciones = respuestas.map((respuesta) => respuesta.id_opcion);

  const resultado = await cliente.query(
    `SELECT
      p.id_pregunta,
      p.texto_pregunta,
      o.id_opcion,
      o.texto_opcion,
      o.es_correcta
     FROM edutech.pregunta p
     INNER JOIN edutech.opcion_respuesta o
      ON p.id_pregunta = o.id_pregunta
     WHERE p.id_examen = $1
      AND p.esta_activa = TRUE
      AND p.id_pregunta = ANY($2::int[])
      AND o.id_opcion = ANY($3::int[])`,
    [idExamen, idPreguntas, idOpciones]
  );

  return respuestas.map((respuesta) => {
    const registro = resultado.rows.find((fila) => {
      return Number(fila.id_pregunta) === Number(respuesta.id_pregunta)
        && Number(fila.id_opcion) === Number(respuesta.id_opcion);
    });

    return {
      ...respuesta,
      texto_pregunta: registro ? registro.texto_pregunta : '',
      texto_opcion: registro ? registro.texto_opcion : '',
      es_correcta: Boolean(registro && registro.es_correcta)
    };
  });
};

const registrarIntentoExamen = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idUsuario, idCurso } = req.params;
    const respuestas = normalizarRespuestas(req.body && req.body.respuestas);

    await asegurarColumnaTiempoTotalIntento(cliente);

    if (respuestas.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Debes responder el examen antes de enviarlo.'
      });
    }

    await cliente.query('BEGIN');

    const inscripcion = await obtenerInscripcionUsuarioCurso(cliente, idUsuario, idCurso);

    if (!inscripcion) {
      await cliente.query('ROLLBACK');
      return res.status(403).json({
        ok: false,
        message: 'No tienes una inscripción activa para este curso.'
      });
    }

    const examen = await obtenerExamenActivoCurso(cliente, idCurso);

    if (!examen) {
      await cliente.query('ROLLBACK');
      return res.status(404).json({
        ok: false,
        message: 'Este curso todavía no tiene examen final activo.'
      });
    }

    const progresoCurso = await obtenerProgresoContenidoCurso(cliente, inscripcion.id_inscripcion, idCurso);

    if (!progresoCurso.contenido_completo) {
      await cliente.query('ROLLBACK');
      return res.status(409).json({
        ok: false,
        message: 'Completa todas las lecciones anteriores antes de presentar el examen final.',
        progreso_curso: progresoCurso
      });
    }

    const resumenIntentos = await obtenerResumenIntentos(cliente, examen.id_examen, inscripcion.id_inscripcion);
    const maxIntentos = convertirNumero(examen.max_intentos, 1);
    const intentosRealizados = convertirNumero(resumenIntentos.intentos_realizados, 0);
    const intentosIlimitados = maxIntentos <= 0;

    if (!intentosIlimitados && intentosRealizados >= maxIntentos) {
      await cliente.query('ROLLBACK');
      return res.status(409).json({
        ok: false,
        message: 'Ya usaste todos los intentos disponibles para este examen.'
      });
    }

    const respuestasCalificadas = await calificarRespuestas(cliente, examen.id_examen, respuestas);
    const totalPreguntas = respuestasCalificadas.length;
    const correctas = respuestasCalificadas.filter((respuesta) => respuesta.es_correcta).length;
    const calificacion = totalPreguntas === 0 ? 0 : Number(((correctas / totalPreguntas) * 100).toFixed(2));
    const aprobado = calificacion >= Number(examen.calificacion_minima);
    const idEstadoFinalizado = await obtenerEstadoIntentoFinalizado(cliente);
    const numeroIntento = convertirNumero(resumenIntentos.ultimo_numero_intento, 0) + 1;
    const tiempoTotalSegundos = normalizarTiempoTotalSegundos(req.body && req.body.tiempo_total_segundos, examen);

    const intentoResultado = await cliente.query(
      `INSERT INTO edutech.intento_examen
        (id_examen, id_inscripcion, id_estado_intento, numero_intento, fecha_fin, calificacion, aprobado, tiempo_total_segundos)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7)
       RETURNING id_intento, numero_intento, fecha_inicio, fecha_fin, calificacion, aprobado, tiempo_total_segundos`,
      [examen.id_examen, inscripcion.id_inscripcion, idEstadoFinalizado, numeroIntento, calificacion, aprobado, tiempoTotalSegundos]
    );

    const intento = intentoResultado.rows[0];

    for (let indice = 0; indice < respuestasCalificadas.length; indice += 1) {
      const respuesta = respuestasCalificadas[indice];

      await cliente.query(
        `INSERT INTO edutech.pregunta_intento
          (id_intento, id_pregunta, numero_orden)
         VALUES ($1, $2, $3)
         ON CONFLICT (id_intento, id_pregunta) DO NOTHING`,
        [intento.id_intento, respuesta.id_pregunta, indice + 1]
      );

      await cliente.query(
        `INSERT INTO edutech.respuesta_alumno
          (id_intento, id_pregunta, id_opcion, es_correcta)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_intento, id_pregunta)
         DO UPDATE SET
          id_opcion = EXCLUDED.id_opcion,
          es_correcta = EXCLUDED.es_correcta`,
        [intento.id_intento, respuesta.id_pregunta, respuesta.id_opcion, respuesta.es_correcta]
      );
    }

    let certificado = null;

    if (aprobado) {
      await marcarLeccionExamenCompletada(cliente, inscripcion.id_inscripcion, idCurso);
      certificado = await generarCertificadoAprobacion(cliente, inscripcion.id_inscripcion);
    }

    await cliente.query('COMMIT');

    res.status(201).json({
      ok: true,
      message: aprobado ? 'Examen aprobado.' : 'Examen no aprobado.',
      resultado: {
        ...intento,
        id_examen: examen.id_examen,
        id_curso: Number(idCurso),
        titulo_curso: inscripcion.titulo_curso,
        titulo_examen: examen.titulo,
        total_preguntas: totalPreguntas,
        respuestas_correctas: correctas,
        calificacion_minima: examen.calificacion_minima,
        tiempo_total_segundos: intento.tiempo_total_segundos ?? tiempoTotalSegundos,
        intentos_restantes: Math.max(0, maxIntentos - numeroIntento),
        certificado,
        respuestas: respuestasCalificadas
      }
    });
  } catch (error) {
    await cliente.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al registrar el intento del examen.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const obtenerResultadoExamen = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idUsuario, idCurso } = req.params;

    await asegurarColumnaTiempoTotalIntento(cliente);

    const inscripcion = await obtenerInscripcionUsuarioCurso(cliente, idUsuario, idCurso);

    if (!inscripcion) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes una inscripción activa para este curso.'
      });
    }

    const examen = await obtenerExamenActivoCurso(cliente, idCurso);

    if (!examen) {
      return res.status(404).json({
        ok: false,
        message: 'Este curso todavía no tiene examen final activo.'
      });
    }

    const ultimoResultado = await obtenerUltimoResultado(cliente, examen.id_examen, inscripcion.id_inscripcion);
    const respuestas = ultimoResultado ? await obtenerRespuestasResultado(cliente, ultimoResultado.id_intento) : [];
    const correctas = respuestas.filter((respuesta) => respuesta.es_correcta).length;
    const intentos = await obtenerIntentosExamen(cliente, examen.id_examen, inscripcion.id_inscripcion, examen);

    res.json({
      ok: true,
      resultado: ultimoResultado ? {
        ...ultimoResultado,
        id_examen: examen.id_examen,
        id_curso: Number(idCurso),
        titulo_curso: inscripcion.titulo_curso,
        titulo_examen: examen.titulo,
        total_preguntas: respuestas.length || examen.cantidad_preguntas,
        respuestas_correctas: correctas,
        calificacion_minima: examen.calificacion_minima,
        tiempo_total_segundos: ultimoResultado.tiempo_total_segundos,
        respuestas,
        intentos
      } : null
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el resultado del examen.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

module.exports = {
  obtenerExamenCurso,
  registrarIntentoExamen,
  obtenerResultadoExamen
};
