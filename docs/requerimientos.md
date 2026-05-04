# Requerimientos del Sistema EduTech

Este documento contiene los requerimientos funcionales y no funcionales del sistema **EduTech**, una plataforma web para la venta de cursos en línea.

---

## Índice

- [A. Usuarios, registro y acceso](#a-usuarios-registro-y-acceso)
- [B. Cursos](#b-cursos)
- [C. Compra, orden y pago](#c-compra-orden-y-pago)
- [D. Inscripción y acceso](#d-inscripción-y-acceso)
- [E. Módulos y lecciones](#e-módulos-y-lecciones)
- [F. Progreso del curso](#f-progreso-del-curso)
- [G. Examen final](#g-examen-final)
- [H. Finalización y certificado](#h-finalización-y-certificado)
- [I. Instructor](#i-instructor)
- [J. Administrador](#j-administrador)
- [K. Cuenta y solicitudes](#k-cuenta-y-solicitudes)
- [3. Requerimientos no funcionales](#3-requerimientos-no-funcionales)

---

# A. Usuarios, registro y acceso

## RF-01. Registro de alumno

El sistema debe permitir que un visitante cree una cuenta con rol de Alumno proporcionando nombre, apellidos, correo electrónico, confirmación de correo, contraseña y confirmación de contraseña.

**Ejemplo de uso:**  
Un visitante entra a la página de registro, escribe su nombre, apellidos, correo y contraseña. Después presiona “Registrarse” y el sistema crea su cuenta con rol de Alumno.

---

## RF-02. Validación del registro

El sistema debe validar que el correo tenga formato correcto, que la confirmación del correo coincida, que el nombre y apellidos solo contengan letras, espacios, acentos y ñ, que la contraseña cumpla los requisitos mínimos y que la confirmación de contraseña coincida.

**Ejemplo de uso:**  
Si el alumno escribe `Emanuel123` como nombre o `Villanueva@García` como apellido, el sistema debe mostrar un error y no permitir el registro.

---

## RF-03. Inicio de sesión

El sistema debe permitir que los usuarios inicien sesión usando correo electrónico y contraseña.

**Ejemplo de uso:**  
Un alumno escribe su correo y contraseña para entrar a su escritorio y consultar sus cursos comprados.

---

## RF-04. Cierre de sesión

El sistema debe permitir que los usuarios cierren sesión de forma segura.

**Ejemplo de uso:**  
El alumno presiona “Cerrar sesión” y el sistema termina su sesión para que nadie más pueda usar su cuenta desde ese navegador.

---

## RF-05. Manejo de roles

El sistema debe manejar tres roles principales: Alumno, Instructor y Administrador.

**Ejemplo de uso:**  
Un usuario con rol de Alumno entra al panel de alumno, un Instructor entra al panel de gestión de cursos y un Administrador entra al panel general del sistema.

---

## RF-06. Control de acceso por rol

El sistema debe permitir que cada usuario acceda únicamente a las funciones correspondientes a su rol.

**Ejemplo de uso:**  
Un alumno no debe poder entrar al panel del instructor ni al panel del administrador, aunque intente abrir la URL directamente.

---

## RF-07. Edición de información de cuenta

El sistema debe permitir que los usuarios autenticados editen información personal permitida, como nombre, apellidos, teléfono o contraseña.

**Ejemplo de uso:**  
Un alumno entra a “Mi cuenta” y actualiza su teléfono. El sistema guarda el cambio.

---

# B. Cursos

## RF-08. Catálogo de cursos

El sistema debe permitir que visitantes y alumnos consulten los cursos publicados disponibles para compra.

**Ejemplo de uso:**  
Una persona entra a la sección “Cursos” y ve una lista de cursos publicados con su información principal y precio.

---

## RF-09. Información visible del curso

El sistema debe mostrar por cada curso imagen de portada, nombre, descripción, instructor, nivel, número de lecciones y precio en pesos mexicanos.

**Ejemplo de uso:**  
En el catálogo aparece una tarjeta con el curso “Programación Orientada a Objetos con Java”, su portada, instructora, nivel intermedio, número de lecciones y precio.

---

## RF-10. Detalle del curso

El sistema debe permitir consultar el detalle de un curso, incluyendo descripción, módulos, lecciones, instructor, nivel y precio.

**Ejemplo de uso:**  
Antes de comprar, el alumno abre el curso y revisa qué temas contiene, quién lo imparte y cuánto cuesta.

---

## RF-11. Cursos únicamente de pago

El sistema debe manejar únicamente cursos de pago.

**Ejemplo de uso:**  
El alumno no puede inscribirse directamente a un curso sin pagar; primero debe completar el proceso de compra.

---

## RF-12. Precio en pesos mexicanos

El sistema debe registrar y mostrar el precio de los cursos en pesos mexicanos.

**Ejemplo de uso:**  
Un curso aparece con precio de `$299 MXN` en el catálogo y en el resumen del pedido.

---

# C. Compra, orden y pago

## RF-13. Inicio de compra

El sistema debe permitir que un alumno autenticado inicie la compra de un curso. Si un visitante intenta comprar, el sistema debe solicitarle iniciar sesión o registrarse primero.

**Ejemplo de uso:**  
El visitante presiona “Comprar” en un curso. El sistema lo dirige a iniciar sesión o registrarse antes de continuar con la compra.

---

## RF-14. Información de contacto para compra

El sistema debe solicitar datos de contacto para la compra, como nombre, apellidos, correo electrónico y teléfono. Si el alumno ya tiene esos datos registrados, el sistema puede precargarlos para facilitar el proceso.

Los datos como dirección, ciudad, estado y código postal pueden manejarse como información opcional de facturación.

**Ejemplo de uso:**  
Antes de pagar, el alumno revisa su nombre, correo y teléfono. Si necesita facturación, también puede capturar dirección, ciudad, estado y código postal.

---

## RF-15. Resumen del pedido

El sistema debe mostrar un resumen del pedido antes de pagar, incluyendo curso seleccionado, precio, total y método de pago.

**Ejemplo de uso:**  
Antes de ir a PayPal, el alumno ve que comprará el curso “Java desde cero” por `$299 MXN` y que el método de pago será PayPal.

---

## RF-16. Creación de orden pendiente

El sistema debe crear una orden con estado pendiente cuando el alumno autenticado inicia el proceso de compra. La orden debe tener un número visible generado por el sistema.

**Ejemplo de uso:**  
El alumno presiona “Comprar” y el sistema genera la orden `ORD-2026-000015` con estado `pendiente` mientras espera la confirmación de PayPal o Stripe.

---

## RF-17. Botón de pago externo

El sistema debe mostrar un botón de pago con PayPal Sandbox o Stripe Sandbox.

**Ejemplo de uso:**  
En la pantalla de compra aparece un botón que dice “Pagar con PayPal” o “Pagar con Stripe”.

---

## RF-18. Procesamiento del pago en Sandbox

El sistema debe enviar la solicitud de pago a la pasarela externa en ambiente Sandbox.

**Ejemplo de uso:**  
El alumno presiona “Pagar con PayPal”, inicia sesión en PayPal Sandbox y realiza un pago de prueba.

---

## RF-19. Webhook de confirmación de pago

El sistema debe recibir una notificación automática mediante webhook cuando PayPal o Stripe confirme el resultado del pago.

**Ejemplo de uso:**  
Después de que PayPal aprueba el pago, PayPal envía una notificación automática a EduTech para avisar que la compra fue exitosa.

---

## RF-20. Validación del pago

El sistema debe validar que el pago recibido corresponda al alumno, curso, orden, monto y moneda correctos.

**Ejemplo de uso:**  
Si la orden era por `$299 MXN`, el sistema debe comprobar que PayPal confirmó ese monto, esa moneda y esa orden antes de liberar el curso.

---

## RF-21. Estados de pago

El sistema debe manejar estados de pago como pendiente, aprobado, rechazado o cancelado.

**Ejemplo de uso:**  
Si PayPal confirma correctamente la transacción, el pago queda como `aprobado`. Si PayPal rechaza la transacción, el pago queda como `rechazado`. Si el alumno cancela el proceso en PayPal, el pago queda como `cancelado`.

---

## RF-22. Estados de orden

El sistema debe manejar estados de orden como pendiente, completada, cancelada, fallida o expirada.

**Ejemplo de uso:**  
Cuando el alumno inicia una compra, EduTech crea una orden con estado `pendiente`. Si el pago es aprobado, la orden cambia a `completada`. Si el pago es rechazado, la orden cambia a `fallida`. Si el alumno cancela el pago, la orden cambia a `cancelada`. Si la orden queda mucho tiempo sin pago confirmado, puede cambiar a `expirada`.

---

## RF-23. Liberación automática del curso

El sistema debe liberar el acceso al curso únicamente cuando el pago sea confirmado como aprobado y la orden quede completada.

**Ejemplo de uso:**  
Cuando PayPal confirma el pago, EduTech actualiza el pago como `aprobado`, cambia la orden a `completada`, crea la inscripción y muestra el curso en “Mis cursos”.

---

## RF-24. Bloqueo por pago no aprobado

El sistema no debe permitir que el alumno acceda al curso si el pago está pendiente, rechazado o cancelado, o si la orden está pendiente, fallida, cancelada o expirada.

**Ejemplo de uso:**  
Si el alumno tiene una orden pendiente o un pago rechazado, puede ver el registro en su historial de pedidos, pero no puede entrar al contenido del curso.

---

## RF-25. Historial de pedidos

El sistema debe permitir que el alumno consulte su historial de pedidos, incluyendo número de orden, curso, fecha, total, estado de la orden y estado del pago cuando exista.

**Ejemplo de uso:**  
El alumno entra a “Historial de pedidos” y ve la orden `ORD-2026-000015`, el curso comprado, el total de `$299 MXN`, el estado de orden `completada` y el estado de pago `aprobado`.

---

## RF-26. Mis cursos

El sistema debe mostrar en “Mis cursos” únicamente los cursos cuya compra fue aprobada y cuya inscripción está activa.

**Ejemplo de uso:**  
Una orden pendiente aparece en “Historial de pedidos”, pero el curso solo aparece en “Mis cursos” cuando el pago fue aprobado.

---

# D. Inscripción y acceso

## RF-27. Inscripción automática

El sistema debe crear automáticamente la inscripción del alumno al curso cuando el pago sea aprobado y la orden quede completada.

**Ejemplo de uso:**  
Después de que PayPal confirma el pago, EduTech registra que el alumno ya tiene acceso al curso comprado.

---

## RF-28. Acceso solo a cursos comprados

El sistema debe permitir que el alumno acceda únicamente a los cursos que haya comprado correctamente.

**Ejemplo de uso:**  
Si el alumno compró el curso de Java, puede entrar a ese curso, pero no al curso de Python si no lo ha comprado.

---

# E. Módulos y lecciones

## RF-29. Organización por módulos

El sistema debe permitir que cada curso esté organizado en módulos.

**Ejemplo de uso:**  
Un curso puede tener módulos como “Introducción”, “Variables”, “Funciones” y “Examen final”.

---

## RF-30. Datos del módulo

Cada módulo debe tener título y número de orden dentro del curso.

**Ejemplo de uso:**  
El módulo 1 se llama “Introducción a la programación” y aparece antes del módulo 2 llamado “Tipos de datos y variables”.

---

## RF-31. Organización por lecciones

El sistema debe permitir que cada módulo tenga varias lecciones.

**Ejemplo de uso:**  
El módulo “Branches” puede contener las lecciones “¿Qué son las branches?” y “Git Diff + Merge”.

---

## RF-32. Datos de la lección

Cada lección debe tener título, número de orden, texto descriptivo, video y recursos adicionales cuando correspondan.

**Ejemplo de uso:**  
Una lección llamada “Entidades y Atributos” puede tener una explicación escrita, un video de YouTube y un enlace al material de clase.

---

## RF-33. Visualización de lecciones

El sistema debe permitir que el alumno visualice las lecciones de los cursos a los que tiene acceso.

**Ejemplo de uso:**  
El alumno entra a una lección y puede ver el video, leer el texto descriptivo y abrir los recursos adicionales.

---

## RF-34. Videos de lección

El sistema debe permitir videos embebidos desde YouTube o Vimeo, o videos cargados localmente de forma optimizada.

**Ejemplo de uso:**  
El instructor agrega un enlace de YouTube y el video se reproduce dentro de EduTech sin que el alumno salga de la plataforma.

---

## RF-35. Recursos adicionales

El sistema debe permitir agregar recursos adicionales a las lecciones, como enlaces, archivos descargables o repositorios.

**Ejemplo de uso:**  
Una lección puede incluir un PDF descargable, un enlace a documentación, un archivo de práctica o un repositorio de GitHub.

---

# F. Progreso del curso

## RF-36. Marcar lección como completada

El sistema debe permitir que el alumno marque una lección como completada.

**Ejemplo de uso:**  
Después de ver una lección, el alumno presiona “Marcar como completada” y el sistema guarda su avance.

---

## RF-37. Avance secuencial obligatorio

El sistema debe bloquear la siguiente lección hasta que el alumno complete la anterior.

**Ejemplo de uso:**  
El alumno no puede abrir la lección 3 si todavía no ha completado la lección 2.

---

## RF-38. Registro de progreso

El sistema debe guardar el progreso del alumno en cada curso.

**Ejemplo de uso:**  
Si el alumno completó 5 lecciones y cierra sesión, al volver el sistema debe conservar esas 5 lecciones como completadas.

---

## RF-39. Consulta de progreso

El sistema debe mostrar cuántas lecciones ha completado el alumno y el porcentaje de avance del curso.

**Ejemplo de uso:**  
El sistema muestra “8 de 20 lecciones completadas”, equivalente al 40% del curso.

---

# G. Examen final

## RF-40. Examen final por curso

El sistema debe permitir que cada curso tenga un examen final.

**Ejemplo de uso:**  
Al terminar las lecciones, el alumno encuentra un módulo llamado “Examen final”.

---

## RF-41. Banco de preguntas

El sistema debe permitir que el instructor cree un banco de preguntas para el examen final.

**Ejemplo de uso:**  
El instructor registra 40 preguntas, aunque cada alumno solo responderá 20 en su intento.

---

## RF-42. Preguntas de opción múltiple

El sistema debe permitir preguntas de opción múltiple.

**Ejemplo de uso:**  
Una pregunta puede tener cuatro posibles respuestas y el alumno debe seleccionar una.

---

## RF-43. Opciones de respuesta

Cada pregunta debe tener varias opciones de respuesta.

**Ejemplo de uso:**  
La pregunta “¿Qué es Git?” puede tener opciones como “Sistema de control de versiones”, “Lenguaje de programación”, “Base de datos” y “Editor de texto”.

---

## RF-44. Respuesta correcta

El sistema debe permitir que el instructor defina cuál opción es la correcta.

**Ejemplo de uso:**  
En la pregunta “¿Qué es Git?”, el instructor marca “Sistema de control de versiones” como respuesta correcta.

---

## RF-45. Generación aleatoria del examen

El sistema debe generar el examen seleccionando preguntas aleatorias desde el banco de preguntas.

**Ejemplo de uso:**  
Dos alumnos presentan el mismo examen final, pero cada uno recibe preguntas diferentes tomadas del mismo banco.

---

## RF-46. Cantidad de preguntas por examen

El sistema debe permitir configurar cuántas preguntas aparecerán en cada intento.

**Ejemplo de uso:**  
El instructor configura que el examen muestre 20 preguntas aleatorias de un banco de 40.

---

## RF-47. Tiempo límite programable

El sistema debe permitir configurar el tiempo límite del examen.

**Ejemplo de uso:**  
El instructor configura que el examen final tenga una duración máxima de 20 minutos.

---

## RF-48. Número máximo de intentos

El sistema debe permitir configurar el número máximo de intentos.

**Ejemplo de uso:**  
El instructor configura que el alumno solo pueda presentar el examen final dos veces.

---

## RF-49. Calificación mínima aprobatoria

El sistema debe permitir definir la calificación mínima aprobatoria.

**Ejemplo de uso:**  
El instructor define que el alumno necesita mínimo 70% de respuestas correctas para aprobar.

---

## RF-50. Registro y estados del intento

El sistema debe guardar cada intento del alumno en el examen final, incluyendo número de intento, fecha de inicio, fecha de finalización, estado del intento, calificación y aprobación. Los estados del intento pueden ser `en_progreso`, `finalizado`, `invalidado` o `abandonado`.

**Ejemplo de uso:**  
Cuando el alumno inicia el examen, el intento queda en estado `en_progreso`. Cuando envía sus respuestas, queda `finalizado` con su calificación. Si cierra el examen antes de terminar, puede quedar como `abandonado`.

---

## RF-51. Registro de respuestas

El sistema debe guardar las respuestas seleccionadas por el alumno.

**Ejemplo de uso:**  
Si el alumno selecciona la opción B en una pregunta, el sistema guarda esa respuesta para calcular su calificación.

---

## RF-52. Cálculo automático de calificación

El sistema debe calcular automáticamente la calificación obtenida.

**Ejemplo de uso:**  
Si el alumno responde correctamente 14 de 20 preguntas, el sistema calcula una calificación de 70%.

---

## RF-53. Validación de aprobación

El sistema debe determinar si el alumno aprobó o no el examen final.

**Ejemplo de uso:**  
Si la calificación mínima es 70% y el alumno obtiene 65%, el sistema marca el examen como no aprobado.

---

## RF-54. Bloqueo por intentos agotados

El sistema no debe permitir más intentos si el alumno ya usó el máximo permitido.

**Ejemplo de uso:**  
Si el examen permite 2 intentos y el alumno ya usó ambos, el sistema no debe mostrar el botón para volver a presentarlo.

---

# H. Finalización y certificado

## RF-55. Finalización del curso

El sistema debe registrar la fecha y hora en que el alumno completa el curso.

**Ejemplo de uso:**  
Cuando el alumno termina todas las lecciones y aprueba el examen final, el sistema guarda la fecha de finalización del curso.

---

## RF-56. Condiciones para completar curso

El curso se considera completado cuando el alumno termina todas las lecciones y aprueba el examen final.

**Ejemplo de uso:**  
Aunque el alumno haya visto todas las lecciones, el curso no se marca como completado si no aprueba el examen final.

---

## RF-57. Certificado

El sistema debe permitir generar o consultar un certificado cuando el alumno complete el curso. Cada certificado debe tener un código único visible generado por el sistema.

**Ejemplo de uso:**  
Después de aprobar el examen final, el alumno puede entrar a “Mis certificados” y consultar su certificado con código `EDU-2026-000008`.

---

## RF-58. Bloqueo de certificado

El sistema no debe permitir certificado si el alumno no completó todas las lecciones o no aprobó el examen final.

**Ejemplo de uso:**  
Si el alumno reprueba el examen final, el sistema no genera certificado aunque haya completado las lecciones.

---

# I. Instructor

## RF-59. Gestión de cursos propios

El instructor debe poder crear y administrar únicamente sus propios cursos.

**Ejemplo de uso:**  
Un instructor puede editar el curso que él creó, pero no puede modificar cursos de otros instructores.

---

## RF-60. Gestión de módulos

El instructor debe poder crear, editar y ordenar módulos en sus cursos.

**Ejemplo de uso:**  
El instructor crea un módulo llamado “Git y GitHub” y lo coloca como módulo 2 del curso.

---

## RF-61. Gestión de lecciones

El instructor debe poder crear, editar y ordenar lecciones en sus cursos.

**Ejemplo de uso:**  
El instructor agrega una lección llamada “Git Diff + Merge” dentro del módulo “Branches”.

---

## RF-62. Gestión de contenido

El instructor debe poder agregar texto, videos y recursos a sus lecciones.

**Ejemplo de uso:**  
El instructor escribe una explicación, agrega un video de YouTube y adjunta un material de apoyo en una lección.

---

## RF-63. Gestión del examen final

El instructor debe poder crear y configurar el examen final de sus cursos.

**Ejemplo de uso:**  
El instructor crea un examen final, define duración, intentos, calificación mínima y cantidad de preguntas.

---

## RF-64. Gestión del banco de preguntas

El instructor debe poder crear, editar y eliminar preguntas y opciones de respuesta.

**Ejemplo de uso:**  
El instructor agrega una nueva pregunta al banco y marca cuál opción será la correcta.

---

## RF-65. Consulta de alumnos inscritos

El instructor debe poder consultar los alumnos inscritos en sus cursos.

**Ejemplo de uso:**  
El instructor entra a su panel y revisa la lista de alumnos inscritos en su curso de Java.

---

## RF-66. Consulta de progreso

El instructor debe poder consultar el progreso de los alumnos en sus cursos.

**Ejemplo de uso:**  
El instructor ve que un alumno lleva 60% de avance en el curso.

---

## RF-67. Consulta de resultados

El instructor debe poder consultar los resultados del examen final de sus alumnos.

**Ejemplo de uso:**  
El instructor revisa qué alumnos aprobaron, reprobaron y qué calificación obtuvo cada uno.

---

# J. Administrador

## RF-68. Gestión de usuarios

El administrador debe poder consultar usuarios, activar cuentas y desactivar cuentas sin eliminar el historial del usuario.

**Ejemplo de uso:**  
El administrador desactiva una cuenta sospechosa. El usuario ya no puede iniciar sesión, pero sus compras, pagos, inscripciones y certificados se conservan.

---

## RF-69. Asignación de roles

El administrador debe poder asignar o modificar el rol de un usuario cuando corresponda.

**Ejemplo de uso:**  
El administrador aprueba una solicitud de instructor y cambia el rol del usuario de Alumno a Instructor.

---

## RF-70. Supervisión de cursos

El administrador debe poder supervisar todos los cursos registrados.

**Ejemplo de uso:**  
El administrador puede revisar cursos creados por cualquier instructor.

---

## RF-71. Publicación y despublicación de cursos

El administrador debe poder publicar o despublicar cursos. Publicar un curso permite que aparezca en el catálogo y pueda venderse. Despublicar un curso lo retira del catálogo para nuevas compras, pero no debe quitar el acceso a los alumnos que ya lo compraron.

**Ejemplo de uso:**  
El administrador despublica un curso porque ya no se venderá. El curso deja de aparecer en el catálogo, pero los alumnos que ya lo compraron pueden seguir accediendo desde “Mis cursos”.

---
## RF-72. Consulta de pagos

El administrador debe poder consultar órdenes, pagos y estados de transacción.

**Ejemplo de uso:**  
El administrador revisa una orden con estado `completada` y su pago asociado con estado `aprobado`.

---

## RF-73. Consulta de inscripciones

El administrador debe poder consultar las inscripciones de los alumnos.

**Ejemplo de uso:**  
El administrador verifica si un alumno aparece inscrito después de que su pago fue aprobado.

---

## RF-74. Configuración de pasarela de pago

El administrador debe poder configurar o validar la pasarela de pago en ambiente Sandbox.

**Ejemplo de uso:**  
El administrador configura las credenciales de PayPal Sandbox o Stripe Sandbox para que el sistema pueda procesar pagos de prueba.

---

## RF-75. Supervisión de seguridad

El administrador debe poder supervisar reglas de seguridad y acceso.

**Ejemplo de uso:**  
El administrador revisa que los alumnos no puedan acceder a cursos, lecciones o exámenes si no tienen permiso.

---

# K. Cuenta y solicitudes

## RF-76. Solicitud de cuenta de instructor

El sistema debe permitir que un alumno autenticado envíe una solicitud para ser evaluado como posible instructor.

**Ejemplo de uso:**  
Un alumno entra a su cuenta, selecciona “Solicitar cuenta de instructor”, llena un formulario con su experiencia, área de conocimiento y portafolio, y el sistema guarda la solicitud con estado `pendiente`.

---

## RF-77. Estados de solicitud de instructor

El sistema debe manejar estados para las solicitudes de instructor, como pendiente, aceptada y rechazada.

**Ejemplo de uso:**  
Cuando el alumno envía su solicitud, queda como `pendiente`. Si el administrador la aprueba, la solicitud cambia a `aceptada`. Si no la aprueba, cambia a `rechazada`.

---

## RF-78. Gestión de solicitudes de instructor

El sistema debe permitir que el administrador revise, acepte o rechace solicitudes de cuenta de instructor.

**Ejemplo de uso:**  
El administrador revisa la solicitud de un alumno interesado en impartir cursos. Si la aprueba, el sistema cambia la solicitud a `aceptada` y permite actualizar el rol del usuario a Instructor.

---

## RF-79. Revocación excepcional de acceso

El sistema debe permitir cancelar una inscripción solo en casos excepcionales, como reembolso, pago fraudulento, error administrativo o validación incorrecta del pago.

**Ejemplo de uso:**  
Si se detecta que un pago fue fraudulento, el administrador puede cancelar la inscripción relacionada con esa compra.

---

# 3. Requerimientos no funcionales

Los requerimientos no funcionales explican cómo debe comportarse el sistema.

---

## RNF-01. Seguridad de contraseñas

Las contraseñas deben almacenarse de forma segura y nunca en texto plano.

**Ejemplo de aplicación:**  
Si la contraseña del alumno es `Hola123*`, la base de datos no debe guardar ese texto directamente, sino una versión protegida mediante hash.

---

## RNF-02. Contraseñas seguras

El sistema debe exigir contraseñas con mínimo 8 caracteres, al menos una mayúscula, números y un símbolo.

**Ejemplo de aplicación:**  
El sistema no debe aceptar una contraseña como `12345678`, pero sí puede aceptar una como `EduTech2026*`.

---

## RNF-03. Validación de formularios

El sistema debe validar formularios de registro, inicio de sesión, compra, solicitud de instructor, cursos, lecciones y examen.

**Ejemplo de aplicación:**  
Si el alumno deja vacío el correo en el registro, escribe un teléfono con letras o envía una solicitud de instructor sin correo válido, el sistema debe mostrar un mensaje de error.

---

## RNF-04. Protección de datos bancarios

El sistema no debe almacenar datos sensibles de tarjetas bancarias.

**Ejemplo de aplicación:**  
EduTech no debe guardar número completo de tarjeta, CVV ni contraseña bancaria, porque esos datos los maneja PayPal o Stripe.

---

## RNF-05. Control de acceso desde servidor

El sistema debe validar permisos desde el backend, no solo ocultando botones.

**Ejemplo de aplicación:**  
Aunque el botón “Editar curso” no aparezca para un alumno, el servidor también debe impedir que entre manualmente a la ruta de edición.

---

## RNF-06. Protección contra URL directa

El sistema debe impedir que usuarios no autorizados accedan a cursos, lecciones, archivos o exámenes mediante URL directa.

**Ejemplo de aplicación:**  
Si alguien copia el enlace de una lección privada y se lo manda a otra persona, el sistema debe revisar si esa persona inició sesión y compró el curso.

---

## RNF-07. Integridad del examen

Las preguntas, archivos y recursos del examen no deben ser accesibles sin autenticación y autorización.

**Ejemplo de aplicación:**  
Un alumno no debe poder abrir directamente un archivo o ruta del examen si no ha llegado a esa parte del curso o no tiene permiso.

---

## RNF-08. Integridad del progreso

El progreso debe calcularse correctamente según las lecciones completadas.

**Ejemplo de aplicación:**  
Si un curso tiene 10 lecciones y el alumno completó 5, el sistema debe mostrar 50% de avance.

---

## RNF-09. Integridad del pago

El curso solo debe liberarse cuando el pago haya sido confirmado como aprobado.

**Ejemplo de aplicación:**  
Si el pago está pendiente o cancelado, el sistema no debe crear la inscripción ni mostrar el curso en “Mis cursos”.

---

## RNF-10. Ambiente Sandbox

La pasarela de pagos debe trabajar en ambiente Sandbox para pruebas.

**Ejemplo de aplicación:**  
Durante el desarrollo, los pagos se realizan con cuentas de prueba de PayPal o Stripe, sin mover dinero real.

---

## RNF-11. Disponibilidad del video

El reproductor debe soportar YouTube, Vimeo o carga local optimizada.

**Ejemplo de aplicación:**  
Una lección puede reproducir un video embebido de YouTube o un video subido al sistema sin que la página se vuelva demasiado lenta.

---

## RNF-12. Compatibilidad

El sistema debe visualizarse correctamente en computadora, tablet y celular.

**Ejemplo de aplicación:**  
El alumno debe poder revisar sus cursos desde una laptop o desde un celular sin que la página se rompa visualmente.

---

## RNF-13. Usabilidad

El sistema debe tener navegación clara para cursos, lecciones, progreso, pedidos y certificados.

**Ejemplo de aplicación:**  
El alumno debe encontrar fácilmente “Mis cursos”, “Historial de pedidos”, “Mis calificaciones” y “Mis certificados”.

---

## RNF-14. Consistencia de estados

El sistema debe mantener consistencia entre pago, orden, inscripción, progreso, examen y certificado.

**Ejemplo de aplicación:**  
Un alumno no debe aparecer como inscrito si su pago no fue aprobado, y no debe recibir certificado si no aprobó el examen final.

---

## RNF-15. Registro de webhooks

El sistema debe guardar la información relevante de los eventos recibidos por webhook desde la pasarela de pago.

**Ejemplo de aplicación:**  
Cuando PayPal envía el evento `PAYMENT.CAPTURE.COMPLETED`, el sistema guarda el tipo de evento, identificador externo, fecha de recepción y contenido recibido.

