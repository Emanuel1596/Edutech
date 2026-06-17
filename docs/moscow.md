# Priorización MoSCoW - EduTech

## Proyecto

EduTech - Plataforma web para venta y consumo de cursos en línea.

## Objetivo del documento

Clasificar los requerimientos del sistema por prioridad usando la técnica MoSCoW:

- **Must have:** indispensable para que el sistema funcione.
- **Should have:** importante, pero no bloquea la operación básica.
- **Could have:** deseable si hay tiempo.
- **Won't have:** fuera del alcance de esta entrega.

---

## Must have - Debe tener

| ID | Requerimiento | Justificación |
|---|---|---|
| M-01 | Registro de alumnos | Sin registro no se puede identificar al usuario ni asociar compras, progreso o certificados. |
| M-02 | Inicio y cierre de sesión | Es necesario para proteger la cuenta y separar las funciones por usuario. |
| M-03 | Control de acceso por rol | El alumno, instructor y administrador no deben acceder a funciones que no les corresponden. |
| M-04 | Catálogo de cursos | Es la entrada principal para que el usuario consulte la oferta de cursos. |
| M-05 | Detalle de curso | El alumno debe revisar contenido, instructor, precio y lecciones antes de comprar. |
| M-06 | Carrito y compra de cursos | Permite seleccionar uno o varios cursos y generar una orden de compra. |
| M-07 | Orden de compra | La compra necesita registrarse antes de procesar el pago. |
| M-08 | Pago sandbox | Permite simular el proceso de pago sin usar dinero real. |
| M-09 | Webhook de pago | El backend debe confirmar el pago y liberar el curso desde servidor, no solo desde el frontend. |
| M-10 | Inscripción automática | Después de pagar, el alumno debe obtener acceso al curso comprado. |
| M-11 | Área de Mis cursos | El alumno debe ver únicamente los cursos que ya compró. |
| M-12 | Aula del curso | El alumno debe poder consultar módulos, lecciones, contenido y recursos. |
| M-13 | Progreso por lección | El sistema debe guardar qué lecciones completó el alumno. |
| M-14 | Bloqueo secuencial | El sistema debe evitar que el alumno avance sin completar las lecciones requeridas. |
| M-15 | Examen final | El alumno debe presentar una evaluación al terminar el curso. |
| M-16 | Resultado del examen | El sistema debe calcular y guardar la calificación del intento. |
| M-17 | Certificado | Si el alumno aprueba, el sistema debe generar un certificado con datos del alumno, curso, fecha y código. |
| M-18 | Panel de instructor | El instructor debe administrar sus cursos, módulos, lecciones y examen. |
| M-19 | Panel de administrador | El administrador debe revisar usuarios, cursos, pagos, solicitudes y roles. |
| M-20 | Base de datos relacional | PostgreSQL debe guardar usuarios, cursos, órdenes, pagos, inscripciones, progreso, exámenes y certificados. |

---

## Should have - Debería tener

| ID | Requerimiento | Justificación |
|---|---|---|
| S-01 | Solicitud para ser instructor | Permite que un alumno solicite cambio de rol o autorización. |
| S-02 | Validaciones visuales en formularios | Mejora la experiencia y evita datos incorrectos. |
| S-03 | Edición de perfil | El usuario puede corregir sus datos personales. |
| S-04 | Historial de compras | Ayuda al alumno y al administrador a consultar órdenes anteriores. |
| S-05 | Revisión administrativa de cursos | Permite controlar cursos publicados o pendientes. |
| S-06 | Consulta de pagos en administrador | Facilita revisar pagos aprobados, pendientes o rechazados. |
| S-07 | Vista previa de cursos | Permite verificar el contenido antes de publicarlo o comprarlo. |
| S-08 | Descarga o impresión del certificado | Mejora la utilidad del certificado generado. |
| S-09 | Confirmación de compra aprobada | Da retroalimentación clara al usuario después del pago. |
| S-10 | Mensajes de error claros | Ayuda a entender por qué una acción no se pudo completar. |

---

## Could have - Podría tener

| ID | Requerimiento | Justificación |
|---|---|---|
| C-01 | Envío de correos automáticos | Sería útil para confirmar registro, compra o contacto, pero no es indispensable para esta entrega. |
| C-02 | Pasarela real en producción | Para la entrega se usa sandbox; producción queda como mejora futura. |
| C-03 | Videos en servidor externo | Mejora rendimiento, pero el prototipo puede trabajar con contenido embebido o local. |
| C-04 | Buscador avanzado de cursos | Facilita filtrar por categoría, nivel o instructor. |
| C-05 | Estadísticas avanzadas para instructor | Permite analizar desempeño de alumnos, pero no es básico para el flujo principal. |
| C-06 | Verificación pública de certificado por URL | El código ya permite identificar el certificado; una pantalla pública puede quedar como mejora. |
| C-07 | Recuperación real de contraseña por correo | Puede agregarse cuando exista servicio SMTP configurado. |
| C-08 | Subida de archivos desde panel | El prototipo puede usar rutas o archivos ya existentes. |

---

## Won't have - No se incluye en esta entrega

| ID | Requerimiento | Justificación |
|---|---|---|
| W-01 | Aplicación móvil nativa | El alcance es una aplicación web. |
| W-02 | Clases en vivo | El sistema se enfoca en cursos grabados o contenido estructurado. |
| W-03 | Chat en tiempo real | No es necesario para demostrar compra, acceso, progreso, examen y certificado. |
| W-04 | Facturación fiscal | Queda fuera del alcance académico del prototipo. |
| W-05 | Pagos reales con dinero | Se usa sandbox para evitar transacciones reales. |
| W-06 | Microservicios | La arquitectura usada es una API monolítica organizada por rutas, controladores y servicios. |
| W-07 | Inteligencia artificial para recomendaciones | No es parte de los requerimientos principales. |

---

## Conclusión

La prioridad del proyecto EduTech se centra en demostrar el ciclo principal: registro, inicio de sesión, consulta de cursos, compra, confirmación de pago, inscripción, avance del curso, examen final y certificado. Las funciones administrativas e instructor se consideran indispensables para completar los roles principales del sistema.
