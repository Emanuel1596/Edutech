const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const cursosRoutes = require('./routes/cursos.routes');
const ordenesRoutes = require('./routes/ordenes.routes');
const misCursosRoutes = require('./routes/misCursos.routes');
const examenesRoutes = require('./routes/examenes.routes');
const certificadosRoutes = require('./routes/certificados.routes');
const instructoresRoutes = require('./routes/instructores.routes');
const adminRoutes = require('./routes/admin.routes');
const paypalRoutes = require('./routes/paypal.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Bienvenido a la API de EduTech',
  });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', cursosRoutes);
app.use('/api', ordenesRoutes);
app.use('/api', misCursosRoutes);
app.use('/api', examenesRoutes);
app.use('/api', certificadosRoutes);
app.use('/api', instructoresRoutes);
app.use('/api', adminRoutes);
app.use('/api', paypalRoutes);

module.exports = app;