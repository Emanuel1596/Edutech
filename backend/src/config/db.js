const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'bd_edutech',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || '1234'),
});

module.exports = pool;