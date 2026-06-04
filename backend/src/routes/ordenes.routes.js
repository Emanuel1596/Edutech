const express = require('express');
const {
  crearOrden,
  pagarOrdenSimulada
} = require('../controllers/ordenes.controller');

const router = express.Router();

router.post('/ordenes', crearOrden);
router.post('/ordenes/:id/pago-simulado', pagarOrdenSimulada);

module.exports = router;