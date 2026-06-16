const express = require('express');
const {
  obtenerResumenInstructor,
  obtenerCatalogosCurso,
  obtenerCursoInstructor,
  subirPortadaCurso,
  crearCursoInstructor,
  actualizarCursoInstructor,
  guardarModulosCursoInstructor,
  guardarLeccionesCursoInstructor
} = require('../controllers/instructores.controller');

const router = express.Router();

router.get('/instructores/catalogos/curso', obtenerCatalogosCurso);
router.get('/instructores/:idInstructor/resumen', obtenerResumenInstructor);
router.get('/instructores/:idInstructor/cursos/:idCurso', obtenerCursoInstructor);
router.post('/instructores/:idInstructor/portadas', subirPortadaCurso);
router.post('/instructores/:idInstructor/cursos', crearCursoInstructor);
router.put('/instructores/:idInstructor/cursos/:idCurso', actualizarCursoInstructor);
router.post('/instructores/:idInstructor/cursos/:idCurso/modulos', guardarModulosCursoInstructor);
router.post('/instructores/:idInstructor/cursos/:idCurso/lecciones', guardarLeccionesCursoInstructor);

module.exports = router;
