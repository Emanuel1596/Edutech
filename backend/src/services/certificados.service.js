const normalizarCodigoCertificado = (valor) => String(valor || '').trim();

const generarCodigoCertificado = (idInscripcion, fecha = new Date()) => {
  const anio = fecha instanceof Date && !Number.isNaN(fecha.getTime())
    ? fecha.getFullYear()
    : new Date().getFullYear();

  return `EDU-${anio}-${String(idInscripcion).padStart(6, '0')}`.slice(0, 20);
};

const generarUrlCertificado = (codigo) => {
  const codigoNormalizado = normalizarCodigoCertificado(codigo);
  return `certificado.html?codigo=${encodeURIComponent(codigoNormalizado)}`;
};

const obtenerCertificadoPorInscripcion = async (cliente, idInscripcion) => {
  const resultado = await cliente.query(
    `SELECT
      id_certificado,
      id_inscripcion,
      TRIM(codigo_certificado) AS codigo_certificado,
      fecha_emision,
      url_certificado
     FROM edutech.certificado
     WHERE id_inscripcion = $1
     LIMIT 1`,
    [idInscripcion]
  );

  return resultado.rows[0] || null;
};

const crearCertificadoInscripcion = async (cliente, idInscripcion) => {
  const existente = await obtenerCertificadoPorInscripcion(cliente, idInscripcion);

  if (existente) {
    return existente;
  }

  const codigo = generarCodigoCertificado(idInscripcion);
  const url = generarUrlCertificado(codigo);

  const resultado = await cliente.query(
    `INSERT INTO edutech.certificado
      (id_inscripcion, codigo_certificado, url_certificado)
     VALUES ($1, $2, $3)
     ON CONFLICT (id_inscripcion)
     DO NOTHING
     RETURNING
      id_certificado,
      id_inscripcion,
      TRIM(codigo_certificado) AS codigo_certificado,
      fecha_emision,
      url_certificado`,
    [idInscripcion, codigo, url]
  );

  if (resultado.rows[0]) {
    return resultado.rows[0];
  }

  return obtenerCertificadoPorInscripcion(cliente, idInscripcion);
};

const generarCertificadoAprobacion = async (cliente, idInscripcion) => {
  const validacion = await cliente.query(
    `SELECT 1
     FROM edutech.intento_examen
     WHERE id_inscripcion = $1
      AND aprobado = TRUE
     LIMIT 1`,
    [idInscripcion]
  );

  if (validacion.rows.length === 0) {
    return null;
  }

  return crearCertificadoInscripcion(cliente, idInscripcion);
};

const sincronizarCertificadosAprobadosUsuario = async (cliente, idUsuario) => {
  const resultado = await cliente.query(
    `SELECT DISTINCT ie.id_inscripcion
     FROM edutech.intento_examen ie
     INNER JOIN edutech.inscripcion i
      ON ie.id_inscripcion = i.id_inscripcion
     INNER JOIN edutech.orden_detalle od
      ON i.id_orden_detalle = od.id_orden_detalle
     INNER JOIN edutech.orden o
      ON od.id_orden = o.id_orden
     WHERE o.id_usuario = $1
      AND ie.aprobado = TRUE
     ORDER BY ie.id_inscripcion ASC`,
    [idUsuario]
  );

  const certificados = [];

  for (const fila of resultado.rows) {
    const certificado = await crearCertificadoInscripcion(cliente, fila.id_inscripcion);

    if (certificado) {
      certificados.push(certificado);
    }
  }

  return certificados;
};

module.exports = {
  generarCertificadoAprobacion,
  sincronizarCertificadosAprobadosUsuario,
  normalizarCodigoCertificado
};
