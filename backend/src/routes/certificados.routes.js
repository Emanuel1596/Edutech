const express = require('express');
const {
  obtenerCertificadosUsuario,
  obtenerCertificadoUsuario,
  verificarCertificado
} = require('../controllers/certificados.controller');

const router = express.Router();

router.get('/usuarios/:idUsuario/certificados', obtenerCertificadosUsuario);
router.get('/usuarios/:idUsuario/certificados/:idCertificado', obtenerCertificadoUsuario);
router.get('/certificados/verificar/:codigo', verificarCertificado);

module.exports = router;
