const pool = require('../config/db');

const obtenerIdCatalogo = async (client, tabla, columnaId, columnaNombre, valor) => {
  const resultado = await client.query(
    `SELECT ${columnaId} AS id
     FROM edutech.${tabla}
     WHERE LOWER(${columnaNombre}) = LOWER($1)`,
    [valor]
  );

  if (resultado.rows.length === 0) {
    throw new Error(`No existe el valor "${valor}" en el catálogo ${tabla}.`);
  }

  return resultado.rows[0].id;
};

const generarNumeroOrden = () => {
  return `ORD-${Date.now()}`;
};

const crearOrden = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id_usuario,
      cursos,
      datos_compra
    } = req.body;

    if (!id_usuario || !Array.isArray(cursos) || cursos.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar id_usuario y un arreglo de cursos.'
      });
    }

    const cursosUnicos = [...new Set(cursos.map(Number))];

    if (cursosUnicos.length !== cursos.length) {
      return res.status(400).json({
        ok: false,
        message: 'No puedes repetir el mismo curso en una orden.'
      });
    }

    if (!datos_compra) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar datos_compra.'
      });
    }

    const {
      nombre_contacto,
      apellido_paterno_contacto,
      apellido_materno_contacto,
      correo_contacto,
      telefono_contacto,
      direccion,
      id_ciudad,
      codigo_postal
    } = datos_compra;

    if (!nombre_contacto || !apellido_paterno_contacto || !correo_contacto || !telefono_contacto) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan datos obligatorios de compra.'
      });
    }

    if (!/^[0-9]{10}$/.test(telefono_contacto)) {
      return res.status(400).json({
        ok: false,
        message: 'El teléfono de contacto debe tener exactamente 10 dígitos.'
      });
    }

    if (codigo_postal && !/^[0-9]{5}$/.test(codigo_postal)) {
      return res.status(400).json({
        ok: false,
        message: 'El código postal debe tener exactamente 5 dígitos.'
      });
    }

    await client.query('BEGIN');

    const usuarioExiste = await client.query(
      'SELECT id_usuario FROM edutech.usuario WHERE id_usuario = $1',
      [id_usuario]
    );

    if (usuarioExiste.rows.length === 0) {
      throw new Error('El usuario indicado no existe.');
    }

    const cursosResultado = await client.query(
      `SELECT
        c.id_curso,
        c.titulo,
        c.precio_mxn,
        ec.nombre_estado_curso
       FROM edutech.curso c
       INNER JOIN edutech.estado_curso ec
        ON c.id_estado_curso = ec.id_estado_curso
       WHERE c.id_curso = ANY($1::int[])`,
      [cursosUnicos]
    );

    if (cursosResultado.rows.length !== cursosUnicos.length) {
      throw new Error('Uno o más cursos no existen.');
    }

    const cursosNoPublicados = cursosResultado.rows.filter(
      curso => curso.nombre_estado_curso.toLowerCase() !== 'publicado'
    );

    if (cursosNoPublicados.length > 0) {
      throw new Error('Solo se pueden comprar cursos publicados.');
    }

    const cursosYaComprados = await client.query(
      `SELECT
        c.id_curso,
        c.titulo
       FROM edutech.inscripcion i
       INNER JOIN edutech.orden_detalle od
        ON od.id_orden_detalle = i.id_orden_detalle
       INNER JOIN edutech.orden o
        ON o.id_orden = od.id_orden
       INNER JOIN edutech.curso c
        ON c.id_curso = od.id_curso
       INNER JOIN edutech.estado_inscripcion ei
        ON ei.id_estado_inscripcion = i.id_estado_inscripcion
       WHERE o.id_usuario = $1
        AND od.id_curso = ANY($2::int[])
        AND LOWER(ei.nombre_estado_inscripcion) = LOWER('activa')`,
      [id_usuario, cursosUnicos]
    );

    if (cursosYaComprados.rows.length > 0) {
      throw new Error(`Ya tienes comprado el curso: ${cursosYaComprados.rows[0].titulo}.`);
    }

    const idMonedaMxn = await obtenerIdCatalogo(
      client,
      'moneda',
      'id_moneda',
      'codigo_moneda',
      'MXN'
    );

    const idEstadoOrdenPendiente = await obtenerIdCatalogo(
      client,
      'estado_orden',
      'id_estado_orden',
      'nombre_estado_orden',
      'pendiente'
    );

    const total = cursosResultado.rows.reduce(
      (suma, curso) => suma + Number(curso.precio_mxn),
      0
    );

    const numeroOrden = generarNumeroOrden();

    const ordenResultado = await client.query(
      `INSERT INTO edutech.orden
        (numero_orden, id_usuario, id_moneda, id_estado_orden, total)
       VALUES
        ($1, $2, $3, $4, $5)
       RETURNING
        id_orden,
        numero_orden,
        id_usuario,
        id_moneda,
        id_estado_orden,
        total,
        fecha_creacion`,
      [
        numeroOrden,
        id_usuario,
        idMonedaMxn,
        idEstadoOrdenPendiente,
        total
      ]
    );

    const orden = ordenResultado.rows[0];

    const detalles = [];

    for (const curso of cursosResultado.rows) {
      const detalleResultado = await client.query(
        `INSERT INTO edutech.orden_detalle
          (id_orden, id_curso, precio_unitario)
         VALUES
          ($1, $2, $3)
         RETURNING
          id_orden_detalle,
          id_orden,
          id_curso,
          precio_unitario`,
        [
          orden.id_orden,
          curso.id_curso,
          curso.precio_mxn
        ]
      );

      detalles.push({
        ...detalleResultado.rows[0],
        titulo: curso.titulo
      });
    }

    await client.query(
      `INSERT INTO edutech.datos_compra
        (id_orden, nombre_contacto, apellido_paterno_contacto, apellido_materno_contacto,
         correo_contacto, telefono_contacto, direccion, id_ciudad, codigo_postal)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        orden.id_orden,
        nombre_contacto,
        apellido_paterno_contacto,
        apellido_materno_contacto || null,
        correo_contacto,
        telefono_contacto,
        direccion || null,
        id_ciudad || null,
        codigo_postal || null
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      message: 'Orden creada correctamente.',
      orden,
      detalles
    });
  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al crear la orden.',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const pagarOrdenSimulada = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const ordenResultado = await client.query(
      `SELECT
        id_orden,
        numero_orden,
        id_usuario,
        total
       FROM edutech.orden
       WHERE id_orden = $1`,
      [id]
    );

    if (ordenResultado.rows.length === 0) {
      await client.query('ROLLBACK');

      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada.'
      });
    }

    const orden = ordenResultado.rows[0];

    const pagoExistente = await client.query(
      `SELECT id_pago
       FROM edutech.pago
       WHERE id_orden = $1
        AND id_estado_pago = (
          SELECT id_estado_pago
          FROM edutech.estado_pago
          WHERE LOWER(nombre_estado_pago) = LOWER('aprobado')
        )`,
      [orden.id_orden]
    );

    if (pagoExistente.rows.length > 0) {
      await client.query('ROLLBACK');

      return res.status(409).json({
        ok: false,
        message: 'Esta orden ya tiene un pago aprobado.'
      });
    }

    const idProveedorPayPal = await obtenerIdCatalogo(
      client,
      'proveedor_pago',
      'id_proveedor_pago',
      'nombre_proveedor',
      'PayPal'
    );

    const idEstadoPagoAprobado = await obtenerIdCatalogo(
      client,
      'estado_pago',
      'id_estado_pago',
      'nombre_estado_pago',
      'aprobado'
    );

    const idEstadoOrdenCompletada = await obtenerIdCatalogo(
      client,
      'estado_orden',
      'id_estado_orden',
      'nombre_estado_orden',
      'completada'
    );

    const idEstadoWebhookProcesado = await obtenerIdCatalogo(
      client,
      'estado_webhook',
      'id_estado_webhook',
      'nombre_estado_webhook',
      'procesado'
    );

    const idEstadoInscripcionActiva = await obtenerIdCatalogo(
      client,
      'estado_inscripcion',
      'id_estado_inscripcion',
      'nombre_estado_inscripcion',
      'activa'
    );

    const pagoExterno = `PAYPAL-SIM-${Date.now()}`;

    const pagoResultado = await client.query(
      `INSERT INTO edutech.pago
        (id_orden, id_proveedor_pago, id_estado_pago, id_pago_externo, monto_pagado, fecha_pago)
       VALUES
        ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING
        id_pago,
        id_orden,
        id_proveedor_pago,
        id_estado_pago,
        id_pago_externo,
        monto_pagado,
        fecha_pago`,
      [
        orden.id_orden,
        idProveedorPayPal,
        idEstadoPagoAprobado,
        pagoExterno,
        orden.total
      ]
    );

    const pago = pagoResultado.rows[0];

    await client.query(
      `INSERT INTO edutech.webhook_pago
        (id_pago, id_estado_webhook, tipo_evento, id_evento_externo, contenido_evento)
       VALUES
        ($1, $2, $3, $4, $5::jsonb)`,
      [
        pago.id_pago,
        idEstadoWebhookProcesado,
        'PAYMENT.CAPTURE.COMPLETED',
        `WH-SIM-${Date.now()}`,
        JSON.stringify({
          status: 'COMPLETED',
          provider: 'PayPal',
          id_orden: orden.id_orden
        })
      ]
    );

    await client.query(
      `UPDATE edutech.orden
       SET id_estado_orden = $1
       WHERE id_orden = $2`,
      [
        idEstadoOrdenCompletada,
        orden.id_orden
      ]
    );

    const detallesResultado = await client.query(
      `SELECT id_orden_detalle
       FROM edutech.orden_detalle
       WHERE id_orden = $1
       ORDER BY id_orden_detalle ASC`,
      [orden.id_orden]
    );

    const inscripciones = [];

    for (const detalle of detallesResultado.rows) {
      const inscripcionExistente = await client.query(
        `SELECT id_inscripcion
         FROM edutech.inscripcion
         WHERE id_orden_detalle = $1`,
        [detalle.id_orden_detalle]
      );

      if (inscripcionExistente.rows.length === 0) {
        const inscripcionResultado = await client.query(
          `INSERT INTO edutech.inscripcion
            (id_orden_detalle, id_estado_inscripcion)
           VALUES
            ($1, $2)
           RETURNING
            id_inscripcion,
            id_orden_detalle,
            id_estado_inscripcion,
            fecha_inscripcion`,
          [
            detalle.id_orden_detalle,
            idEstadoInscripcionActiva
          ]
        );

        inscripciones.push(inscripcionResultado.rows[0]);
      }
    }

    await client.query('COMMIT');

    res.json({
      ok: true,
      message: 'Pago simulado aprobado. Inscripciones generadas correctamente.',
      pago,
      inscripciones
    });
  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al simular el pago.',
      error: error.message
    });
  } finally {
    client.release();
  }
};


const procesarWebhookPagoSandbox = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id_orden,
      proveedor = 'PayPal',
      tipo_evento = 'PAYMENT.CAPTURE.COMPLETED',
      id_evento_externo,
      id_pago_externo,
      monto_pagado,
      contenido_evento
    } = req.body || {};

    const idOrden = Number(id_orden);

    if (!Number.isInteger(idOrden) || idOrden <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'El webhook debe indicar un id_orden válido.'
      });
    }

    const eventoExterno = id_evento_externo || `WH-PAYPAL-SANDBOX-${Date.now()}`;
    const pagoExterno = id_pago_externo || `PAYPAL-SANDBOX-${Date.now()}`;

    await client.query('BEGIN');

    const webhookExistente = await client.query(
      `SELECT wp.id_webhook, wp.id_pago
       FROM edutech.webhook_pago wp
       WHERE wp.id_evento_externo = $1`,
      [eventoExterno]
    );

    if (webhookExistente.rows.length > 0) {
      await client.query('COMMIT');

      return res.json({
        ok: true,
        message: 'Webhook ya procesado anteriormente.',
        webhook: webhookExistente.rows[0],
        duplicado: true
      });
    }

    const ordenResultado = await client.query(
      `SELECT
        o.id_orden,
        o.numero_orden,
        o.id_usuario,
        o.total,
        eo.nombre_estado_orden
       FROM edutech.orden o
       INNER JOIN edutech.estado_orden eo
        ON eo.id_estado_orden = o.id_estado_orden
       WHERE o.id_orden = $1
       FOR UPDATE`,
      [idOrden]
    );

    if (ordenResultado.rows.length === 0) {
      await client.query('ROLLBACK');

      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada para procesar el webhook.'
      });
    }

    const orden = ordenResultado.rows[0];
    const montoOrden = Number(orden.total);
    const montoWebhook = monto_pagado === undefined || monto_pagado === null || monto_pagado === ''
      ? montoOrden
      : Number(monto_pagado);

    if (!Number.isFinite(montoWebhook) || Number(montoWebhook.toFixed(2)) !== Number(montoOrden.toFixed(2))) {
      await client.query('ROLLBACK');

      return res.status(400).json({
        ok: false,
        message: 'El monto del webhook no coincide con el total de la orden.'
      });
    }

    const pagoAprobadoExistente = await client.query(
      `SELECT id_pago, fecha_pago
       FROM edutech.pago
       WHERE id_orden = $1
        AND id_estado_pago = (
          SELECT id_estado_pago
          FROM edutech.estado_pago
          WHERE LOWER(nombre_estado_pago) = LOWER('aprobado')
          LIMIT 1
        )
       ORDER BY id_pago DESC
       LIMIT 1`,
      [idOrden]
    );

    if (pagoAprobadoExistente.rows.length > 0) {
      await client.query('COMMIT');

      return res.json({
        ok: true,
        message: 'La orden ya tenía un pago aprobado. No se duplicaron inscripciones.',
        pago: pagoAprobadoExistente.rows[0],
        inscripciones: [],
        orden,
        duplicado: true
      });
    }

    const idProveedor = await obtenerIdCatalogo(
      client,
      'proveedor_pago',
      'id_proveedor_pago',
      'nombre_proveedor',
      proveedor
    );

    const idEstadoPagoAprobado = await obtenerIdCatalogo(
      client,
      'estado_pago',
      'id_estado_pago',
      'nombre_estado_pago',
      'aprobado'
    );

    const idEstadoOrdenCompletada = await obtenerIdCatalogo(
      client,
      'estado_orden',
      'id_estado_orden',
      'nombre_estado_orden',
      'completada'
    );

    const idEstadoWebhookProcesado = await obtenerIdCatalogo(
      client,
      'estado_webhook',
      'id_estado_webhook',
      'nombre_estado_webhook',
      'procesado'
    );

    const idEstadoInscripcionActiva = await obtenerIdCatalogo(
      client,
      'estado_inscripcion',
      'id_estado_inscripcion',
      'nombre_estado_inscripcion',
      'activa'
    );

    const pagoResultado = await client.query(
      `INSERT INTO edutech.pago
        (id_orden, id_proveedor_pago, id_estado_pago, id_pago_externo, monto_pagado, fecha_pago)
       VALUES
        ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING
        id_pago,
        id_orden,
        id_proveedor_pago,
        id_estado_pago,
        id_pago_externo,
        monto_pagado,
        fecha_pago`,
      [
        idOrden,
        idProveedor,
        idEstadoPagoAprobado,
        pagoExterno,
        montoOrden
      ]
    );

    const pago = pagoResultado.rows[0];

    const contenidoFinal = contenido_evento && typeof contenido_evento === 'object'
      ? contenido_evento
      : {
        status: 'COMPLETED',
        provider: proveedor,
        id_orden: idOrden,
        sandbox: true
      };

    const webhookResultado = await client.query(
      `INSERT INTO edutech.webhook_pago
        (id_pago, id_estado_webhook, tipo_evento, id_evento_externo, contenido_evento)
       VALUES
        ($1, $2, $3, $4, $5::jsonb)
       RETURNING
        id_webhook,
        id_pago,
        id_estado_webhook,
        tipo_evento,
        id_evento_externo,
        fecha_recibido`,
      [
        pago.id_pago,
        idEstadoWebhookProcesado,
        tipo_evento,
        eventoExterno,
        JSON.stringify(contenidoFinal)
      ]
    );

    await client.query(
      `UPDATE edutech.orden
       SET id_estado_orden = $1,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_orden = $2`,
      [idEstadoOrdenCompletada, idOrden]
    );

    const detallesResultado = await client.query(
      `SELECT
        od.id_orden_detalle,
        od.id_curso,
        c.titulo
       FROM edutech.orden_detalle od
       INNER JOIN edutech.curso c
        ON c.id_curso = od.id_curso
       WHERE od.id_orden = $1
       ORDER BY od.id_orden_detalle ASC`,
      [idOrden]
    );

    const inscripciones = [];

    for (const detalle of detallesResultado.rows) {
      const inscripcionExistente = await client.query(
        `SELECT id_inscripcion, fecha_inscripcion
         FROM edutech.inscripcion
         WHERE id_orden_detalle = $1`,
        [detalle.id_orden_detalle]
      );

      if (inscripcionExistente.rows.length > 0) {
        inscripciones.push({
          ...inscripcionExistente.rows[0],
          id_orden_detalle: detalle.id_orden_detalle,
          id_curso: detalle.id_curso,
          titulo: detalle.titulo,
          existente: true
        });
        continue;
      }

      const inscripcionResultado = await client.query(
        `INSERT INTO edutech.inscripcion
          (id_orden_detalle, id_estado_inscripcion)
         VALUES
          ($1, $2)
         RETURNING
          id_inscripcion,
          id_orden_detalle,
          id_estado_inscripcion,
          fecha_inscripcion`,
        [detalle.id_orden_detalle, idEstadoInscripcionActiva]
      );

      inscripciones.push({
        ...inscripcionResultado.rows[0],
        id_curso: detalle.id_curso,
        titulo: detalle.titulo,
        existente: false
      });
    }

    await client.query('COMMIT');

    res.json({
      ok: true,
      message: 'Webhook PayPal Sandbox procesado. Curso liberado correctamente.',
      orden: {
        ...orden,
        nombre_estado_orden: 'completada'
      },
      pago,
      webhook: webhookResultado.rows[0],
      inscripciones
    });
  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al procesar el webhook de pago sandbox.',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  crearOrden,
  pagarOrdenSimulada,
  procesarWebhookPagoSandbox
};