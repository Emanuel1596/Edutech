const pool = require('../config/db');

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

const normalizarTexto = (valor) => String(valor || '').trim();
const formatearMontoPayPal = (valor) => Number(valor || 0).toFixed(2);

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

const obtenerAccessTokenPayPal = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('Faltan PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en backend/.env.');
  }

  const credenciales = Buffer
    .from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
    .toString('base64');

  const respuesta = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credenciales}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || !datos.access_token) {
    throw new Error(datos.error_description || datos.error || 'PayPal no devolvió un access_token válido.');
  }

  return datos.access_token;
};

const obtenerOrdenInterna = async (client, idOrden) => {
  const resultado = await client.query(
    `SELECT
      o.id_orden,
      TRIM(o.numero_orden) AS numero_orden,
      o.id_usuario,
      o.total,
      eo.nombre_estado_orden
     FROM edutech.orden o
     INNER JOIN edutech.estado_orden eo
      ON eo.id_estado_orden = o.id_estado_orden
     WHERE o.id_orden = $1`,
    [idOrden]
  );

  return resultado.rows[0] || null;
};

const obtenerDetallesOrden = async (client, idOrden) => {
  const resultado = await client.query(
    `SELECT
      od.id_orden_detalle,
      od.id_curso,
      od.precio_unitario,
      c.titulo,
      COALESCE((
        SELECT COUNT(*)
        FROM edutech.leccion l
        INNER JOIN edutech.modulo m
          ON m.id_modulo = l.id_modulo
        WHERE m.id_curso = c.id_curso
          AND l.esta_activa = TRUE
      ), 0)::int AS total_lecciones,
      nc.nombre_nivel,
      u.nombre AS nombre_instructor,
      u.apellido_paterno AS apellido_paterno_instructor
     FROM edutech.orden_detalle od
     INNER JOIN edutech.curso c
      ON c.id_curso = od.id_curso
     LEFT JOIN edutech.nivel_curso nc
      ON nc.id_nivel_curso = c.id_nivel_curso
     LEFT JOIN edutech.usuario u
      ON u.id_usuario = c.id_usuario
     WHERE od.id_orden = $1
     ORDER BY od.id_orden_detalle ASC`,
    [idOrden]
  );

  return resultado.rows;
};

const construirCompraFrontend = (orden, detalles, pago, inscripciones) => {
  const primerDetalle = detalles[0] || {};
  const primeraInscripcion = inscripciones[0] || {};
  const instructor = [
    primerDetalle.nombre_instructor,
    primerDetalle.apellido_paterno_instructor
  ].filter(Boolean).join(' ').trim();

  return {
    id_curso: primerDetalle.id_curso || null,
    curso: primerDetalle.titulo || 'Curso EduTech',
    instructor: instructor || 'Instructor EduTech',
    nivel: primerDetalle.nombre_nivel || 'Curso disponible',
    nombre_nivel: primerDetalle.nombre_nivel || '',
    total_lecciones: primerDetalle.total_lecciones || 0,
    precio: `$${Number(primerDetalle.precio_unitario || orden.total || 0).toLocaleString('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })} MXN`,
    total: `$${Number(orden.total || 0).toLocaleString('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })} MXN`,
    id_orden: orden.id_orden,
    numero_orden: orden.numero_orden,
    id_pago: pago ? pago.id_pago : null,
    id_pago_externo: pago ? pago.id_pago_externo : null,
    id_inscripcion: primeraInscripcion.id_inscripcion || null,
    fecha_compra: pago && pago.fecha_pago ? pago.fecha_pago : new Date().toISOString(),
    fecha_pago: pago && pago.fecha_pago ? pago.fecha_pago : new Date().toISOString(),
    fecha_inscripcion: primeraInscripcion.fecha_inscripcion || (pago && pago.fecha_pago) || new Date().toISOString(),
    estatus: 'Aprobada',
    total_cursos: detalles.length,
    cursos: detalles.map((detalle, indice) => {
      const instructorDetalle = [
        detalle.nombre_instructor,
        detalle.apellido_paterno_instructor
      ].filter(Boolean).join(' ').trim();

      return {
        id_curso: detalle.id_curso,
        curso: detalle.titulo,
        titulo: detalle.titulo,
        instructor: instructorDetalle || 'Instructor EduTech',
        nombre_nivel: detalle.nombre_nivel || '',
        nivel: detalle.nombre_nivel || 'Curso disponible',
        total_lecciones: detalle.total_lecciones || 0,
        precio: detalle.precio_unitario,
        precio_mxn: detalle.precio_unitario,
        id_inscripcion: inscripciones[indice] ? inscripciones[indice].id_inscripcion : null
      };
    })
  };
};

const finalizarOrdenPagada = async (client, opciones) => {
  const {
    idOrden,
    idPagoExterno,
    idEventoExterno,
    tipoEvento,
    contenidoEvento,
    montoPagado
  } = opciones;

  const orden = await obtenerOrdenInterna(client, idOrden);

  if (!orden) {
    throw new Error('Orden interna no encontrada.');
  }

  const detalles = await obtenerDetallesOrden(client, idOrden);

  if (detalles.length === 0) {
    throw new Error('La orden no tiene cursos asociados.');
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

  let pago = null;

  const pagoAprobadoExistente = await client.query(
    `SELECT
      id_pago,
      id_orden,
      id_proveedor_pago,
      id_estado_pago,
      id_pago_externo,
      monto_pagado,
      fecha_pago
     FROM edutech.pago
     WHERE id_orden = $1
      AND id_estado_pago = $2
     ORDER BY id_pago DESC
     LIMIT 1`,
    [idOrden, idEstadoPagoAprobado]
  );

  if (pagoAprobadoExistente.rows.length > 0) {
    pago = pagoAprobadoExistente.rows[0];
  } else {
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
        idProveedorPayPal,
        idEstadoPagoAprobado,
        idPagoExterno,
        montoPagado || orden.total
      ]
    );

    pago = pagoResultado.rows[0];
  }

  await client.query(
    `INSERT INTO edutech.webhook_pago
      (id_pago, id_estado_webhook, tipo_evento, id_evento_externo, contenido_evento)
     VALUES
      ($1, $2, $3, $4, $5::jsonb)
     ON CONFLICT (id_evento_externo) DO NOTHING`,
    [
      pago.id_pago,
      idEstadoWebhookProcesado,
      tipoEvento || 'PAYMENT.CAPTURE.COMPLETED',
      idEventoExterno || idPagoExterno,
      JSON.stringify(contenidoEvento || {})
    ]
  );

  await client.query(
    `UPDATE edutech.orden
     SET id_estado_orden = $1
     WHERE id_orden = $2`,
    [idEstadoOrdenCompletada, idOrden]
  );

  const inscripciones = [];

  for (const detalle of detalles) {
    const inscripcionExistente = await client.query(
      `SELECT
        id_inscripcion,
        id_orden_detalle,
        id_estado_inscripcion,
        fecha_inscripcion
       FROM edutech.inscripcion
       WHERE id_orden_detalle = $1`,
      [detalle.id_orden_detalle]
    );

    if (inscripcionExistente.rows.length > 0) {
      inscripciones.push(inscripcionExistente.rows[0]);
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

    inscripciones.push(inscripcionResultado.rows[0]);
  }

  return {
    orden,
    detalles,
    pago,
    inscripciones,
    compra: construirCompraFrontend(orden, detalles, pago, inscripciones)
  };
};

const obtenerConfiguracionPayPal = (req, res) => {
  const currency = process.env.PAYPAL_CURRENCY || 'MXN';

  if (!PAYPAL_CLIENT_ID) {
    return res.json({
      ok: true,
      configured: false,
      clientId: '',
      currency,
      intent: 'capture',
      message: 'Falta PAYPAL_CLIENT_ID en backend/.env. Sin ese dato no se puede cargar el botón oficial de PayPal Sandbox.'
    });
  }

  res.json({
    ok: true,
    configured: true,
    clientId: PAYPAL_CLIENT_ID,
    currency,
    intent: 'capture'
  });
};

const crearOrdenPayPal = async (req, res) => {
  const client = await pool.connect();

  try {
    const { idOrden } = req.params;
    const orden = await obtenerOrdenInterna(client, idOrden);

    if (!orden) {
      return res.status(404).json({
        ok: false,
        message: 'Orden interna no encontrada.'
      });
    }

    if (String(orden.nombre_estado_orden).toLowerCase() !== 'pendiente') {
      return res.status(409).json({
        ok: false,
        message: 'Solo se puede pagar una orden pendiente.'
      });
    }

    const accessToken = await obtenerAccessTokenPayPal();
    const monto = formatearMontoPayPal(orden.total);

    const respuestaPayPal = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: String(orden.id_orden),
            custom_id: String(orden.id_orden),
            description: `EduTech - Orden ${orden.numero_orden}`,
            amount: {
              currency_code: process.env.PAYPAL_CURRENCY || 'MXN',
              value: monto
            }
          }
        ]
      })
    });

    const datosPayPal = await respuestaPayPal.json().catch(() => ({}));

    if (!respuestaPayPal.ok || !datosPayPal.id) {
      return res.status(502).json({
        ok: false,
        message: 'PayPal no pudo crear la orden.',
        error: datosPayPal
      });
    }

    res.json({
      ok: true,
      paypalOrderId: datosPayPal.id,
      paypal: datosPayPal
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al crear la orden real de PayPal.',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const extraerCapturaPayPal = (capturaPayPal) => {
  const unidad = Array.isArray(capturaPayPal.purchase_units)
    ? capturaPayPal.purchase_units[0]
    : null;
  const capturas = unidad && unidad.payments && Array.isArray(unidad.payments.captures)
    ? unidad.payments.captures
    : [];
  const captura = capturas[0] || {};

  return {
    idCaptura: captura.id || capturaPayPal.id,
    estado: captura.status || capturaPayPal.status,
    monto: captura.amount && captura.amount.value
      ? Number(captura.amount.value)
      : null,
    idOrdenInterna: normalizarTexto(unidad && (unidad.custom_id || unidad.reference_id))
  };
};

const capturarOrdenPayPal = async (req, res) => {
  const client = await pool.connect();

  try {
    const { idOrden } = req.params;
    const { paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.status(400).json({
        ok: false,
        message: 'Falta paypalOrderId.'
      });
    }

    const accessToken = await obtenerAccessTokenPayPal();

    const respuestaPayPal = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      }
    });

    const datosPayPal = await respuestaPayPal.json().catch(() => ({}));

    if (!respuestaPayPal.ok) {
      return res.status(502).json({
        ok: false,
        message: 'PayPal no pudo capturar el pago.',
        error: datosPayPal
      });
    }

    const captura = extraerCapturaPayPal(datosPayPal);

    if (String(captura.estado).toUpperCase() !== 'COMPLETED') {
      return res.status(409).json({
        ok: false,
        message: 'El pago de PayPal no fue completado.',
        estado_paypal: captura.estado,
        paypal: datosPayPal
      });
    }

    if (captura.idOrdenInterna && String(captura.idOrdenInterna) !== String(idOrden)) {
      return res.status(409).json({
        ok: false,
        message: 'La orden de PayPal no corresponde con la orden interna de EduTech.'
      });
    }

    await client.query('BEGIN');

    const resultado = await finalizarOrdenPagada(client, {
      idOrden,
      idPagoExterno: captura.idCaptura || paypalOrderId,
      idEventoExterno: captura.idCaptura || paypalOrderId,
      tipoEvento: 'PAYMENT.CAPTURE.COMPLETED',
      contenidoEvento: datosPayPal,
      montoPagado: captura.monto
    });

    await client.query('COMMIT');

    res.json({
      ok: true,
      message: 'Pago capturado con PayPal. Curso liberado correctamente.',
      ...resultado,
      paypal: datosPayPal
    });
  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al capturar el pago real de PayPal.',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const verificarWebhookPayPal = async (req) => {
  if (!PAYPAL_WEBHOOK_ID) {
    return true;
  }

  const accessToken = await obtenerAccessTokenPayPal();
  const payload = {
    auth_algo: req.get('paypal-auth-algo'),
    cert_url: req.get('paypal-cert-url'),
    transmission_id: req.get('paypal-transmission-id'),
    transmission_sig: req.get('paypal-transmission-sig'),
    transmission_time: req.get('paypal-transmission-time'),
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: req.body
  };

  const respuesta = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const datos = await respuesta.json().catch(() => ({}));

  return respuesta.ok && datos.verification_status === 'SUCCESS';
};

const resolverIdOrdenDesdeWebhook = async (client, evento) => {
  const recurso = evento.resource || {};
  const idOrdenPorCustom = normalizarTexto(recurso.custom_id || recurso.invoice_id || recurso.reference_id);

  if (/^\d+$/.test(idOrdenPorCustom)) {
    return Number(idOrdenPorCustom);
  }

  if (idOrdenPorCustom) {
    const ordenPorNumero = await client.query(
      `SELECT id_orden
       FROM edutech.orden
       WHERE TRIM(numero_orden) = $1`,
      [idOrdenPorCustom]
    );

    if (ordenPorNumero.rows.length > 0) {
      return ordenPorNumero.rows[0].id_orden;
    }
  }

  return null;
};

const recibirWebhookPayPal = async (req, res) => {
  const client = await pool.connect();

  try {
    const evento = req.body || {};
    const tipoEvento = evento.event_type || '';
    const idEvento = evento.id || `PAYPAL-WH-${Date.now()}`;

    const firmaValida = await verificarWebhookPayPal(req);

    if (!firmaValida) {
      return res.status(400).json({
        ok: false,
        message: 'La firma del webhook de PayPal no es válida.'
      });
    }

    if (tipoEvento !== 'PAYMENT.CAPTURE.COMPLETED') {
      return res.json({
        ok: true,
        message: 'Webhook recibido sin liberación de curso porque no es un pago completado.',
        tipoEvento
      });
    }

    const idOrden = await resolverIdOrdenDesdeWebhook(client, evento);

    if (!idOrden) {
      return res.status(400).json({
        ok: false,
        message: 'No se pudo relacionar el webhook con una orden de EduTech.'
      });
    }

    const recurso = evento.resource || {};
    const monto = recurso.amount && recurso.amount.value
      ? Number(recurso.amount.value)
      : null;

    await client.query('BEGIN');

    const resultado = await finalizarOrdenPagada(client, {
      idOrden,
      idPagoExterno: recurso.id || idEvento,
      idEventoExterno: idEvento,
      tipoEvento,
      contenidoEvento: evento,
      montoPagado: monto
    });

    await client.query('COMMIT');

    res.json({
      ok: true,
      message: 'Webhook de PayPal procesado. Curso liberado correctamente.',
      ...resultado
    });
  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al procesar webhook de PayPal.',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  obtenerConfiguracionPayPal,
  crearOrdenPayPal,
  capturarOrdenPayPal,
  recibirWebhookPayPal
};
