const express = require('express');
const {
  obtenerExamenCurso,
  registrarIntentoExamen,
  obtenerResultadoExamen
} = require('../controllers/examenes.controller');

const router = express.Router();

router.get('/usuarios/:idUsuario/cursos/:idCurso/examen', obtenerExamenCurso);
router.post('/usuarios/:idUsuario/cursos/:idCurso/examen/responder', registrarIntentoExamen);
router.get('/usuarios/:idUsuario/cursos/:idCurso/examen/resultado', obtenerResultadoExamen);

module.exports = router;
