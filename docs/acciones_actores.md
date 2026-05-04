# Definición de acciones por actor

## Proyecto: EduTech - Plataforma Web de Cursos

La finalidad es dejar claro qué permisos, responsabilidades y límites tiene cada actor.

EduTech funciona como una plataforma de venta de cursos digitales. Es decir, el alumno compra un curso y conserva el acceso al contenido adquirido. No se maneja como suscripción.


## Actores considerados

Los actores principales del sistema son:

- Visitante
- Alumno
- Instructor
- Administrador
- Pasarela de pago

---

## Tabla general de acciones por actor

| Actor | Acciones que puede realizar |
|---|---|
| Visitante | Consultar la página de inicio, ver el catálogo de cursos, consultar el detalle de un curso, registrarse como alumno, iniciar sesión, consultar páginas informativas como contacto o quiénes somos y solicitar cuenta de instructor. |
| Alumno | Iniciar sesión, editar su información de cuenta, consultar cursos disponibles, ver detalle de curso, comprar cursos, pagar mediante pasarela externa, consultar historial de pedidos, acceder a cursos comprados, ver módulos, ver lecciones, reproducir videos, consultar recursos adicionales, marcar lecciones como completadas, consultar su progreso, presentar el examen final, consultar resultados, ver certificados, solicitar cuenta de instructor y cerrar sesión. |
| Instructor | Iniciar sesión, editar su información de cuenta, acceder a su panel, crear cursos, editar sus cursos, enviar cursos a revisión, crear módulos, ordenar módulos, crear lecciones, editar lecciones, agregar videos, agregar recursos adicionales, configurar el examen final, crear preguntas, crear opciones de respuesta, definir respuestas correctas, consultar alumnos inscritos en sus cursos, revisar progreso de alumnos, revisar resultados de exámenes y cerrar sesión. |
| Administrador | Iniciar sesión, editar su información de cuenta, acceder al panel de administración, consultar usuarios, activar usuarios, desactivar usuarios, asignar roles, revisar solicitudes de instructor, aceptar solicitudes de instructor, rechazar solicitudes de instructor, crear o habilitar cuentas de instructor, revisar cursos creados por instructores, publicar cursos, despublicar cursos del catálogo, consultar órdenes, consultar pagos, revisar estados de transacciones, consultar inscripciones, supervisar reglas de acceso, supervisar seguridad del sistema y cerrar sesión. |
| Pasarela de pago | Recibir la solicitud de pago, procesar el pago, confirmar si el pago fue aprobado, rechazado, cancelado o quedó pendiente, generar un identificador externo de pago y notificar a EduTech mediante webhook. |

---

# Acciones detalladas por actor

---

## 1. Visitante

El visitante es una persona que entra a EduTech sin haber iniciado sesión.

Puede consultar información pública, crear una cuenta como alumno o solicitar que se revise su perfil para convertirse en instructor.

| Acción | Descripción |
|---|---|
| Consultar página de inicio | Puede ver información general de la plataforma. |
| Ver catálogo de cursos | Puede consultar los cursos publicados disponibles para compra. |
| Ver detalle de curso | Puede revisar información de un curso, como título, descripción, precio, módulos generales, lecciones generales e instructor. |
| Registrarse como alumno | Puede crear una cuenta inicial con rol de Alumno. |
| Iniciar sesión | Puede entrar al sistema si ya tiene una cuenta. |
| Consultar páginas informativas | Puede ver secciones como contacto o quiénes somos. |
| Solicitar cuenta de instructor | Puede llenar un formulario para pedir que el administrador revise si puede ser habilitado como Instructor. |

---

## 2. Alumno

El alumno es un usuario registrado con rol de Alumno.

En EduTech, el alumno no se suscribe temporalmente a un curso. El alumno compra un curso como producto digital y conserva el acceso al contenido adquirido.

| Acción | Descripción |
|---|---|
| Iniciar sesión | Puede acceder a su cuenta con correo y contraseña. |
| Editar información de cuenta | Puede actualizar datos personales permitidos, como nombre, apellidos, teléfono o contraseña. |
| Consultar cursos disponibles | Puede ver los cursos publicados en el catálogo. |
| Ver detalle de curso | Puede consultar información completa del curso antes de comprarlo. |
| Comprar curso | Puede iniciar una orden de compra para adquirir un curso. |
| Pagar curso | Puede pagar mediante una pasarela externa, como PayPal o Stripe. |
| Consultar historial de pedidos | Puede revisar sus órdenes de compra y el estado de cada una. |
| Acceder a cursos comprados | Puede entrar a los cursos que haya comprado y cuyo pago haya sido aprobado. |
| Ver módulos | Puede consultar la estructura del curso comprado. |
| Ver lecciones | Puede acceder a las lecciones del curso comprado. |
| Reproducir video | Puede ver el video principal de cada lección. |
| Consultar recursos adicionales | Puede abrir o descargar materiales asociados a la lección, como PDF, enlaces, archivos o repositorios. |
| Marcar lección como completada | Puede registrar que terminó una lección. |
| Consultar progreso | Puede ver cuántas lecciones ha completado y su porcentaje de avance. |
| Presentar examen final | Puede realizar el examen final cuando cumpla las condiciones del curso. |
| Consultar resultado del examen | Puede ver su calificación y si aprobó o no. |
| Ver certificado | Puede consultar o descargar su certificado si completó el curso y aprobó el examen final. |
| Solicitar cuenta de instructor | Puede solicitar que su cuenta sea evaluada para convertirse en Instructor. |
| Cerrar sesión | Puede salir de su cuenta de forma segura. |

---

## 3. Instructor

El instructor es un usuario registrado que crea y administra contenido académico.

El instructor no se registra directamente desde el formulario público como instructor. Para evitar que cualquier persona publique cursos sin control, primero debe existir una solicitud o una habilitación por parte del administrador.

| Acción | Descripción |
|---|---|
| Iniciar sesión | Puede acceder al sistema con sus credenciales. |
| Editar información de cuenta | Puede actualizar sus datos personales permitidos, como nombre, apellidos, teléfono o contraseña. |
| Acceder a su panel | Puede entrar al espacio donde administra sus cursos. |
| Crear curso | Puede registrar un nuevo curso. Al crearlo, el curso puede quedar inicialmente en estado `borrador`. |
| Editar curso | Puede modificar la información de sus propios cursos. |
| Enviar curso a revisión | Puede solicitar que el administrador revise un curso antes de publicarlo. |
| Crear módulos | Puede organizar el curso en módulos. |
| Ordenar módulos | Puede definir el orden en que aparecerán los módulos. |
| Crear lecciones | Puede agregar lecciones dentro de los módulos. |
| Editar lecciones | Puede modificar título, texto, video o estado de una lección. |
| Agregar video | Puede agregar video de YouTube, Vimeo o carga local. |
| Agregar recursos adicionales | Puede asociar PDF, enlaces, archivos o repositorios a una lección. |
| Configurar examen final | Puede definir título, instrucciones, tiempo límite, intentos, calificación mínima y cantidad de preguntas. |
| Crear preguntas | Puede crear preguntas para el banco del examen. |
| Crear opciones de respuesta | Puede agregar opciones de respuesta a cada pregunta. |
| Definir respuesta correcta | Puede indicar cuál opción es correcta. |
| Consultar alumnos inscritos | Puede ver qué alumnos compraron y tienen acceso a sus cursos. |
| Revisar progreso de alumnos | Puede consultar el avance de los alumnos en sus cursos. |
| Revisar resultados de exámenes | Puede ver calificaciones e intentos de examen de sus alumnos. |
| Cerrar sesión | Puede salir de su cuenta de forma segura. |

---

## 4. Administrador

El administrador es el usuario encargado de supervisar el funcionamiento general del sistema.

Su función principal no es consumir cursos, sino controlar usuarios, roles, cursos, pagos, inscripciones, solicitudes de instructor y reglas de acceso.

| Acción | Descripción |
|---|---|
| Iniciar sesión | Puede acceder al sistema con permisos administrativos. |
| Editar información de cuenta | Puede actualizar sus propios datos permitidos. |
| Acceder al panel de administración | Puede entrar al espacio de control general del sistema. |
| Consultar usuarios | Puede ver los usuarios registrados en la plataforma. |
| Activar usuarios | Puede habilitar una cuenta que estaba desactivada para permitir que vuelva a iniciar sesión y usar el sistema. |
| Desactivar usuarios | Puede bloquear temporalmente una cuenta sin eliminar su información histórica. |
| Asignar roles | Puede definir si un usuario tendrá rol de Alumno, Instructor o Administrador. |
| Revisar solicitudes de instructor | Puede consultar las solicitudes enviadas por visitantes o alumnos que desean ser instructores. |
| Aceptar solicitud de instructor | Puede aprobar una solicitud y crear o habilitar una cuenta con rol de Instructor. |
| Rechazar solicitud de instructor | Puede rechazar una solicitud si no cumple con los criterios necesarios. |
| Crear o habilitar cuentas de instructor | Puede crear una cuenta de instructor o cambiar el rol de un usuario existente para que pueda administrar cursos. |
| Revisar cursos | Puede consultar los cursos creados por instructores. |
| Publicar cursos | Puede hacer visible un curso en el catálogo para que pueda venderse. |
| Despublicar cursos del catálogo | Puede retirar un curso del catálogo para que ya no esté disponible para nuevas compras. Esto no debe quitar el acceso a alumnos que ya compraron el curso. |
| Consultar órdenes | Puede revisar pedidos realizados por alumnos. |
| Consultar pagos | Puede revisar pagos asociados a órdenes. |
| Revisar estados de transacciones | Puede consultar si una transacción está pendiente, aprobada, rechazada, cancelada, fallida o expirada. |
| Consultar inscripciones | Puede revisar qué alumnos tienen acceso a qué cursos. |
| Supervisar reglas de acceso | Puede revisar que los usuarios accedan solo a lo que les corresponde. |
| Supervisar seguridad del sistema | Puede revisar aspectos relacionados con permisos, acceso a contenido y protección de exámenes. |
| Cerrar sesión | Puede salir de su cuenta de forma segura. |

---

## 5. Pasarela de pago

La pasarela de pago es un sistema externo, como PayPal o Stripe.

No administra cursos, usuarios ni contenido. Su función es procesar pagos y notificar el resultado a EduTech.

| Acción | Descripción |
|---|---|
| Recibir solicitud de pago | Recibe la información enviada por EduTech para iniciar el cobro. |
| Procesar pago | Valida y procesa la transacción del alumno. |
| Confirmar pago aprobado | Notifica que el pago fue exitoso. |
| Confirmar pago rechazado | Notifica que el pago no fue aceptado. |
| Confirmar pago cancelado | Notifica que el usuario canceló el proceso de pago. |
| Mantener pago pendiente | Puede dejar el pago en espera si aún no se confirma. |
| Generar identificador externo | Genera un identificador propio de la pasarela para la transacción. |
| Enviar webhook | Notifica automáticamente a EduTech el resultado del pago. |

---

# Solicitud de cuenta de instructor

Para evitar que cualquier persona se registre directamente como Instructor, EduTech puede incluir una opción llamada **Solicitar cuenta de instructor**.

Esta opción puede aparecer en la página de contacto, en el menú principal o dentro de la cuenta del alumno.

El objetivo es que una persona interesada en crear cursos llene un formulario con información básica para que el administrador revise si puede habilitarle una cuenta de Instructor.

