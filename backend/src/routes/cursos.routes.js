const express = require('express');
const {
  obtenerCursos,
  obtenerCursoPorId
} = require('../controllers/cursos.controller');

const router = express.Router();

router.get('/cursos', obtenerCursos);
router.get('/cursos/:id', obtenerCursoPorId);

module.exports = router;