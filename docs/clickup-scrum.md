# Gestión del Proyecto en ClickUp y Aplicación de Scrum

## Proyecto

**Nombre del proyecto:** EduTech  
**Tipo de proyecto:** Plataforma web para venta, administración y seguimiento de cursos en línea.  
**Metodología utilizada:** Scrum  
**Herramienta de gestión:** ClickUp  
**Repositorio de código:** GitHub

EduTech se desarrolló como una plataforma web con frontend, backend y base de datos. El proyecto incluye registro e inicio de sesión, control de roles, catálogo de cursos, compra de cursos, pago sandbox, webhook de pago, aula virtual, progreso de lecciones, examen final, certificados, panel de instructor y panel de administrador.

\---

## Objetivo de la gestión del proyecto

El objetivo de utilizar ClickUp fue organizar el trabajo del equipo en tareas, sprints y responsables, siguiendo una estructura basada en Scrum. Para ello se dividió el proyecto en un Backlog general y dos sprints principales:

* Backlog
* Sprint 1, con fecha de inicio el 7 de mayo
* Sprint 2, con fecha de inicio el 4 de junio

Esta organización permitió separar las actividades de documentación, diseño, base de datos, frontend, backend, integración, pruebas y entrega final.

\---

## Estructura utilizada en ClickUp

La estructura propuesta para el espacio de trabajo fue la siguiente:

```txt
Workspace: EduTech
Space: Proyecto EduTech
Listas:
  - Backlog
  - Sprint 1 - 7 de mayo
  - Sprint 2 - 4 de junio
  - Entrega final
```

Los estados utilizados para las tareas fueron:

```txt
Pendiente
En proceso
En revisión
Terminado
```

\---

## Roles de Scrum aplicados

|Rol|Descripción|Responsable / Equipo|
|-|-|-|
|Product Owner|Representa las necesidades del proyecto y prioriza funcionalidades.|Equipo de trabajo|
|Scrum Master|Da seguimiento a la organización, sprints, integración y entrega.|Villanueva García Emanuel|
|Development Team|Desarrolla frontend, backend, base de datos, documentación y pruebas.|Integrantes del equipo|

\---

## Participantes del equipo

|Nombre completo|Usuario de GitHub|Participación general|
|-|-|-|
|Contreras González Andre Yahir|@XxTiny2099xX|Backend, configuración de entorno, registro, login y conexión frontend con API.|
|Huerta Ruiz Diego Rafael|@o0rafahuerta0o|Funcionalidades de alumno, cursos, progreso, compras, carrito y flujo de pago.|
|Martínez Mejía Edgar|@martinedgar711-lgtm|Frontend, cursos, examen final, certificados, resultados y ajustes visuales.|
|Mejía Osornio Valeria|@ba777e|Frontend, validaciones, navegación protegida, panel administrativo, roles e instructor.|
|Romero Palacios Randy|@RandyPalacios02|Documentación, Sprint 2, escritorio de alumno e instructor, configuración Docker y backend base.|
|Villanueva García Emanuel|@Emanuel1596|Documentación inicial, requerimientos, modelo de datos, estructura del proyecto, merges e integración final.|

\---

## Backlog del proyecto

El Backlog concentró las tareas generales necesarias para construir la plataforma EduTech. Algunas de las tareas principales fueron:

|Tarea|Descripción|Prioridad|Estado|
|-|-|-|-|
|Definir requerimientos funcionales y no funcionales|Identificar las funciones principales del LMS y sus restricciones.|Alta|Terminado|
|Crear documento MoSCoW|Clasificar funcionalidades como Must, Should, Could y Won't.|Alta|Terminado|
|Redactar historias de usuario|Crear historias para alumno, instructor y administrador.|Alta|Terminado|
|Crear criterios de aceptación|Definir condiciones para validar cada historia de usuario.|Alta|Terminado|
|Crear diagramas de casos de uso|Representar actores y acciones principales del sistema.|Alta|Terminado|
|Diseñar modelo entidad-relación|Crear la estructura de base de datos del proyecto.|Alta|Terminado|
|Definir arquitectura de solución|Documentar la separación frontend, backend y base de datos.|Alta|Terminado|
|Configurar repositorio GitHub|Crear repositorio y estructura base del proyecto.|Alta|Terminado|
|Configurar Docker y PostgreSQL|Preparar la base de datos para ejecución en Codespaces.|Alta|Terminado|
|Crear frontend público|Desarrollar inicio, catálogo, detalle de curso, login y registro.|Alta|Terminado|
|Crear backend con Express|Implementar API REST para cursos, usuarios, compras y roles.|Alta|Terminado|
|Implementar roles|Separar permisos de Alumno, Instructor y Admin.|Alta|Terminado|
|Implementar compra de cursos|Crear flujo de orden, pago, aprobación e inscripción.|Alta|Terminado|
|Implementar pago sandbox y webhook|Simular confirmación de pago para liberar cursos.|Alta|Terminado|
|Implementar aula virtual|Mostrar módulos, lecciones y progreso del alumno.|Alta|Terminado|
|Implementar examen final|Permitir evaluación al terminar el curso.|Alta|Terminado|
|Implementar certificados|Generar certificado al aprobar el examen.|Alta|Terminado|
|Preparar documentación final|Completar README, sprints, arquitectura y evidencias.|Alta|Terminado|

\---

## Sprint 1 - 7 de mayo

### Objetivo del Sprint 1

El objetivo del Sprint 1 fue establecer la base del proyecto: documentación inicial, estructura del repositorio, diseño de base de datos, primeras pantallas y organización general de la plataforma.

### Duración aproximada

Del 7 de mayo al cierre del primer ciclo de desarrollo.

### Tareas del Sprint 1

|Tarea|Responsable sugerido|Estado|
|-|-|-|
|Crear estructura general del repositorio|Emanuel1596|Terminado|
|Crear documentación inicial de requerimientos|Emanuel1596|Terminado|
|Definir actores del sistema|Emanuel1596|Terminado|
|Redactar requerimientos funcionales y no funcionales|Emanuel1596|Terminado|
|Crear documento de tecnologías utilizadas|RandyPalacios02|Terminado|
|Crear estructura inicial del frontend|martinedgar711-lgtm|Terminado|
|Crear pantallas iniciales de inicio y cursos|martinedgar711-lgtm|Terminado|
|Diseñar modelo entidad-relación preliminar|Emanuel1596|Terminado|
|Crear scripts SQL iniciales|RandyPalacios02 / Emanuel1596|Terminado|
|Configurar entorno base del backend|XxTiny2099xX|Terminado|
|Crear endpoints iniciales de cursos|XxTiny2099xX|Terminado|
|Crear README inicial|Emanuel1596|Terminado|
|Subir avances al repositorio GitHub|Equipo|Terminado|

### Resultado del Sprint 1

Al finalizar el Sprint 1 se contaba con una estructura base del proyecto, documentación inicial, primeras pantallas del frontend, diseño inicial de base de datos y configuración del repositorio. Este sprint permitió establecer el punto de partida para la integración funcional del sistema.

\---

## Sprint 2 - 4 de junio

### Objetivo del Sprint 2

El objetivo del Sprint 2 fue integrar las funcionalidades principales del LMS: autenticación, roles, cursos dinámicos, compras, aula, progreso, examen final, certificados, panel de instructor y panel de administrador.

### Duración aproximada

Del 4 de junio al cierre de la entrega final.

### Tareas del Sprint 2

|Tarea|Responsable sugerido|Estado|
|-|-|-|
|Conectar frontend con API del backend|XxTiny2099xX|Terminado|
|Implementar registro de usuarios|XxTiny2099xX|Terminado|
|Implementar inicio de sesión|XxTiny2099xX|Terminado|
|Agregar control de sesión en frontend|ba777e|Terminado|
|Proteger pantallas según rol|ba777e|Terminado|
|Implementar catálogo dinámico de cursos|o0rafahuerta0o|Terminado|
|Implementar detalle dinámico de curso|o0rafahuerta0o|Terminado|
|Crear flujo de carrito|o0rafahuerta0o|Terminado|
|Crear orden de compra|o0rafahuerta0o|Terminado|
|Implementar pago sandbox|o0rafahuerta0o|Terminado|
|Implementar webhook de pago|o0rafahuerta0o / XxTiny2099xX|Terminado|
|Crear inscripción automática al aprobar pago|o0rafahuerta0o|Terminado|
|Implementar Mis cursos|o0rafahuerta0o|Terminado|
|Implementar aula virtual|martinedgar711-lgtm|Terminado|
|Implementar progreso de lecciones|martinedgar711-lgtm|Terminado|
|Bloquear lecciones y examen según avance|ba777e|Terminado|
|Implementar examen final|martinedgar711-lgtm|Terminado|
|Implementar resultados de examen|martinedgar711-lgtm|Terminado|
|Implementar certificado|martinedgar711-lgtm|Terminado|
|Agregar panel de instructor|ba777e|Terminado|
|Agregar configuración de examen por instructor|ba777e / martinedgar711-lgtm|Terminado|
|Agregar panel administrativo|ba777e|Terminado|
|Agregar validaciones de formularios|ba777e|Terminado|
|Ajustar estilos y navegación|Equipo|Terminado|
|Actualizar README final|Emanuel1596|Terminado|
|Integrar documentación final|Emanuel1596|Terminado|
|Preparar evidencias de commits|Equipo|Terminado|

### Resultado del Sprint 2

Al finalizar el Sprint 2, el sistema contaba con el flujo principal completo: registro, login, navegación por cursos, compra, pago sandbox, liberación del curso, aula, progreso, examen, certificado, panel de instructor y panel administrativo. También se reforzó la protección por roles y se preparó la documentación para entrega.

\---

## Flujo de trabajo utilizado

El flujo de trabajo del equipo se organizó en las siguientes etapas:

1. Análisis de requerimientos.
2. Diseño de base de datos.
3. Diseño de pantallas.
4. Desarrollo del frontend.
5. Desarrollo del backend.
6. Integración frontend-backend.
7. Pruebas del flujo de alumno.
8. Pruebas del flujo de instructor.
9. Pruebas del flujo de administrador.
10. Ajustes finales y documentación.

\---

## Evidencias de ClickUp

Las capturas de ClickUp deben guardarse en la siguiente ruta del repositorio:

```txt
docs/evidencias/clickup/
```

Nombres sugeridos de las capturas:

```txt
01\_workspace\_general.png
02\_backlog.png
03\_sprint\_1.png
04\_sprint\_2.png
05\_tarea\_detalle.png
```

Las capturas deben mostrar:

|Archivo|Evidencia esperada|
|-|-|
|01\_workspace\_general.png|Espacio de trabajo o proyecto llamado EduTech.|
|02\_backlog.png|Lista Backlog con tareas generales del proyecto.|
|03\_sprint\_1.png|Lista Sprint 1 - 7 de mayo con tareas terminadas.|
|04\_sprint\_2.png|Lista Sprint 2 - 4 de junio con tareas terminadas.|
|05\_tarea\_detalle.png|Una tarea abierta con descripción, checklist, estado y responsable.|

\---

## Relación entre commits y tareas

El historial de commits de GitHub se utilizó como evidencia del avance del proyecto. Los commits reflejan tareas como:

* Creación de documentación.
* Ajustes de frontend.
* Implementación de backend.
* Corrección de errores.
* Integración de base de datos.
* Implementación de compras.
* Implementación de progreso y aula.
* Implementación de examen y certificados.
* Ajustes de roles y seguridad.
* Actualización de README y documentación final.

Aunque algunos commits fueron pequeños o repetidos debido a correcciones constantes, estos forman parte del proceso de desarrollo e integración del sistema.

\---

## Nota sobre la evidencia de gestión

El tablero de ClickUp se integró como evidencia de la organización del proyecto en Backlog, Sprint 1 y Sprint 2. Algunas tareas fueron documentadas al cierre del proyecto con base en el historial de commits de GitHub y en las actividades realizadas por el equipo durante el desarrollo.

Esta documentación se complementa con las evidencias de GitHub, donde se observa la participación de los integrantes mediante commits, cambios de archivos, merges y ajustes realizados al proyecto.

\---

## Conclusión

La gestión del proyecto EduTech se organizó mediante una estructura basada en Scrum, separando el trabajo en Backlog, Sprint 1 y Sprint 2. Esta división permitió ordenar el desarrollo de la plataforma por etapas: documentación, arquitectura, base de datos, frontend, backend, integración y pruebas.

El resultado fue una plataforma funcional con flujo completo de alumno, instructor y administrador, además de documentación técnica y evidencias de colaboración mediante GitHub y ClickUp.

