const pool = require('../config/db');

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
        c.id_curso,
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
       INNER JOIN edutech.curso c
        ON od.id_curso = c.id_curso
       INNER JOIN edutech.usuario instructor
        ON c.id_usuario = instructor.id_usuario
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
        c.id_curso,
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
        c.id_curso,
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
        l.titulo,
        l.numero_orden,
        l.texto_descriptivo,
        l.url_video,
        l.duracion_segundos,
        l.esta_activa,
        COALESCE(pl.completada, FALSE) AS completada,
        pl.fecha_completada
       FROM edutech.leccion l
       INNER JOIN edutech.tipo_video tv
        ON l.id_tipo_video = tv.id_tipo_video
       LEFT JOIN edutech.progreso_leccion pl
        ON pl.id_leccion = l.id_leccion
       AND pl.id_inscripcion = $1
       WHERE l.id_modulo IN (
        SELECT id_modulo
        FROM edutech.modulo
        WHERE id_curso = $2
       )
       ORDER BY l.id_modulo ASC, l.numero_orden ASC`,
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

    const modulos = modulosResultado.rows.map((modulo) => {
      const lecciones = leccionesResultado.rows
        .filter((leccion) => leccion.id_modulo === modulo.id_modulo)
        .map((leccion) => {
          const recursos = recursosResultado.rows.filter(
            (recurso) => recurso.id_leccion === leccion.id_leccion
          );

          return {
            ...leccion,
            recursos
          };
        });

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

const marcarLeccionCompletada = async (req, res) => {
  try {
    const { idInscripcion, idLeccion } = req.params;

    const validacionResultado = await pool.query(
      `SELECT
        i.id_inscripcion,
        l.id_leccion
       FROM edutech.inscripcion i
       INNER JOIN edutech.orden_detalle od
        ON i.id_orden_detalle = od.id_orden_detalle
       INNER JOIN edutech.curso c
        ON od.id_curso = c.id_curso
       INNER JOIN edutech.modulo m
        ON c.id_curso = m.id_curso
       INNER JOIN edutech.leccion l
        ON m.id_modulo = l.id_modulo
       WHERE i.id_inscripcion = $1
        AND l.id_leccion = $2
        AND l.esta_activa = TRUE`,
      [idInscripcion, idLeccion]
    );

    if (validacionResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'La lección no pertenece a esta inscripción o no está activa.'
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

    res.json({
      ok: true,
      message: 'Lección marcada como completada.',
      progreso: resultado.rows[0]
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
  marcarLeccionCompletada
};