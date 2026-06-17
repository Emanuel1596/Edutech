const express = require('express');
const {
  obtenerMisCursos,
  obtenerCursoInscritoDetalle,
  obtenerContenidoLeccionInscrita,
  marcarLeccionCompletada
} = require('../controllers/misCursos.controller');

const router = express.Router();

router.get('/usuarios/:idUsuario/mis-cursos', obtenerMisCursos);
router.get('/usuarios/:idUsuario/mis-cursos/:idInscripcion', obtenerCursoInscritoDetalle);
router.get('/usuarios/:idUsuario/mis-cursos/:idInscripcion/lecciones/:idLeccion', obtenerContenidoLeccionInscrita);
router.post('/inscripciones/:idInscripcion/lecciones/:idLeccion/completar', marcarLeccionCompletada);

module.exports = router;