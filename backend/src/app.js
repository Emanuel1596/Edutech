const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Bienvenido a la API de EduTech',
  });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;