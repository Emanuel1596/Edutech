# EduTech - Plataforma Web de Cursos

EduTech es una plataforma web para la venta y administración de cursos en línea. El sistema permite registrar usuarios, iniciar sesión, consultar cursos, comprar cursos, acceder al aula, completar lecciones, presentar exámenes y obtener certificados al aprobar. También incluye vistas para instructores y administradores.

---

## Equipo

| Nombre completo | Usuario de GitHub |
|---|---|
| Contreras González Andre Yahir | [@XxTiny2099xX](https://github.com/XxTiny2099xX) |
| Huerta Ruiz Diego Rafael | [@o0rafahuerta0o](https://github.com/o0rafahuerta0o) |
| Martínez Mejía Edgar | [@martinedgar711-lgtm](https://github.com/martinedgar711-lgtm) |
| Mejía Osornio Valeria | [@ba777e](https://github.com/ba777e) |
| Romero Palacios Randy | [@RandyPalacios02](https://github.com/RandyPalacios02) |
| Villanueva García Emanuel | [@Emanuel1596](https://github.com/Emanuel1596) |

---

## Funcionalidades principales

### Alumno

- Registro e inicio de sesión.
- Consulta de catálogo de cursos.
- Vista de detalle del curso.
- Carrito de compras.
- Compra simulada y flujo de pago con PayPal Sandbox.
- Acceso a cursos comprados.
- Aula con módulos y lecciones.
- Progreso de lecciones.
- Examen final.
- Certificado al aprobar el examen.
- Perfil y datos de compra.

### Instructor

- Solicitud para convertirse en instructor.
- Escritorio de instructor.
- Creación y edición de cursos.
- Gestión de módulos, lecciones, videos y recursos.
- Configuración de examen final.
- Revisión de cursos creados.

### Administrador

- Panel administrativo.
- Gestión de usuarios y roles.
- Revisión administrativa de cursos.
- Vista de pagos.
- Control general de cursos, instructores y alumnos.

---

## Tecnologías utilizadas

| Área | Tecnología |
|---|---|
| Frontend | HTML, CSS y JavaScript |
| Backend | Node.js y Express |
| Base de datos | PostgreSQL |
| Contenedores | Docker y Docker Compose |
| Control de versiones | Git y GitHub |
| Entorno de desarrollo | GitHub Codespaces |
| Pagos | Pago simulado y PayPal Sandbox |

---

## Arquitectura general

El proyecto se organiza con una arquitectura web por capas:

```txt
Frontend HTML/CSS/JS
        ↓
API REST con Node.js y Express
        ↓
PostgreSQL
```

El frontend consume los endpoints del backend mediante JavaScript. El backend contiene rutas, controladores, servicios y conexión a base de datos. PostgreSQL almacena usuarios, roles, cursos, módulos, lecciones, órdenes, pagos, inscripciones, exámenes, intentos y certificados.

---

## Estructura del proyecto

```txt
backend/        API con Node.js y Express
frontend/       Vistas HTML, estilos CSS y scripts JS
database/sql/   Scripts SQL para crear y poblar la base de datos
docker/         Configuración de PostgreSQL con Docker Compose
docs/           Documentación del proyecto
README.md       Documento principal del proyecto
```

Archivos importantes:

```txt
backend/src/app.js
backend/src/server.js
backend/src/controllers/
backend/src/routes/
backend/src/services/
backend/env.example
frontend/index.html
frontend/cursos.html
frontend/detalle-curso.html
frontend/comprar-curso.html
frontend/pago-sandbox.html
frontend/compra-aprobada.html
frontend/mis-cursos.html
frontend/aula.html
frontend/examen.html
frontend/certificado.html
database/sql/01_ddl_edutech.sql
database/sql/02_dml_edutech.sql
database/sql/03_dcl_edutech.sql
docker/docker-compose.yml
```

---

## Requisitos para ejecutar el proyecto

En GitHub Codespaces normalmente ya se cuenta con lo necesario. En caso de ejecutarlo en otro entorno, se requiere:

- Node.js.
- npm.
- Docker.
- Docker Compose.
- Git.

---

## Configuración de variables de entorno

El backend usa un archivo local:

```txt
backend/.env
```

Ese archivo no debe subirse al repositorio. La plantilla segura es:

```txt
backend/env.example
```

Contenido mínimo para ejecutar el proyecto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bd_edutech
DB_USER=postgres
DB_PASSWORD=1234
JWT_SECRET=edutech_sprint2_clave_temporal_1234

PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=coloca_aqui_tu_client_id_sandbox
PAYPAL_CLIENT_SECRET=coloca_aqui_tu_client_secret_sandbox
PAYPAL_CURRENCY=MXN
PAYPAL_WEBHOOK_ID=
```

Si `backend/.env` no existe, se puede crear con:

```bash
cat > backend/.env <<'ENVEOF'
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bd_edutech
DB_USER=postgres
DB_PASSWORD=1234
JWT_SECRET=edutech_sprint2_clave_temporal_1234

PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=coloca_aqui_tu_client_id_sandbox
PAYPAL_CLIENT_SECRET=coloca_aqui_tu_client_secret_sandbox
PAYPAL_CURRENCY=MXN
PAYPAL_WEBHOOK_ID=
ENVEOF
```

Para el flujo de pago simulado interno no se necesitan credenciales reales de PayPal. Para usar PayPal Sandbox real sí se deben colocar `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET`.

---

## Ejecutar el proyecto en Codespaces

Desde la raíz del repositorio, donde se ven las carpetas `backend`, `frontend`, `database`, `docker` y `docs`, ejecutar:

### 1. Levantar la base de datos

```bash
docker compose -f docker/docker-compose.yml up -d
```

Para reiniciar la base desde cero:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

Verificar que PostgreSQL esté activo:

```bash
docker compose -f docker/docker-compose.yml ps
```

Verificar tablas:

```bash
docker compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d bd_edutech -c "\dt edutech.*"
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Ejecutar backend

```bash
npm run dev
```

El backend queda en el puerto:

```txt
3000
```

Probar API:

```bash
curl http://localhost:3000/api/health
```

### 4. Ejecutar frontend

Abrir otra terminal, regresar a la raíz del proyecto y ejecutar:

```bash
npx http-server frontend -p 3001 -c-1
```

Si pregunta si se desea instalar `http-server`, responder:

```txt
y
```

El frontend queda en el puerto:

```txt
3001
```

En Codespaces, poner los puertos como públicos:

```txt
3000 → Public
3001 → Public
```

Abrir el puerto `3001` y entrar a:

```txt
/index.html
```

---

## Ejecutar desde otro Codespace

Para ejecutar el proyecto desde otra computadora o desde otro Codespace:

1. Entrar al repositorio en GitHub.
2. Abrir `Code`.
3. Seleccionar `Codespaces`.
4. Crear o abrir un Codespace sobre la rama `main`.
5. Esperar a que cargue el entorno.
6. Revisar que estés en la raíz del proyecto:

```bash
ls
```

Debe verse:

```txt
backend  database  docker  docs  frontend  README.md
```

7. Verificar o crear `backend/.env`:

```bash
cat backend/.env
```

Si no existe, crearlo con el bloque de variables de entorno mostrado arriba.

8. Levantar base, backend y frontend:

```bash
docker compose -f docker/docker-compose.yml up -d
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
npx http-server frontend -p 3001 -c-1
```

9. En la pestaña `PUERTOS`, poner:

```txt
3000 → Public
3001 → Public
```

10. Abrir:

```txt
Puerto 3000 + /api/health
Puerto 3001 + /index.html
```

Si aparece una advertencia como `git-lfs was not found`, no impide ejecutar el proyecto mientras los archivos necesarios ya estén en el repositorio.

---

## Rutas principales de la API

### Salud del backend

```txt
GET /api/health
```

### Autenticación

```txt
POST /api/auth/registro
POST /api/auth/login
```

### Cursos

```txt
GET /api/cursos
GET /api/cursos/:id
```

### Órdenes y pago simulado

```txt
POST /api/ordenes
POST /api/ordenes/:id/pago-simulado
POST /api/pagos/paypal-sandbox/webhook
```

### PayPal Sandbox real

```txt
GET  /api/paypal/config
POST /api/paypal/ordenes/:idOrden/crear-orden
POST /api/paypal/ordenes/:idOrden/capturar-orden
POST /api/paypal/webhook
```

### Cursos del alumno

```txt
GET /api/usuarios/:id/mis-cursos
GET /api/usuarios/:id/mis-cursos/:idInscripcion
POST /api/inscripciones/:idInscripcion/lecciones/:idLeccion/completar
```

### Exámenes y certificados

```txt
GET  /api/examenes/:id
POST /api/examenes/:id/responder
GET  /api/certificados/:id
```

---

## Flujo de compra y webhook

El flujo de compra funciona de la siguiente manera:

```txt
Alumno selecciona curso
→ se crea una orden pendiente
→ se realiza pago simulado o PayPal Sandbox
→ el backend procesa el pago
→ se registra el pago
→ se registra el webhook
→ se completa la orden
→ se crea la inscripción
→ el curso aparece en Mis cursos
```

El webhook sirve para que la liberación del curso no dependa solo del navegador. El backend recibe la confirmación del pago, valida la orden, registra el evento y crea la inscripción del alumno.

Para demostrar el webhook simulado se puede usar:

```bash
curl -X POST http://localhost:3000/api/pagos/paypal-sandbox/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id_orden": 1,
    "proveedor": "PayPal",
    "tipo_evento": "PAYMENT.CAPTURE.COMPLETED",
    "id_evento_externo": "WH-EXPO-001",
    "id_pago_externo": "PAYPAL-EXPO-001",
    "monto_pagado": 499,
    "contenido_evento": {
      "ambiente": "sandbox",
      "descripcion": "Pago aprobado simulado para exposición"
    }
  }'
```

Antes de correrlo, se debe cambiar `id_orden` y `monto_pagado` por los valores reales de la orden creada.

---

## Flujo de certificado

El certificado se genera cuando el alumno aprueba el examen final. El backend guarda un registro del certificado con el alumno, curso, intento aprobado, fecha de emisión y código de verificación. Después el frontend muestra visualmente el certificado con HTML y CSS.

El certificado no es una imagen fija para todos. El diseño funciona como una plantilla visual y los datos dinámicos se colocan encima:

```txt
Nombre del alumno
Curso aprobado
Fecha de emisión
Código de verificación
```

---

## Usuarios de prueba

Para exposición, se pueden usar los usuarios semilla del sistema. Si las contraseñas no funcionan, se puede actualizar la contraseña de instructores y administrador con:

```bash
HASH=$(cd backend && node -e "require('bcrypt').hash('12345678', 10).then(h => process.stdout.write(h))")
docker compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d bd_edutech -c "UPDATE edutech.usuario SET password_hash='${HASH}' WHERE correo IN ('lester.instructor@edutech.com','luisa.instructor@edutech.com','admin@edutech.com');"
```

Credenciales para prueba:

```txt
Instructor:
lester.instructor@edutech.com
12345678

Otro instructor:
luisa.instructor@edutech.com
12345678

Administrador:
admin@edutech.com
12345678
```

Para alumno, se recomienda crear un usuario nuevo desde `registro.html` durante la exposición.

---

## Limpieza de base para exposición

Para borrar compras, inscripciones, progreso, intentos, certificados y alumnos de prueba, pero conservar cursos, instructores, administrador y exámenes:

```bash
docker compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d bd_edutech <<'SQL'
BEGIN;

TRUNCATE TABLE
  edutech.respuesta_alumno,
  edutech.pregunta_intento,
  edutech.intento_examen,
  edutech.certificado,
  edutech.progreso_leccion,
  edutech.inscripcion,
  edutech.webhook_pago,
  edutech.pago,
  edutech.datos_compra,
  edutech.orden_detalle,
  edutech.orden,
  edutech.mensaje_contacto,
  edutech.solicitud_instructor
RESTART IDENTITY CASCADE;

DELETE FROM edutech.usuario
WHERE id_rol = (
  SELECT id_rol
  FROM edutech.rol
  WHERE LOWER(nombre_rol) = 'alumno'
);

COMMIT;
SQL
```

Después, limpiar el navegador desde la consola:

```js
localStorage.clear();
sessionStorage.clear();
location.href = 'index.html';
```

---

## Flujo sugerido para exposición

```txt
1. Abrir Inicio.
2. Entrar a Cursos.
3. Abrir detalle de un curso.
4. Registrar un alumno nuevo.
5. Iniciar sesión.
6. Comprar un curso.
7. Aprobar el pago sandbox.
8. Ver compra aprobada.
9. Entrar a Mis cursos.
10. Abrir el aula.
11. Completar lecciones.
12. Presentar examen.
13. Mostrar certificado.
14. Cerrar sesión.
15. Entrar como instructor.
16. Mostrar cursos, edición y examen.
17. Cerrar sesión.
18. Entrar como administrador.
19. Mostrar gestión de usuarios, cursos y pagos.
```

---

## Documentación del proyecto

La documentación se encuentra en la carpeta `docs`.

| Documento | Descripción |
|---|---|
| `docs/requerimientos.md` | Requerimientos funcionales y no funcionales |
| `docs/moscow.md` | Priorización MoSCoW |
| `docs/historias-usuario.md` | Historias de usuario con criterios de aceptación |
| `docs/casos-uso.md` | Casos de uso principales |
| `docs/modelo-base-datos.md` | Modelo lógico de base de datos |
| `docs/Diagrama-Relacional.md` | Diagrama entidad-relación |
| `docs/arquitectura-solucion.md` | Arquitectura de la solución |
| `docs/clickup-scrum.md` | Gestión Scrum, Backlog, Sprint 1 y Sprint 2 |
| `docs/sprint-1.md` | Planeación del Sprint 1 |
| `docs/sprint-2.md` | Planeación del Sprint 2 |
| `docs/participantes.md` | Participantes y aportaciones |

Si algunos documentos todavía no están en el repositorio, deben agregarse dentro de `docs` antes de la entrega final.

---

## Gestión Scrum

El proyecto se organizó usando Scrum con dos sprints principales:

| Sprint | Fecha de inicio | Enfoque |
|---|---:|---|
| Sprint 1 | 7 de mayo | Planeación, documentación, actores, requerimientos, navegación, pantallas, tecnologías y base de datos inicial |
| Sprint 2 | 4 de junio | Implementación de backend, frontend dinámico, login, cursos, compras, aula, progreso, examen, certificados, instructor y administración |

La evidencia de gestión puede agregarse en:

```txt
docs/evidencias/clickup/
docs/evidencias/github/
```

---

## Comandos Git para entrega final

Revisar cambios:

```bash
git status
```

Agregar archivos:

```bash
git add .
```

Crear commit final:

```bash
git commit -m "Commit final para entrega de EduTech"
```

Actualizar rama y subir:

```bash
git pull --rebase origin main
git push origin main
```

---

## Solución de problemas comunes

### Error: puerto ocupado

```bash
fuser -k 3000/tcp
fuser -k 3001/tcp
```

### Error: la base no toma cambios SQL

Docker solo ejecuta los SQL automáticamente cuando el volumen se crea por primera vez. Para recrear la base:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

### Error: no existe `backend/.env`

Crear el archivo con el bloque de variables de entorno de este README.

### Error: PayPal Sandbox real no funciona

Revisar que existan estas variables en `backend/.env`:

```env
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_CURRENCY=MXN
```

También verificar que las rutas de PayPal estén registradas en `backend/src/app.js`.

### Advertencia: `git-lfs was not found`

Es una advertencia del entorno. No impide ejecutar el proyecto si los archivos necesarios ya están dentro del repositorio.

---

## Estado final

EduTech queda como una aplicación web funcional con flujo de alumno, instructor y administrador. El sistema permite comprar cursos, liberar acceso mediante pago, guardar progreso, presentar examen y generar certificado al aprobar.
