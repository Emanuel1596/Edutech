const express = require('express');
const {
  obtenerMisCursos,
  obtenerCursoInscritoDetalle,
  marcarLeccionCompletada
} = require('../controllers/misCursos.controller');

const router = express.Router();

router.get('/usuarios/:idUsuario/mis-cursos', obtenerMisCursos);
router.get('/usuarios/:idUsuario/mis-cursos/:idInscripcion', obtenerCursoInscritoDetalle);
router.post('/inscripciones/:idInscripcion/lecciones/:idLeccion/completar', marcarLeccionCompletada);

module.exports = router;