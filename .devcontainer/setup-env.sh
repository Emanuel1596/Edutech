#!/usr/bin/env bash
set -e

mkdir -p backend

if [ ! -f backend/.env ]; then
  cat > backend/.env <<'ENVEOF'
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bd_edutech
DB_USER=postgres
DB_PASSWORD=1234
JWT_SECRET=edutech_sprint2_clave_temporal_1234
ENVEOF
  echo "backend/.env creado correctamente."
else
  echo "backend/.env ya existe. No se sobrescribió."
fi
