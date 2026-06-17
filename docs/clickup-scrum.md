# Gestión del Proyecto - ClickUp y Scrum

## Proyecto

EduTech - Plataforma web para venta y consumo de cursos en línea.

## Objetivo del documento

Registrar cómo se organizó el trabajo del equipo usando una metodología tipo Scrum y cómo debería evidenciarse en ClickUp o en capturas equivalentes.

\---

## Metodología aplicada

El equipo trabajó con una organización basada en Scrum, separando el proyecto en sprints y entregables incrementales.

El trabajo se dividió en:

* Backlog general del proyecto.
* Sprint 1, enfocado en documentación, análisis y estructura inicial.
* Sprint 2, enfocado en implementación funcional, integración y pruebas.

\---

## Sprints definidos

|Sprint|Fecha de inicio|Duración aproximada|Objetivo|
|-|-:|-:|-|
|Backlog|Antes del Sprint 1|Permanente|Concentrar tareas pendientes del proyecto.|
|Sprint 1|7 de mayo de 2026|3 a 4 semanas|Definir documentación inicial, requerimientos, actores, navegación, pantallas, tecnologías, modelo de base de datos y estructura del proyecto.|
|Sprint 2|4 de junio de 2026|3 a 4 semanas|Implementar frontend, backend, base de datos, registro, login, cursos, compras, progreso, examen, certificados y paneles por rol.|

\---

## Estructura recomendada del Workspace en ClickUp

```txt
EduTech
├── Backlog
│   ├── Pendiente
│   ├── Por revisar
│   └── Priorizado
├── Sprint 1 - Ingeniería y documentación
│   ├── Por hacer
│   ├── En progreso
│   ├── En revisión
│   └── Terminado
└── Sprint 2 - Implementación e integración
    ├── Por hacer
    ├── En progreso
    ├── En revisión
    └── Terminado
```

\---

## Estados de tareas

|Estado|Significado|
|-|-|
|Por hacer|La tarea fue definida, pero todavía no inicia.|
|En progreso|Un integrante ya está trabajando en la tarea.|
|En revisión|La tarea ya fue realizada y debe revisarse o integrarse.|
|Terminado|La tarea ya fue revisada y entregada.|
|Bloqueado|La tarea depende de otra actividad o presenta error.|

\---

## Backlog inicial

|ID|Tarea|Prioridad|Responsable sugerido|Estado|
|-|-|-|-|-|
|B-01|Definir actores del sistema|Alta|Valeria|Terminado|
|B-02|Definir acciones por actor|Alta|Diego Rafael|Terminado|
|B-03|Crear requerimientos funcionales y no funcionales|Alta|Emanuel|Terminado|
|B-04|Diseñar mapa de navegación|Media|Randy|Terminado|
|B-05|Definir pantallas del sistema|Alta|Edgar|Terminado|
|B-06|Crear wireframes|Media|André|Terminado|
|B-07|Definir modelo de base de datos|Alta|Emanuel|Terminado|
|B-08|Elaborar diagrama entidad-relación|Alta|Valeria|Terminado|
|B-09|Definir tecnologías|Media|Randy|Terminado|
|B-10|Crear estructura inicial del proyecto|Alta|Equipo|Terminado|

\---

## Sprint 1 - Ingeniería y documentación

|ID|Tarea|Entregable|Responsable|Evidencia|
|-|-|-|-|-|
|S1-01|Actores del sistema|`docs/actores.md`|Valeria|Documento en GitHub.|
|S1-02|Acciones de actores|`docs/acciones\_actores.md`|Diego Rafael|Documento en GitHub.|
|S1-03|Requerimientos|`docs/requerimientos.md`|Emanuel|Documento en GitHub.|
|S1-04|Mapa de navegación|`docs/Mapa de navegacion.pdf`|Randy|PDF en GitHub.|
|S1-05|Pantallas|`docs/pantallas.md`|Edgar|Documento en GitHub.|
|S1-06|Wireframes|`docs/wireframes.md`|André|Documento en GitHub.|
|S1-07|Modelo de base de datos|`docs/modelo-base-datos.md`|Emanuel|Documento en GitHub.|
|S1-08|Diagrama relacional|`docs/Diagrama-Relacional.md` / PDF|Valeria|Link o PDF en GitHub.|
|S1-09|Tecnologías|`docs/tecnologias.md`|Randy|Documento en GitHub.|
|S1-10|Seguimiento de entregas|`docs/seguimiento-entregas.md`|Equipo|Documento en GitHub.|

\---

## Sprint 2 - Implementación e integración

|ID|Tarea|Entregable|Responsable / evidencia en commits|Estado|
|-|-|-|-|-|
|S2-01|Configurar backend con Express y Codespaces|`backend/`, `.devcontainer/`|Commits de backend y Codespaces|Terminado|
|S2-02|Configurar PostgreSQL con Docker|`docker/docker-compose.yml`, `database/sql`|Commits de base de datos|Terminado|
|S2-03|Conectar frontend con API|`frontend/js/api.js`|Commits de conexión frontend API|Terminado|
|S2-04|Registro e inicio de sesión|`auth.controller.js`, `login.html`, `registro.html`|Commits de registro/login|Terminado|
|S2-05|Catálogo y detalle de cursos|`cursos.html`, `detalle-curso.html`, rutas de cursos|Commits de cursos desde backend|Terminado|
|S2-06|Compra y pago sandbox|`comprar-curso.html`, `pago-sandbox.html`, `ordenes.controller.js`|Commits de compra y pago|Terminado|
|S2-07|Webhook y pagos PayPal|`paypal.controller.js`, `paypal.routes.js`|Commits de PayPal / carrito|Terminado|
|S2-08|Mis cursos y progreso|`mis-cursos.html`, `aula.html`, progreso en backend|Commits de mis cursos/progreso|Terminado|
|S2-09|Examen final y resultados|`examen.html`, `examenes.controller.js`|Commits de examen y resultados|Terminado|
|S2-10|Certificados|`certificado.html`, `certificados.service.js`|Commits de certificados|Terminado|
|S2-11|Panel instructor|`instructor.html`, `instructor-examen.html`|Commits de instructor|Terminado|
|S2-12|Panel administrador|`admin.html`, rutas y controladores admin|Commits de admin|Terminado|
|S2-13|Validaciones y seguridad de navegación|`session-guard.js`, `preauth-guard.js`, `seguridad-roles.js`|Commits de protección de pantallas|Terminado|
|S2-14|Documentación final y pruebas|README, docs y flujo de exposición|Commits finales|Terminado|

\---

## Relación con commits de GitHub

La evidencia del trabajo también se puede observar en el historial de commits del repositorio. De acuerdo con las capturas del repositorio, participaron los siguientes usuarios:

|Usuario de GitHub|Evidencia observada en commits|Área principal relacionada|
|-|-|-|
|`@Emanuel1596`|Commits iniciales de documentación, requerimientos, base de datos, merges y commit final.|Requerimientos, base de datos, integración y cierre.|
|`@XxTiny2099xX`|Commits de frontend, registro, conexión con API y configuración backend/env.|Frontend, registro y configuración.|
|`@ba777e`|Commits de backend Codespaces, scripts base del frontend, rediseño HTML/CSS, roles, sesiones, instructor y admin.|Backend, frontend, roles, paneles y navegación.|
|`@o0rafahuerta0o`|Commits de cursos, compra, progreso, perfil, pagos, solicitudes y carrito con PayPal.|Compras, pagos, progreso y alumno.|
|`@martinedgar711-lgtm`|Commits de estructura, pantallas, login, cursos desde backend, examen, certificados y ajustes visuales.|Pantallas, cursos, examen y certificado.|
|`@RandyPalacios02`|Commits de backend base, Docker, documentación del Sprint 2, aula del alumno e instructor.|Docker, documentación, aula y escritorio instructor.|

\---

\---

## Conclusión

El proyecto se organizó de forma incremental. Primero se trabajó la fase de ingeniería y documentación; después se implementaron los módulos funcionales principales: autenticación, cursos, compra, pago, progreso, examen, certificado, instructor y administrador. El historial de GitHub funciona como evidencia técnica de la participación y evolución del código fuente.

