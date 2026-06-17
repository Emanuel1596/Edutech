const pool = require('../config/db');

const obtenerCamposCurso = () => `
  SELECT
    c.id_curso,
    c.id_usuario,
    c.id_nivel_curso,
    nc.nombre_nivel,
    c.id_estado_curso,
    ec.nombre_estado_curso,
    c.titulo,
    c.descripcion,
    c.imagen_portada,
    c.precio_mxn,
    c.fecha_creacion,
    c.fecha_actualizacion,
    u.nombre AS nombre_instructor,
    u.apellido_paterno AS apellido_paterno_instructor,
    u.foto_perfil_url AS foto_perfil_instructor,
    COALESCE((
      SELECT COUNT(l.id_leccion)::int
      FROM edutech.modulo m
      INNER JOIN edutech.leccion l
        ON l.id_modulo = m.id_modulo
      WHERE m.id_curso = c.id_curso
        AND l.esta_activa = TRUE
    ), 0) AS total_lecciones,
    COALESCE((
      SELECT json_agg(
        json_build_object(
          'id_categoria', ca.id_categoria,
          'nombre_categoria', ca.nombre_categoria
        )
        ORDER BY ca.nombre_categoria
      )
      FROM edutech.curso_categoria cc
      INNER JOIN edutech.categoria ca
        ON ca.id_categoria = cc.id_categoria
      WHERE cc.id_curso = c.id_curso
        AND ca.esta_activa = TRUE
    ), '[]'::json) AS categorias
  FROM edutech.curso c
  INNER JOIN edutech.usuario u
    ON c.id_usuario = u.id_usuario
  INNER JOIN edutech.nivel_curso nc
    ON c.id_nivel_curso = nc.id_nivel_curso
  INNER JOIN edutech.estado_curso ec
    ON c.id_estado_curso = ec.id_estado_curso
`;

const obtenerCursos = async (req, res) => {
  try {
    const resultado = await pool.query(
      `${obtenerCamposCurso()}
       WHERE LOWER(ec.nombre_estado_curso) = LOWER('publicado')
       ORDER BY c.id_curso ASC`
    );

    res.json({
      ok: true,
      total: resultado.rows.length,
      cursos: resultado.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener cursos.',
      error: error.message
    });
  }
};

const obtenerModulosPorCurso = async (idCurso) => {
  const resultado = await pool.query(
    `SELECT
      m.id_modulo,
      m.id_curso,
      m.titulo,
      m.numero_orden,
      COALESCE(
        json_agg(
          json_build_object(
            'id_leccion', l.id_leccion,
            'titulo', l.titulo,
            'numero_orden', l.numero_orden,
            'texto_descriptivo', l.texto_descriptivo,
            'duracion_segundos', l.duracion_segundos
          )
          ORDER BY l.numero_orden
        ) FILTER (WHERE l.id_leccion IS NOT NULL),
        '[]'::json
      ) AS lecciones
     FROM edutech.modulo m
     LEFT JOIN edutech.leccion l
      ON l.id_modulo = m.id_modulo
      AND l.esta_activa = TRUE
     WHERE m.id_curso = $1
     GROUP BY m.id_modulo, m.id_curso, m.titulo, m.numero_orden
     ORDER BY m.numero_orden ASC`,
    [idCurso]
  );

  return resultado.rows;
};

const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `${obtenerCamposCurso()}
       WHERE c.id_curso = $1
        AND LOWER(ec.nombre_estado_curso) = LOWER('publicado')`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado.'
      });
    }

    const curso = resultado.rows[0];
    curso.modulos = await obtenerModulosPorCurso(id);

    res.json({
      ok: true,
      curso
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el curso.',
      error: error.message
    });
  }
};

module.exports = {
  obtenerCursos,
  obtenerCursoPorId
};
