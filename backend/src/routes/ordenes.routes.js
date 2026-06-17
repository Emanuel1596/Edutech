const express = require('express');
const {
  crearOrden,
  pagarOrdenSimulada,
  procesarWebhookPagoSandbox
} = require('../controllers/ordenes.controller');

const router = express.Router();

router.post('/ordenes', crearOrden);
router.post('/ordenes/:id/pago-simulado', pagarOrdenSimulada);
router.post('/pagos/paypal-sandbox/webhook', procesarWebhookPagoSandbox);

module.exports = router;