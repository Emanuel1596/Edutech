(() => {
  const obtener = (id) => document.getElementById(id);
  const sandboxCard = obtener('paypalSandboxCard');
  const sandboxSinDatos = obtener('paypalSandboxSinDatos');
  const sandboxOrden = obtener('sandboxOrden');
  const sandboxCurso = obtener('sandboxCurso');
  const sandboxTotal = obtener('sandboxTotal');
  const sandboxEstado = obtener('sandboxEstado');
  const sandboxMensaje = obtener('paypalSandboxMensaje');
  const sandboxNota = obtener('sandboxNota');
  const btnAprobar = obtener('btnAprobarSandbox');
  const btnCancelar = obtener('btnCancelarSandbox');

  const leerJson = (storage, clave) => {
    try {
      const valor = storage.getItem(clave);
      return valor ? JSON.parse(valor) : null;
    } catch (error) {
      return null;
    }
  };

  const escribirJson = (storage, clave, valor) => {
    storage.setItem(clave, JSON.stringify(valor));
  };

  const obtenerParametro = (nombre) => {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(nombre);
  };

  const obtenerCompraPendiente = () => {
    const compraSesion = leerJson(sessionStorage, 'edutech_compra_sandbox_pendiente')
      || leerJson(sessionStorage, 'edutech_compra_pendiente');
    const compraLocal = leerJson(localStorage, 'edutech_compra_sandbox_pendiente');
    const compra = compraSesion || compraLocal;
    const idOrdenUrl = obtenerParametro('idOrden');

    if (!compra || !compra.id_orden) {
      return null;
    }

    if (idOrdenUrl && String(compra.id_orden) !== String(idOrdenUrl)) {
      return null;
    }

    return compra;
  };

  const mostrar = (elemento) => {
    if (elemento) {
      elemento.style.setProperty('display', 'block', 'important');
    }
  };

  const ocultar = (elemento) => {
    if (elemento) {
      elemento.style.setProperty('display', 'none', 'important');
    }
  };

  const pintarCompra = (compra) => {
    if (sandboxOrden) {
      sandboxOrden.textContent = compra.numero_orden || `Orden #${compra.id_orden}`;
    }

    if (sandboxCurso) {
      sandboxCurso.textContent = compra.curso || 'Curso EduTech';
    }

    if (sandboxTotal) {
      sandboxTotal.textContent = compra.total || '$0 MXN';
    }

    if (sandboxEstado) {
      sandboxEstado.textContent = compra.estatus || 'Pendiente de pago';
    }

    if (btnCancelar && compra.id_curso) {
      btnCancelar.href = `comprar-curso.html?id=${compra.id_curso}`;
    }
  };

  const bloquearBoton = (bloquear) => {
    if (!btnAprobar) {
      return;
    }

    btnAprobar.disabled = bloquear;
    btnAprobar.textContent = bloquear ? 'Procesando webhook...' : 'Pagar con PayPal Sandbox';
  };

  const procesarWebhook = async (compra) => {
    const momento = Date.now();
    const monto = Number(compra.monto_total || String(compra.total || '').replace(/[^0-9.]/g, '') || 0);

    const respuesta = await window.EduTech.apiRequest('/pagos/paypal-sandbox/webhook', {
      method: 'POST',
      body: {
        id_orden: Number(compra.id_orden),
        proveedor: 'PayPal',
        tipo_evento: 'PAYMENT.CAPTURE.COMPLETED',
        id_evento_externo: `WH-PAYPAL-SANDBOX-${momento}`,
        id_pago_externo: `PAYPAL-SANDBOX-${momento}`,
        monto_pagado: monto,
        contenido_evento: {
          status: 'COMPLETED',
          provider: 'PayPal',
          sandbox: true,
          id_orden: Number(compra.id_orden)
        }
      }
    });

    const pago = respuesta.pago || {};
    const inscripciones = Array.isArray(respuesta.inscripciones) ? respuesta.inscripciones : [];
    const inscripcion = inscripciones.find((item) => String(item.id_curso) === String(compra.id_curso)) || inscripciones[0] || null;
    const fechaPago = pago.fecha_pago || new Date().toISOString();

    const compraAprobada = {
      ...compra,
      id_pago: pago.id_pago || compra.id_pago || null,
      id_inscripcion: inscripcion ? inscripcion.id_inscripcion : compra.id_inscripcion || null,
      fecha_pago: fechaPago,
      fecha_compra: fechaPago,
      fecha_inscripcion: inscripcion ? inscripcion.fecha_inscripcion : fechaPago,
      estatus: 'Aprobada',
      webhook_procesado: true,
      webhook: respuesta.webhook || null
    };

    escribirJson(sessionStorage, 'edutech_compra_pendiente', compraAprobada);
    escribirJson(localStorage, 'edutech_compra_aprobada_backend', compraAprobada);
    localStorage.removeItem('edutech_compra_sandbox_pendiente');
    sessionStorage.removeItem('edutech_compra_sandbox_pendiente');

    return compraAprobada;
  };

  const iniciar = () => {
    const compra = obtenerCompraPendiente();

    if (!compra) {
      ocultar(sandboxCard);
      mostrar(sandboxSinDatos);
      if (window.EduTechMarcarPaginaLista) {
        window.EduTechMarcarPaginaLista();
      }
      return;
    }

    mostrar(sandboxCard);
    ocultar(sandboxSinDatos);
    pintarCompra(compra);

    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }

    if (!btnAprobar) {
      return;
    }

    btnAprobar.addEventListener('click', async () => {
      bloquearBoton(true);

      try {
        const compraAprobada = await procesarWebhook(compra);

        if (sandboxEstado) {
          sandboxEstado.textContent = 'Aprobada';
        }

        if (sandboxMensaje) {
          sandboxMensaje.textContent = 'Pago aprobado. El webhook fue procesado y EduTech liberó el curso.';
        }

        if (sandboxNota) {
          sandboxNota.textContent = 'Redirigiendo a la confirmación de compra...';
        }

        window.setTimeout(() => {
          window.location.href = `compra-aprobada.html?id=${compraAprobada.id_curso}`;
        }, 700);
      } catch (error) {
        bloquearBoton(false);

        if (sandboxEstado) {
          sandboxEstado.textContent = 'Error';
        }

        if (sandboxNota) {
          sandboxNota.textContent = (error && (error.message || error.error)) || 'No se pudo procesar el webhook de pago.';
        }
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
