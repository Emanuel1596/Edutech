const pool = require('../config/db');

const normalizarTexto = (valor) => String(valor || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const esLeccionExamenFinal = (leccion = {}) => {
  const titulo = normalizarTexto(leccion.titulo);
  const modulo = normalizarTexto(leccion.modulo_titulo);

  return titulo.includes('examen final') || modulo.includes('examen final');
};

const ocultarContenidoLeccionBloqueada = (leccion) => ({
  ...leccion,
  texto_descriptivo: null,
  url_video: null,
  recursos: []
});

const aplicarBloqueoSecuencialLecciones = (lecciones = []) => {
  let anterioresContenidoCompletadas = true;
  const totalContenido = lecciones.filter((leccion) => !esLeccionExamenFinal(leccion)).length;
  const contenidoCompletado = lecciones.filter((leccion) => !esLeccionExamenFinal(leccion) && Boolean(leccion.completada)).length;

  return lecciones.map((leccion) => {
    const esExamen = esLeccionExamenFinal(leccion);
    const puedeAcceder = esExamen
      ? totalContenido > 0 && contenidoCompletado >= totalContenido
      : anterioresContenidoCompletadas;

    const leccionConEstado = {
      ...leccion,
      es_examen_final: esExamen,
      puede_acceder: puedeAcceder,
      bloqueada: !puedeAcceder
    };

    if (!esExamen && !Boolean(leccion.completada)) {
      anterioresContenidoCompletadas = false;
    }

    return leccionConEstado;
  });
};

const validarLeccionDisponible = async (idInscripcion, idLeccion, idUsuario = null) => {
  const resultado = await pool.query(
    `SELECT
      i.id_inscripcion,
      o.id_usuario,
      c.id_curso,
      l.id_leccion,
      l.titulo,
      m.titulo AS modulo_titulo,
      m.numero_orden AS modulo_orden,
      l.numero_orden AS leccion_orden,
      COALESCE(pl.completada, FALSE) AS completada,
      (
        SELECT COUNT(DISTINCT l_prev.id_leccion)::int
        FROM edutech.modulo m_prev
        INNER JOIN edutech.leccion l_prev
          ON l_prev.id_modulo = m_prev.id_modulo
        WHERE m_prev.id_curso = c.id_curso
          AND l_prev.esta_activa = TRUE
          AND NOT (
            LOWER(m_prev.titulo) LIKE '%examen final%'
            OR LOWER(l_prev.titulo) LIKE '%examen final%'
          )
          AND (
            m_prev.numero_orden < m.numero_orden
            OR (m_prev.numero_orden = m.numero_orden AND l_prev.numero_orden < l.numero_orden)
          )
      ) AS total_anteriores,
      (
        SELECT COUNT(DISTINCT l_prev.id_leccion)::int
        FROM edutech.modulo m_prev
        INNER JOIN edutech.leccion l_prev
          ON l_prev.id_modulo = m_prev.id_modulo
        INNER JOIN edutech.progreso_leccion pl_prev
          ON pl_prev.id_leccion = l_prev.id_leccion
          AND pl_prev.id_inscripcion = i.id_inscripcion
          AND pl_prev.completada = TRUE
        WHERE m_prev.id_curso = c.id_curso
          AND l_prev.esta_activa = TRUE
          AND NOT (
            LOWER(m_prev.titulo) LIKE '%examen final%'
            OR LOWER(l_prev.titulo) LIKE '%examen final%'
          )
          AND (
            m_prev.numero_orden < m.numero_orden
            OR (m_prev.numero_orden = m.numero_orden AND l_prev.numero_orden < l.numero_orden)
          )
      ) AS anteriores_completadas
     FROM edutech.inscripcion i
     INNER JOIN edutech.orden_detalle od
      ON i.id_orden_detalle = od.id_orden_detalle
     INNER JOIN edutech.orden o
      ON od.id_orden = o.id_orden
     INNER JOIN edutech.curso c
      ON od.id_curso = c.id_curso
     INNER JOIN edutech.modulo m
      ON c.id_curso = m.id_curso
     INNER JOIN edutech.leccion l
      ON m.id_modulo = l.id_modulo
     LEFT JOIN edutech.progreso_leccion pl
      ON pl.id_inscripcion = i.id_inscripcion
      AND pl.id_leccion = l.id_leccion
     WHERE i.id_inscripcion = $1
      AND l.id_leccion = $2
      AND l.esta_activa = TRUE
      AND ($3::integer IS NULL OR o.id_usuario = $3)
     LIMIT 1`,
    [idInscripcion, idLeccion, idUsuario || null]
  );

  const leccion = resultado.rows[0];

  if (!leccion) {
    return {
      existe: false,
      puedeAcceder: false,
      leccion: null
    };
  }

  const puedeAcceder = Number(leccion.anteriores_completadas || 0) >= Number(leccion.total_anteriores || 0);

  return {
    existe: true,
    puedeAcceder,
    leccion
  };
};

const obtenerMisCursos = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const resultado = await pool.query(
      `SELECT
        i.id_inscripcion,
        i.fecha_inscripcion,
        i.fecha_finalizacion,
        ei.nombre_estado_inscripcion,
        o.id_orden,
        o.numero_orden,
        o.fecha_creacion AS fecha_orden,
        MAX(p.fecha_pago) AS fecha_pago,
        COALESCE(MAX(p.fecha_pago), i.fecha_inscripcion, o.fecha_creacion) AS fecha_compra,
        c.id_curso,
        c.id_nivel_curso,
        nc.nombre_nivel,
        c.titulo,
        c.descripcion,
        c.imagen_portada,
        c.precio_mxn,
        instructor.nombre AS nombre_instructor,
        instructor.apellido_paterno AS apellido_paterno_instructor,
        COUNT(DISTINCT l.id_leccion) AS total_lecciones,
        COUNT(DISTINCT CASE WHEN pl.completada = TRUE THEN l.id_leccion END) AS lecciones_completadas,
        COALESCE(
          ROUND(
            (
              COUNT(DISTINCT CASE WHEN pl.completada = TRUE THEN l.id_leccion END)::numeric
              / NULLIF(COUNT(DISTINCT l.id_leccion), 0)
            ) * 100,
            2
          ),
          0
        ) AS porcentaje_avance
       FROM edutech.inscripcion i
       INNER JOIN edutech.estado_inscripcion ei
        ON i.id_estado_inscripcion = ei.id_estado_inscripcion
       INNER JOIN edutech.orden_detalle od
        ON i.id_orden_detalle = od.id_orden_detalle
       INNER JOIN edutech.orden o
        ON od.id_orden = o.id_orden
       LEFT JOIN edutech.pago p
        ON p.id_orden = o.id_orden
       INNER JOIN edutech.curso c
        ON od.id_curso = c.id_curso
       INNER JOIN edutech.usuario instructor
        ON c.id_usuario = instructor.id_usuario
       INNER JOIN edutech.nivel_curso nc
        ON c.id_nivel_curso = nc.id_nivel_curso
       LEFT JOIN edutech.modulo m
        ON c.id_curso = m.id_curso
       LEFT JOIN edutech.leccion l
        ON m.id_modulo = l.id_modulo
       LEFT JOIN edutech.progreso_leccion pl
        ON pl.id_inscripcion = i.id_inscripcion
       AND pl.id_leccion = l.id_leccion
       WHERE o.id_usuario = $1
       GROUP BY
        i.id_inscripcion,
        i.fecha_inscripcion,
        i.fecha_finalizacion,
        ei.nombre_estado_inscripcion,
        o.id_orden,
        o.numero_orden,
        o.fecha_creacion,
        c.id_curso,
        c.id_nivel_curso,
        nc.nombre_nivel,
        c.titulo,
        c.descripcion,
        c.imagen_portada,
        c.precio_mxn,
        instructor.nombre,
        instructor.apellido_paterno
       ORDER BY i.fecha_inscripcion DESC`,
      [idUsuario]
    );

    res.json({
      ok: true,
      total: resultado.rows.length,
      cursos: resultado.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener mis cursos.',
      error: error.message
    });
  }
};

const obtenerCursoInscritoDetalle = async (req, res) => {
  try {
    const { idUsuario, idInscripcion } = req.params;

    const inscripcionResultado = await pool.query(
      `SELECT
        i.id_inscripcion,
        i.fecha_inscripcion,
        i.fecha_finalizacion,
        ei.nombre_estado_inscripcion,
        o.id_orden,
        o.numero_orden,
        o.fecha_creacion AS fecha_orden,
        (
          SELECT MAX(p2.fecha_pago)
          FROM edutech.pago p2
          WHERE p2.id_orden = o.id_orden
        ) AS fecha_pago,
        COALESCE(
          (
            SELECT MAX(p3.fecha_pago)
            FROM edutech.pago p3
            WHERE p3.id_orden = o.id_orden
          ),
          i.fecha_inscripcion,
          o.fecha_creacion
        ) AS fecha_compra,
        c.id_curso,
        c.id_nivel_curso,
        nc.nombre_nivel,
        c.titulo,
        c.descripcion,
        c.imagen_portada,
        c.precio_mxn,
        instructor.nombre AS nombre_instructor,
        instructor.apellido_paterno AS apellido_paterno_instructor
       FROM edutech.inscripcion i
       INNER JOIN edutech.estado_inscripcion ei
        ON i.id_estado_inscripcion = ei.id_estado_inscripcion
       INNER JOIN edutech.orden_detalle od
        ON i.id_orden_detalle = od.id_orden_detalle
       INNER JOIN edutech.orden o
        ON od.id_orden = o.id_orden
       INNER JOIN edutech.curso c
        ON od.id_curso = c.id_curso
       INNER JOIN edutech.usuario instructor
        ON c.id_usuario = instructor.id_usuario
       INNER JOIN edutech.nivel_curso nc
        ON c.id_nivel_curso = nc.id_nivel_curso
       WHERE i.id_inscripcion = $1
        AND o.id_usuario = $2`,
      [idInscripcion, idUsuario]
    );

    if (inscripcionResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el curso inscrito para este usuario.'
      });
    }

    const cursoInscrito = inscripcionResultado.rows[0];

    const modulosResultado = await pool.query(
      `SELECT
        id_modulo,
        id_curso,
        titulo,
        numero_orden
       FROM edutech.modulo
       WHERE id_curso = $1
       ORDER BY numero_orden ASC`,
      [cursoInscrito.id_curso]
    );

    const leccionesResultado = await pool.query(
      `SELECT
        l.id_leccion,
        l.id_modulo,
        l.id_tipo_video,
        tv.nombre_tipo_video,
        m.titulo AS modulo_titulo,
        m.numero_orden AS modulo_orden,
        l.titulo,
        l.numero_orden,
        l.texto_descriptivo,
        l.url_video,
        l.duracion_segundos,
        l.esta_activa,
        COALESCE(pl.completada, FALSE) AS completada,
        pl.fecha_completada
       FROM edutech.leccion l
       INNER JOIN edutech.modulo m
        ON l.id_modulo = m.id_modulo
       INNER JOIN edutech.tipo_video tv
        ON l.id_tipo_video = tv.id_tipo_video
       LEFT JOIN edutech.progreso_leccion pl
        ON pl.id_leccion = l.id_leccion
       AND pl.id_inscripcion = $1
       WHERE m.id_curso = $2
       ORDER BY m.numero_orden ASC, l.numero_orden ASC`,
      [idInscripcion, cursoInscrito.id_curso]
    );

    const recursosResultado = await pool.query(
      `SELECT
        lr.id_leccion,
        r.id_recurso,
        tr.nombre_tipo_recurso,
        r.titulo,
        r.descripcion,
        r.url_recurso,
        lr.numero_orden
       FROM edutech.leccion_recurso lr
       INNER JOIN edutech.recurso r
        ON lr.id_recurso = r.id_recurso
       INNER JOIN edutech.tipo_recurso tr
        ON r.id_tipo_recurso = tr.id_tipo_recurso
       WHERE lr.id_leccion IN (
        SELECT l.id_leccion
        FROM edutech.leccion l
        INNER JOIN edutech.modulo m
          ON l.id_modulo = m.id_modulo
        WHERE m.id_curso = $1
       )
       ORDER BY lr.id_leccion ASC, lr.numero_orden ASC`,
      [cursoInscrito.id_curso]
    );

    const leccionesConRecursos = leccionesResultado.rows.map((leccion) => {
      const recursos = recursosResultado.rows.filter(
        (recurso) => recurso.id_leccion === leccion.id_leccion
      );

      return {
        ...leccion,
        recursos
      };
    });

    const leccionesConBloqueo = aplicarBloqueoSecuencialLecciones(leccionesConRecursos).map((leccion) => (
      leccion.bloqueada ? ocultarContenidoLeccionBloqueada(leccion) : leccion
    ));

    const modulos = modulosResultado.rows.map((modulo) => {
      const lecciones = leccionesConBloqueo.filter((leccion) => leccion.id_modulo === modulo.id_modulo);

      return {
        ...modulo,
        lecciones
      };
    });

    const totalLecciones = leccionesResultado.rows.length;
    const leccionesCompletadas = leccionesResultado.rows.filter(
      (leccion) => leccion.completada
    ).length;

    const porcentajeAvance = totalLecciones === 0
      ? 0
      : Number(((leccionesCompletadas / totalLecciones) * 100).toFixed(2));

    res.json({
      ok: true,
      curso: {
        ...cursoInscrito,
        total_lecciones: totalLecciones,
        lecciones_completadas: leccionesCompletadas,
        porcentaje_avance: porcentajeAvance,
        modulos
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el detalle del curso inscrito.',
      error: error.message
    });
  }
};

const obtenerContenidoLeccionInscrita = async (req, res) => {
  try {
    const { idUsuario, idInscripcion, idLeccion } = req.params;

    const acceso = await validarLeccionDisponible(idInscripcion, idLeccion, idUsuario);

    if (!acceso.existe) {
      return res.status(404).json({
        ok: false,
        message: 'La lección no pertenece a esta inscripción o no está activa.'
      });
    }

    if (!acceso.puedeAcceder) {
      return res.status(403).json({
        ok: false,
        message: 'Esta lección está bloqueada. Completa primero la lección anterior.'
      });
    }

    const resultado = await pool.query(
      `SELECT
        l.id_leccion,
        l.id_modulo,
        l.id_tipo_video,
        tv.nombre_tipo_video,
        m.titulo AS modulo_titulo,
        m.numero_orden AS modulo_orden,
        l.titulo,
        l.numero_orden,
        l.texto_descriptivo,
        l.url_video,
        l.duracion_segundos,
        l.esta_activa,
        COALESCE(pl.completada, FALSE) AS completada,
        pl.fecha_completada
       FROM edutech.leccion l
       INNER JOIN edutech.modulo m
        ON l.id_modulo = m.id_modulo
       INNER JOIN edutech.tipo_video tv
        ON l.id_tipo_video = tv.id_tipo_video
       INNER JOIN edutech.curso c
        ON m.id_curso = c.id_curso
       INNER JOIN edutech.orden_detalle od
        ON od.id_curso = c.id_curso
       INNER JOIN edutech.inscripcion i
        ON i.id_orden_detalle = od.id_orden_detalle
       INNER JOIN edutech.orden o
        ON od.id_orden = o.id_orden
       LEFT JOIN edutech.progreso_leccion pl
        ON pl.id_inscripcion = i.id_inscripcion
        AND pl.id_leccion = l.id_leccion
       WHERE i.id_inscripcion = $1
        AND o.id_usuario = $2
        AND l.id_leccion = $3
        AND l.esta_activa = TRUE
       LIMIT 1`,
      [idInscripcion, idUsuario, idLeccion]
    );

    const leccion = resultado.rows[0];

    if (!leccion) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el contenido de la lección.'
      });
    }

    const recursosResultado = await pool.query(
      `SELECT
        lr.id_leccion,
        r.id_recurso,
        tr.nombre_tipo_recurso,
        r.titulo,
        r.descripcion,
        r.url_recurso,
        lr.numero_orden
       FROM edutech.leccion_recurso lr
       INNER JOIN edutech.recurso r
        ON lr.id_recurso = r.id_recurso
       INNER JOIN edutech.tipo_recurso tr
        ON r.id_tipo_recurso = tr.id_tipo_recurso
       WHERE lr.id_leccion = $1
       ORDER BY lr.numero_orden ASC`,
      [idLeccion]
    );

    res.json({
      ok: true,
      leccion: {
        ...leccion,
        puede_acceder: true,
        bloqueada: false,
        recursos: recursosResultado.rows
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el contenido de la lección.',
      error: error.message
    });
  }
};

const marcarLeccionCompletada = async (req, res) => {
  try {
    const { idInscripcion, idLeccion } = req.params;
    const idUsuario = req.body && req.body.id_usuario ? Number(req.body.id_usuario) : null;

    const validacionResultado = await pool.query(
      `SELECT
        i.id_inscripcion,
        c.id_curso,
        l.id_leccion,
        m.numero_orden AS numero_modulo,
        l.numero_orden AS numero_leccion
       FROM edutech.inscripcion i
       INNER JOIN edutech.orden_detalle od
        ON i.id_orden_detalle = od.id_orden_detalle
       INNER JOIN edutech.orden o
        ON od.id_orden = o.id_orden
       INNER JOIN edutech.curso c
        ON od.id_curso = c.id_curso
       INNER JOIN edutech.modulo m
        ON c.id_curso = m.id_curso
       INNER JOIN edutech.leccion l
        ON m.id_modulo = l.id_modulo
       WHERE i.id_inscripcion = $1
        AND l.id_leccion = $2
        AND l.esta_activa = TRUE
        AND ($3::integer IS NULL OR o.id_usuario = $3)`,
      [idInscripcion, idLeccion, idUsuario]
    );

    if (validacionResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'La lección no pertenece a esta inscripción o no está activa.'
      });
    }

    const leccionActual = validacionResultado.rows[0];

    const bloqueoResultado = await pool.query(
      `SELECT
        COUNT(DISTINCT l_prev.id_leccion)::int AS total_anteriores,
        COUNT(DISTINCT CASE WHEN pl_prev.completada = TRUE THEN l_prev.id_leccion END)::int AS anteriores_completadas
       FROM edutech.modulo m_prev
       INNER JOIN edutech.leccion l_prev
        ON l_prev.id_modulo = m_prev.id_modulo
       LEFT JOIN edutech.progreso_leccion pl_prev
        ON pl_prev.id_leccion = l_prev.id_leccion
       AND pl_prev.id_inscripcion = $1
       WHERE m_prev.id_curso = $2
        AND l_prev.esta_activa = TRUE
        AND (
          m_prev.numero_orden < $3
          OR (m_prev.numero_orden = $3 AND l_prev.numero_orden < $4)
        )`,
      [
        idInscripcion,
        leccionActual.id_curso,
        leccionActual.numero_modulo,
        leccionActual.numero_leccion
      ]
    );

    const bloqueo = bloqueoResultado.rows[0] || { total_anteriores: 0, anteriores_completadas: 0 };

    if (Number(bloqueo.anteriores_completadas) < Number(bloqueo.total_anteriores)) {
      return res.status(409).json({
        ok: false,
        message: 'Debes completar las lecciones anteriores antes de avanzar.'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO edutech.progreso_leccion
        (id_inscripcion, id_leccion, completada, fecha_completada)
       VALUES
        ($1, $2, TRUE, CURRENT_TIMESTAMP)
       ON CONFLICT (id_inscripcion, id_leccion)
       DO UPDATE SET
        completada = TRUE,
        fecha_completada = CURRENT_TIMESTAMP
       RETURNING
        id_inscripcion,
        id_leccion,
        completada,
        fecha_completada`,
      [idInscripcion, idLeccion]
    );

    const resumenResultado = await pool.query(
      `SELECT
        COUNT(DISTINCT l.id_leccion)::int AS total_lecciones,
        COUNT(DISTINCT CASE WHEN pl.completada = TRUE THEN l.id_leccion END)::int AS lecciones_completadas,
        COALESCE(
          ROUND(
            (
              COUNT(DISTINCT CASE WHEN pl.completada = TRUE THEN l.id_leccion END)::numeric
              / NULLIF(COUNT(DISTINCT l.id_leccion), 0)
            ) * 100,
            2
          ),
          0
        ) AS porcentaje_avance
       FROM edutech.inscripcion i
       INNER JOIN edutech.orden_detalle od
        ON i.id_orden_detalle = od.id_orden_detalle
       INNER JOIN edutech.modulo m
        ON m.id_curso = od.id_curso
       INNER JOIN edutech.leccion l
        ON l.id_modulo = m.id_modulo
       LEFT JOIN edutech.progreso_leccion pl
        ON pl.id_inscripcion = i.id_inscripcion
       AND pl.id_leccion = l.id_leccion
       WHERE i.id_inscripcion = $1
        AND l.esta_activa = TRUE`,
      [idInscripcion]
    );

    res.json({
      ok: true,
      message: 'Lección marcada como completada.',
      progreso: resultado.rows[0],
      resumen: resumenResultado.rows[0] || {
        total_lecciones: 0,
        lecciones_completadas: 0,
        porcentaje_avance: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al marcar la lección como completada.',
      error: error.message
    });
  }
};

module.exports = {
  obtenerMisCursos,
  obtenerCursoInscritoDetalle,
  obtenerContenidoLeccionInscrita,
  marcarLeccionCompletada
};