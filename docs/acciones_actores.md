# Definición de acciones por actor

## Proyecto: EduTech - Plataforma Web de Cursos

EduTech funciona como una plataforma de venta de cursos digitales. El alumno compra cursos como productos digitales y conserva el acceso al contenido adquirido cuando el pago es aprobado.

---

## Actores considerados

- Visitante 
- Alumno 
- Instructor
- Administrador
- Pasarela de pago

---

## Tabla general de acciones por actor

| Actor | Acciones que puede realizar |
|---|---|
| Visitante | Consultar la página de inicio, ver el catálogo de cursos, consultar el detalle de un curso, registrarse como alumno, iniciar sesión, consultar páginas informativas y enviar mensajes de contacto. |
| Alumno | Iniciar sesión, editar información de cuenta, consultar cursos, ver detalle de curso, agregar o seleccionar uno o varios cursos para compra, generar una orden, pagar mediante pasarela externa, consultar historial de pedidos, acceder a cursos con pago aprobado, ver módulos, ver lecciones, reproducir videos, consultar recursos, marcar lecciones como completadas, consultar progreso, presentar examen final, consultar resultados, ver certificados, solicitar cuenta de instructor y cerrar sesión. |
| Instructor | Iniciar sesión, editar información de cuenta, acceder a su panel, crear cursos, editar sus cursos, enviar cursos a revisión, crear módulos, ordenar módulos, crear lecciones, editar lecciones, agregar videos, agregar recursos, configurar examen final, crear preguntas, crear opciones de respuesta, definir respuestas correctas, consultar alumnos inscritos en sus cursos, revisar progreso de alumnos, revisar resultados de exámenes y cerrar sesión. |
| Administrador | Iniciar sesión, editar información de cuenta, acceder al panel de administración, consultar usuarios, activar o desactivar usuarios, asignar roles, revisar solicitudes de instructor, aceptar o rechazar solicitudes, revisar cursos enviados por instructores, publicar o despublicar cursos, consultar órdenes, consultar detalles de orden, consultar pagos, revisar estados de transacciones, consultar inscripciones, supervisar reglas de acceso, supervisar seguridad del sistema y cerrar sesión. |
| Pasarela de pago | Recibir la solicitud de pago de una orden, procesar la transacción, confirmar si el pago fue aprobado, rechazado, cancelado o quedó pendiente, generar un identificador externo de pago y notificar a EduTech mediante webhook. |

---

# Acciones detalladas por actor

---

## 1. Visitante

El visitante es una persona que entra a EduTech sin iniciar sesión.

| Acción | Descripción |
|---|---|
| Consultar página de inicio | Puede ver información general de la plataforma. |
| Ver catálogo de cursos | Puede consultar los cursos publicados disponibles para compra. |
| Ver detalle de curso | Puede revisar título, descripción, precio, instructor, nivel y contenido general del curso. |
| Registrarse como alumno | Puede crear una cuenta inicial con rol de Alumno. |
| Iniciar sesión | Puede acceder al sistema si ya tiene cuenta. |
| Consultar páginas informativas | Puede ver secciones como contacto, quiénes somos o información general. |
| Enviar mensaje de contacto | Puede enviar dudas o comentarios mediante el formulario de contacto. |
| Intentar comprar | Si intenta comprar sin iniciar sesión, el sistema debe enviarlo a inicio de sesión o registro. |

---

## 2. Alumno

El alumno es un usuario registrado con rol de Alumno.

En EduTech, el alumno no paga una suscripción. Compra cursos como productos digitales.

| Acción | Descripción |
|---|---|
| Iniciar sesión | Puede acceder a su cuenta con correo y contraseña. |
| Editar información de cuenta | Puede actualizar datos personales permitidos, como nombre, apellidos, teléfono o contraseña. |
| Consultar cursos disponibles | Puede ver cursos publicados en el catálogo. |
| Ver detalle de curso | Puede revisar la información completa antes de comprar. |
| Seleccionar cursos para compra | Puede seleccionar uno o varios cursos para comprarlos dentro de una misma orden. |
| Generar orden de compra | Puede iniciar una orden pendiente con los cursos seleccionados. |
| Revisar resumen del pedido | Puede ver cursos incluidos, precio unitario, total de la orden y método de pago. |
| Pagar orden | Puede pagar la orden mediante PayPal Sandbox o Stripe Sandbox. |
| Consultar historial de pedidos | Puede revisar sus órdenes, cursos incluidos, total, estado de orden y estado del pago. |
| Acceder a cursos comprados | Puede entrar únicamente a cursos cuya orden fue completada y cuya inscripción está activa. |
| Ver módulos | Puede consultar la estructura del curso comprado. |
| Ver lecciones | Puede acceder a las lecciones desbloqueadas del curso comprado. |
| Reproducir video | Puede ver el video principal de cada lección. |
| Consultar recursos adicionales | Puede abrir o descargar materiales como PDF, enlaces, archivos o repositorios. |
| Marcar lección como completada | Puede registrar que terminó una lección. |
| Consultar progreso | Puede ver lecciones completadas y porcentaje de avance calculado. |
| Presentar examen final | Puede realizar el examen cuando cumpla las condiciones del curso. |
| Consultar resultado del examen | Puede ver su calificación y si aprobó o no. |
| Ver certificado | Puede consultar o descargar su certificado cuando complete el curso y apruebe el examen. |
| Solicitar cuenta de instructor | Puede pedir que su cuenta sea evaluada para convertirse en Instructor. |
| Cerrar sesión | Puede salir de su cuenta de forma segura. |

---

## 3. Instructor

El instructor es un usuario registrado que crea y administra contenido académico.

| Acción | Descripción |
|---|---|
| Iniciar sesión | Puede acceder al sistema con sus credenciales. |
| Editar información de cuenta | Puede actualizar sus datos personales permitidos. |
| Acceder a su panel | Puede entrar al espacio donde administra sus cursos. |
| Crear curso | Puede registrar un nuevo curso en estado inicial de borrador. |
| Editar curso | Puede modificar información de sus propios cursos. |
| Enviar curso a revisión | Puede solicitar que el administrador revise un curso antes de publicarlo. |
| Crear módulos | Puede organizar el curso en módulos. |
| Ordenar módulos | Puede definir el orden en que aparecerán los módulos. |
| Crear lecciones | Puede agregar lecciones dentro de los módulos. |
| Editar lecciones | Puede modificar título, texto, video o estado de una lección. |
| Agregar video | Puede agregar video de YouTube, Vimeo o carga local. |
| Agregar recursos adicionales | Puede asociar PDF, enlaces, archivos o repositorios a una lección. |
| Configurar examen final | Puede definir título, instrucciones, tiempo límite, intentos, calificación mínima y cantidad de preguntas. |
| Crear preguntas | Puede crear preguntas para el banco del examen. |
| Crear opciones de respuesta | Puede agregar opciones a cada pregunta. |
| Definir respuesta correcta | Puede indicar cuál opción es correcta. |
| Consultar alumnos inscritos | Puede ver alumnos que tienen inscripción activa en sus cursos. |
| Revisar progreso de alumnos | Puede consultar avance de los alumnos dentro de sus cursos. |
| Revisar resultados de exámenes | Puede consultar calificaciones e intentos de examen de sus alumnos. |
| Cerrar sesión | Puede salir de su cuenta. |

---

## 4. Administrador

El administrador supervisa el sistema.

| Acción | Descripción |
|---|---|
| Iniciar sesión | Puede acceder al panel administrativo. |
| Editar información de cuenta | Puede actualizar sus datos permitidos. |
| Consultar usuarios | Puede revisar usuarios registrados en el sistema. |
| Activar usuarios | Puede habilitar cuentas desactivadas. |
| Desactivar usuarios | Puede impedir que una cuenta inicie sesión sin borrar su historial. |
| Asignar roles | Puede cambiar el rol de una cuenta cuando exista una justificación, como una solicitud de instructor aceptada. |
| Revisar solicitudes de instructor | Puede ver solicitudes enviadas por alumnos. |
| Aceptar solicitud de instructor | Puede aprobar la solicitud y habilitar el rol de Instructor. |
| Rechazar solicitud de instructor | Puede rechazar la solicitud y registrar comentario de revisión. |
| Revisar cursos | Puede revisar cursos enviados por instructores. |
| Publicar cursos | Puede permitir que un curso aparezca en el catálogo. |
| Despublicar cursos | Puede retirar un curso del catálogo sin borrar el historial de compras o inscripciones. |
| Consultar órdenes | Puede revisar órdenes generadas por los alumnos. |
| Consultar detalles de orden | Puede revisar qué cursos incluye cada orden. |
| Consultar pagos | Puede revisar pagos, estados y datos de pasarela. |
| Consultar inscripciones | Puede revisar accesos generados por compras aprobadas. |
| Supervisar reglas de acceso | Puede revisar que solo alumnos con inscripción activa accedan a cursos. |
| Supervisar seguridad | Puede revisar configuración, accesos y comportamiento general del sistema. |
| Cerrar sesión | Puede salir del panel. |

---

## 5. Pasarela de pago

La pasarela de pago es un sistema externo, como PayPal o Stripe.

| Acción | Descripción |
|---|---|
| Recibir solicitud de pago | Recibe desde EduTech la solicitud de pago de una orden. |
| Procesar transacción | Procesa el pago en ambiente Sandbox. |
| Generar identificador externo | Devuelve un identificador externo de la transacción. |
| Confirmar resultado | Indica si el pago fue aprobado, rechazado, cancelado o quedó pendiente. |
| Notificar por webhook | Envía una notificación automática a EduTech con el resultado del pago. |

---

# Reglas importantes

## Regla 1. El visitante no compra directamente

Si una persona intenta comprar sin iniciar sesión, el sistema debe enviarla a registro o inicio de sesión.

## Regla 2. El alumno puede comprar varios cursos en una orden

Una orden puede incluir uno o varios cursos. Internamente, los cursos incluidos se guardan en el detalle de la orden.

## Regla 3. El pago pertenece a la orden

El pago confirma la transacción de la orden completa, no de una sola lección ni de un solo módulo.

## Regla 4. La inscripción se genera por curso comprado

Si una orden incluye tres cursos y el pago es aprobado, el sistema debe crear una inscripción por cada curso comprado.

## Regla 5. El instructor administra solo sus cursos

Un instructor no debe modificar cursos creados por otros instructores.

## Regla 6. El administrador supervisa, pero no debe borrar historial

Si se desactiva un usuario o se despublica un curso, las órdenes, pagos, inscripciones y certificados históricos deben conservarse.
