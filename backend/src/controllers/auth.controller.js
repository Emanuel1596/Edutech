const bcrypt = require('bcrypt');
const pool = require('../config/db');

const registrarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      password,
      telefono
    } = req.body;

    if (!nombre || !apellido_paterno || !correo || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan datos obligatorios: nombre, apellido_paterno, correo y password.'
      });
    }

    if (telefono && !/^[0-9]{10}$/.test(telefono)) {
      return res.status(400).json({
        ok: false,
        message: 'El teléfono debe tener exactamente 10 dígitos.'
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT id_usuario FROM edutech.usuario WHERE LOWER(correo) = LOWER($1)',
      [correo]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario registrado con ese correo.'
      });
    }

    const rolAlumno = await pool.query(
      'SELECT id_rol FROM edutech.rol WHERE LOWER(nombre_rol) = LOWER($1)',
      ['Alumno']
    );

    if (rolAlumno.rows.length === 0) {
      return res.status(500).json({
        ok: false,
        message: 'No existe el rol Alumno en la base de datos. Primero ejecuta el script DML.'
      });
    }

    const idRolAlumno = rolAlumno.rows[0].id_rol;
    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO edutech.usuario
        (id_rol, nombre, apellido_paterno, apellido_materno, correo, password_hash, telefono, esta_activo)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, TRUE)
       RETURNING
        id_usuario,
        id_rol,
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        esta_activo,
        fecha_registro`,
      [
        idRolAlumno,
        nombre,
        apellido_paterno,
        apellido_materno || null,
        correo,
        passwordHash,
        telefono || null
      ]
    );

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente.',
      usuario: {
        ...resultado.rows[0],
        nombre_rol: 'Alumno'
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario.',
      error: error.message
    });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Correo y password son obligatorios.'
      });
    }

    const resultado = await pool.query(
      `SELECT
        u.id_usuario,
        u.id_rol,
        r.nombre_rol,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.password_hash,
        u.telefono,
        u.esta_activo
       FROM edutech.usuario u
       INNER JOIN edutech.rol r
        ON r.id_rol = u.id_rol
       WHERE LOWER(u.correo) = LOWER($1)`,
      [correo]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: 'Correo o contraseña incorrectos.'
      });
    }

    const usuario = resultado.rows[0];

    if (!usuario.esta_activo) {
      return res.status(403).json({
        ok: false,
        message: 'El usuario está inactivo.'
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordCorrecta) {
      return res.status(401).json({
        ok: false,
        message: 'Correo o contraseña incorrectos.'
      });
    }

    delete usuario.password_hash;

    res.json({
      ok: true,
      message: 'Inicio de sesión correcto.',
      usuario
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesión.',
      error: error.message
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};