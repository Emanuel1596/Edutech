const pool = require('../config/db');

const obtenerCursos = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT
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
        u.apellido_paterno AS apellido_paterno_instructor
       FROM edutech.curso c
       INNER JOIN edutech.usuario u
        ON c.id_usuario = u.id_usuario
       INNER JOIN edutech.nivel_curso nc
        ON c.id_nivel_curso = nc.id_nivel_curso
       INNER JOIN edutech.estado_curso ec
        ON c.id_estado_curso = ec.id_estado_curso
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

const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT
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
        u.apellido_paterno AS apellido_paterno_instructor
       FROM edutech.curso c
       INNER JOIN edutech.usuario u
        ON c.id_usuario = u.id_usuario
       INNER JOIN edutech.nivel_curso nc
        ON c.id_nivel_curso = nc.id_nivel_curso
       INNER JOIN edutech.estado_curso ec
        ON c.id_estado_curso = ec.id_estado_curso
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

    res.json({
      ok: true,
      curso: resultado.rows[0]
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