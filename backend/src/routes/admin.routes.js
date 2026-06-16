const express = require('express');
const {
  listarUsuariosAdmin,
  cambiarRolUsuarioAdmin,
  listarCursosRevisionAdmin,
  revisarCursoAdmin,
  obtenerCursoPreviewAdmin,
  obtenerExamenPreviewAdmin
} = require('../controllers/admin.controller');

const router = express.Router();

router.get('/admin/usuarios', listarUsuariosAdmin);
router.patch('/admin/usuarios/:idUsuario/rol', cambiarRolUsuarioAdmin);

router.get('/admin/cursos-revision', listarCursosRevisionAdmin);
router.get('/admin/cursos/:idCurso/preview', obtenerCursoPreviewAdmin);
router.get('/admin/cursos/:idCurso/examen-preview', obtenerExamenPreviewAdmin);
router.patch('/admin/cursos/:idCurso/revision', revisarCursoAdmin);

module.exports = router;
