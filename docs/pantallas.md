# Definición de pantallas a diseñar - EduTech

## Decisión general



Para el proyecto completo se recomienda planear 25 pantallas HTML principales. Para el primer sprint se recomienda diseñar 14 pantallas HTML principales.



La razón es que el primer sprint debe demostrar el flujo principal sin intentar construir todo el sistema final. Algunas funciones pueden quedar como secciones internas, pestañas o formularios dentro de una pantalla principal.



## Totales

|Alcance|Recomendacion|Motivo|
|-|-:|-|
|Proyecto completo|25 HTML|Cubre zona pública, alumno, instructor, administrador, compra, examen y solicitudes.|
|Primer sprint|14 HTML|Permite entregar una versión defendible antes del 7 de mayo sin crear pantallas innecesarias.|

## Pantallas totales del proyecto completo

|No.|Archivo HTML|Pantalla|
|-:|-|-|
|1|index.html|Inicio|
|2|cursos.html|Catálogo de cursos|
|3|detalle-curso.html|Detalle del curso|
|4|registro.html|Registro|
|5|login.html|Inicio de sesión|
|6|quienes-somos.html|¿Quiénes somos?|
|7|contacto.html|Contacto|
|8|compra-curso.html|Compra del curso|
|9|confirmacion-compra.html|Confirmación de compra|
|10|historial-pedidos.html|Historial de pedidos|
|11|escritorio-alumno.html|Escritorio del alumno|
|12|mis-cursos.html|Mis cursos|
|13|curso-comprado.html|Vista del curso comprado|
|14|leccion.html|Lección|
|15|examen-final.html|Examen final|
|16|presentar-examen.html|Presentar examen|
|17|resultado-examen.htm|Resultado del examen|
|18|mis-certificados.html|Mis certificados|
|19|mi-cuenta.html|Mi cuenta|
|20|solicitud-instructor.html|Solicitud de instructor|
|21|escritorio-instructor.html|Escritorio del instructor|
|22|cursos-instructor.html|Cursos del instructor|
|23|administrar-curso.html|Administrar curso|
|24|escritorio-admin.html|Escritorio del administrador|
|25|panel-admin.html|Panel administrativo|

## Pantallas para el primer sprint

|No.|Archivo HTML|Pantalla|Explicación breve|Requerimientos que cubre|
|-:|-|-|-|-|
|1|index.html|Inicio|Presentar EduTech, mostrar cursos destacados y dirigir a cursos, registro o login.|RF-08, RF-09|
|2|cursos.html|Catálogo de cursos|Mostrar cursos publicados disponibles para compra.|RF-08, RF-09, RF-12|
|3|detalle-curso.html|Detalle del curso|Mostrar descripción, módulos, lecciones, instructor, nivel, precio y acción de compra.|RF-10, RF-11, RF-13|
|4|registro.html|Registro|Crear cuenta de Alumno y validar datos de registro.|RF-01, RF-02|
|5|login.html|Inicio de sesión|Permitir acceso y redireccionar según rol.|RF-03, RF-05, RF-06|
|6|compra-curso.html|Compra del curso|Mostrar datos de contacto, facturación opcional, resumen y botón de pago externo.|RF-13, RF-14, RF-15, RF-16, RF-17, RF-18|
|7|confirmacion-compra.html|Confirmación de compra|Mostrar resultado de pago y explicar si el curso se libera o no.|RF-19, RF-20, RF-21, RF-22, RF-23, RF-24, RF-27|
|8|escritorio-alumno.html|Escritorio del alumno|Mostrar resumen de cursos, progreso, pedidos y certificados.|RF-25, RF-26, RF-28, RF-39, RF-57|
|9|mis-cursos.html|Mis cursos|Listar cursos con pago aprobado e inscripción activa.|RF-23, RF-26, RF-27, RF-28|
|10|curso-comprado.html|Vista del curso comprado|Mostrar aula virtual con módulos, lecciones y progreso.|RF-29, RF-30, RF-31, RF-37, RF-38, RF-39|
|11|leccion.html|Lección|Mostrar video, texto, recursos y acción de completar lección.|RF-32, RF-33, RF-34, RF-35, RF-36, RF-37, RF-38|
|12|examen-final.html|Examen final|Mostrar instrucciones, tiempo límite, intentos y condiciones para presentar.|RF-40, RF-45, RF-46, RF-47, RF-48, RF-49, RF-54|
|13|administrar-curso.html|Administrar curso|Unificar administración del instructor: curso, módulos, lecciones, recursos, examen y alumnos.|RF-41, RF-42, RF-43, RF-44, RF-59, RF-60, RF-61, RF-62, RF-63, RF-64, RF-65, RF-66|
|14|panel-admin.html|Panel administrativo|Unificar funciones del administrador: usuarios, roles, solicitudes, cursos, pagos, inscripciones y seguridad.|RF-67, RF-68, RF-69, RF-70, RF-71, RF-72, RF-73, RF-74, RF-76, RF-77, RF-78|
