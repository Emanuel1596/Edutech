# Tecnologias propuestas para EduTech

## Proyecto: EduTech - Plataforma Web de Cursos

Este documento define las tecnologias recomendadas para desarrollar EduTech como una aplicacion web con frontend, backend, base de datos, pagos en Sandbox, control de acceso por rol, progreso de cursos, examenes y certificados.

---

## Resumen de tecnologias

| Capa | Tecnologia recomendada | Uso principal |
|---|---|---|
| Frontend del Sprint 1 | HTML5, CSS3 y JavaScript | Crear pantallas estaticas e interacciones basicas del prototipo. |
| Frontend futuro | React | Escalar la interfaz cuando el sistema deje de ser prototipo. |
| Backend | Node.js con Express | Crear API, autenticacion, roles, cursos, pagos, inscripciones y examenes. |
| Base de datos | PostgreSQL | Guardar usuarios, cursos, ordenes, pagos, inscripciones, progreso, examenes y certificados. |
| Seguridad de contraseñas | bcrypt | Generar password_hash y no guardar contraseñas en texto plano. |
| Autenticacion | JWT o sesiones con cookies seguras | Mantener usuarios autenticados y proteger rutas por rol. |
| Validacion | Zod o express-validator | Validar datos antes de guardarlos en la base de datos. |
| Pagos | PayPal Sandbox o Stripe Sandbox | Simular pagos y confirmar transacciones con webhook. |
| Archivos | Almacenamiento local inicial o servicio externo | Guardar portadas, recursos, videos locales o certificados. |
| Control de versiones | Git y GitHub | Trabajar en equipo y guardar historial de cambios. |
| Despliegue frontend | GitHub Pages | Publicar el prototipo estatico del Sprint 1. |
| Despliegue backend | Render, Railway o servidor similar | Publicar API cuando exista backend funcional. |
| Variables de entorno | dotenv | Separar credenciales y configuraciones sensibles. |
| Pruebas API | Postman o Insomnia | Probar endpoints del backend. |
| Diagramas | Draw.io | Crear diagramas relacionales, mapas y estructura visual. |

---

## Frontend

Para el Sprint 1 se recomienda usar HTML5, CSS3 y JavaScript puro porque el objetivo es entregar pantallas visuales funcionales sin aumentar demasiado la complejidad.

HTML5 se usa para estructurar las pantallas.

CSS3 se usa para estilos, diseño responsivo, tarjetas, formularios y layout.

JavaScript se usa para interacciones basicas como validar formularios, simular mensajes enviados, cambiar vistas y manejar acciones visuales.

### Justificacion

Esta combinacion es suficiente para el prototipo actual porque todavia no se esta construyendo una aplicacion completa conectada a backend.

Cuando el sistema crezca, se puede migrar a React para manejar componentes, estados, rutas y consumo de API de forma mas ordenada.

---

## Backend

Se recomienda Node.js con Express.

El backend sera responsable de:

- registrar usuarios;
- iniciar sesion;
- validar roles;
- crear cursos;
- administrar modulos y lecciones;
- crear ordenes;
- crear detalles de orden;
- procesar pagos;
- recibir webhooks;
- crear inscripciones;
- guardar progreso;
- manejar examenes;
- generar certificados.

### Justificacion

Express es adecuado para una API web escolar porque es sencillo, flexible y permite separar rutas, controladores, servicios y repositorios.

---

## Base de datos

Se recomienda PostgreSQL.

PostgreSQL permite manejar relaciones, llaves primarias, llaves foraneas, restricciones, transacciones y tipos como JSONB para webhooks.

### Justificacion

EduTech necesita integridad entre muchas entidades: Usuario, Curso, Orden, Orden_Detalle, Pago, Inscripcion, Progreso_Leccion, Examen, Intento_Examen y Certificado. PostgreSQL es adecuado para este tipo de modelo relacional.

---

## Seguridad

Las contraseñas deben guardarse con bcrypt usando password_hash.

No se deben guardar contraseñas reales en texto plano.

Las rutas protegidas deben validar autenticacion y rol antes de permitir acceso.

Ejemplo:

| Ruta | Acceso permitido |
|---|---|
| Panel de alumno | Alumno |
| Panel de instructor | Instructor |
| Panel administrativo | Administrador |
| Webhook de pago | Pasarela externa validada |

---

## Pagos

Se recomienda usar PayPal Sandbox o Stripe Sandbox.

La pasarela procesa el pago y despues notifica a EduTech mediante webhook.

EduTech debe validar:

- identificador externo del pago;
- monto pagado;
- moneda;
- orden correspondiente;
- estado de pago;
- cursos incluidos en Orden_Detalle.

---

## Manejo de archivos

Para el primer avance se pueden usar imagenes dentro de frontend/assets/img.

Para una version con backend, las portadas, recursos y certificados pueden guardarse en backend/uploads o en un servicio externo.

La base de datos no guarda el archivo completo. Guarda la ruta o URL del archivo.

---

## Tecnologias no elegidas por ahora

| Tecnologia | Motivo para no usarla en este sprint |
|---|---|
| React | Aumenta complejidad para un prototipo HTML inicial. |
| Docker | Es util, pero puede dejarse para una etapa posterior. |
| Kubernetes | Es innecesario para el tamaño actual del proyecto. |
| Microservicios | EduTech puede iniciar como aplicacion monolitica bien organizada. |

---

## Decision final

Para el Sprint 1 se entrega frontend estatico con HTML, CSS y JavaScript.

Para la version funcional se recomienda:

| Parte | Tecnologia |
|---|---|
| Frontend | HTML, CSS, JavaScript; React en una etapa posterior |
| Backend | Node.js con Express |
| Base de datos | PostgreSQL |
| Pagos | PayPal Sandbox o Stripe Sandbox |
| Seguridad | bcrypt, JWT o sesiones con cookies seguras |
| Control de versiones | Git y GitHub |
| Despliegue frontend | GitHub Pages |
| Despliegue backend | Render o Railway |


