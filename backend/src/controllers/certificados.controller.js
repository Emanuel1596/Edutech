const pool = require('../config/db');
const {
  sincronizarCertificadosAprobadosUsuario,
  normalizarCodigoCertificado
} = require('../services/certificados.service');

const consultaCertificadosBase = `
  SELECT
    cert.id_certificado,
    cert.id_inscripcion,
    TRIM(cert.codigo_certificado) AS codigo_certificado,
    cert.fecha_emision,
    cert.url_certificado,
    i.fecha_inscripcion,
    i.fecha_finalizacion,
    ei.nombre_estado_inscripcion,
    alumno.id_usuario,
    alumno.nombre AS nombre_alumno,
    alumno.apellido_paterno AS apellido_paterno_alumno,
    alumno.apellido_materno AS apellido_materno_alumno,
    c.id_curso,
    c.titulo AS titulo_curso,
    c.descripcion AS descripcion_curso,
    c.imagen_portada,
    instructor.nombre AS nombre_instructor,
    instructor.apellido_paterno AS apellido_paterno_instructor,
    intento.id_intento,
    intento.numero_intento,
    intento.fecha_fin AS fecha_aprobacion,
    intento.calificacion
  FROM edutech.certificado cert
  INNER JOIN edutech.inscripcion i
   ON cert.id_inscripcion = i.id_inscripcion
  INNER JOIN edutech.estado_inscripcion ei
   ON i.id_estado_inscripcion = ei.id_estado_inscripcion
  INNER JOIN edutech.orden_detalle od
   ON i.id_orden_detalle = od.id_orden_detalle
  INNER JOIN edutech.orden o
   ON od.id_orden = o.id_orden
  INNER JOIN edutech.usuario alumno
   ON o.id_usuario = alumno.id_usuario
  INNER JOIN edutech.curso c
   ON od.id_curso = c.id_curso
  INNER JOIN edutech.usuario instructor
   ON c.id_usuario = instructor.id_usuario
  LEFT JOIN LATERAL (
    SELECT
      ie.id_intento,
      ie.numero_intento,
      ie.fecha_fin,
      ie.calificacion
    FROM edutech.intento_examen ie
    WHERE ie.id_inscripcion = i.id_inscripcion
     AND ie.aprobado = TRUE
    ORDER BY ie.numero_intento DESC
    LIMIT 1
  ) intento ON TRUE
`;

const mapearCertificado = (fila) => {
  const nombreAlumno = [
    fila.nombre_alumno,
    fila.apellido_paterno_alumno,
    fila.apellido_materno_alumno
  ].filter(Boolean).join(' ').trim();

  const nombreInstructor = [
    fila.nombre_instructor,
    fila.apellido_paterno_instructor
  ].filter(Boolean).join(' ').trim();

  return {
    id_certificado: fila.id_certificado,
    id_inscripcion: fila.id_inscripcion,
    codigo_certificado: fila.codigo_certificado,
    fecha_emision: fila.fecha_emision,
    url_certificado: fila.url_certificado,
    fecha_inscripcion: fila.fecha_inscripcion,
    fecha_finalizacion: fila.fecha_finalizacion,
    nombre_estado_inscripcion: fila.nombre_estado_inscripcion,
    id_usuario: fila.id_usuario,
    nombre_alumno: nombreAlumno || 'Alumno EduTech',
    id_curso: fila.id_curso,
    titulo_curso: fila.titulo_curso,
    descripcion_curso: fila.descripcion_curso,
    imagen_portada: fila.imagen_portada,
    nombre_instructor: nombreInstructor || 'Instructor EduTech',
    id_intento: fila.id_intento,
    numero_intento: fila.numero_intento,
    fecha_aprobacion: fila.fecha_aprobacion,
    calificacion: fila.calificacion
  };
};

const obtenerCertificadosUsuario = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idUsuario } = req.params;

    await sincronizarCertificadosAprobadosUsuario(cliente, idUsuario);

    const resultado = await cliente.query(
      `${consultaCertificadosBase}
       WHERE alumno.id_usuario = $1
       ORDER BY cert.fecha_emision DESC, cert.id_certificado DESC`,
      [idUsuario]
    );

    res.json({
      ok: true,
      total: resultado.rows.length,
      certificados: resultado.rows.map(mapearCertificado)
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener certificados.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const obtenerCertificadoUsuario = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idUsuario, idCertificado } = req.params;

    await sincronizarCertificadosAprobadosUsuario(cliente, idUsuario);

    const resultado = await cliente.query(
      `${consultaCertificadosBase}
       WHERE alumno.id_usuario = $1
        AND cert.id_certificado = $2
       LIMIT 1`,
      [idUsuario, idCertificado]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el certificado solicitado.'
      });
    }

    res.json({
      ok: true,
      certificado: mapearCertificado(resultado.rows[0])
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el certificado.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const verificarCertificado = async (req, res) => {
  try {
    const codigo = normalizarCodigoCertificado(req.params.codigo);

    const resultado = await pool.query(
      `${consultaCertificadosBase}
       WHERE TRIM(cert.codigo_certificado) = $1
       LIMIT 1`,
      [codigo]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró un certificado con ese código.'
      });
    }

    res.json({
      ok: true,
      certificado: mapearCertificado(resultado.rows[0])
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al verificar el certificado.',
      error: error.message
    });
  }
};

module.exports = {
  obtenerCertificadosUsuario,
  obtenerCertificadoUsuario,
  verificarCertificado
};
