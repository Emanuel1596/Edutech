const pool = require('../config/db');

const healthCheck = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS fecha_servidor');

    res.json({
      ok: true,
      message: 'API EduTech funcionando correctamente',
      database: 'conectada',
      fecha_servidor: result.rows[0].fecha_servidor,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'La API funciona, pero no pudo conectar con la base de datos',
      error: error.message,
    });
  }
};

module.exports = {
  healthCheck,
};