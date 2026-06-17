const express = require('express');
const {
  obtenerConfiguracionPayPal,
  crearOrdenPayPal,
  capturarOrdenPayPal,
  recibirWebhookPayPal
} = require('../controllers/paypal.controller');

const router = express.Router();

router.get('/paypal/config', obtenerConfiguracionPayPal);
router.post('/paypal/ordenes/:idOrden/crear-orden', crearOrdenPayPal);
router.post('/paypal/ordenes/:idOrden/capturar-orden', capturarOrdenPayPal);
router.post('/paypal/webhook', recibirWebhookPayPal);

module.exports = router;
