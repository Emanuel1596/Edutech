# Requerimientos del Sistema EduTech

Este documento contiene los requerimientos funcionales y no funcionales del sistema EduTech, una plataforma web para la venta y consumo de cursos en línea.

---

## Indice

- [A. Usuarios, registro y acceso](#usuarios-registro-acceso)
- [B. Cursos](#cursos)
- [C. Compra, orden y pago](#compra-orden-pago)
- [D. Inscripcion y acceso](#inscripcion-acceso)
- [E. Modulos y lecciones](#modulos-lecciones)
- [F. Progreso del curso](#progreso-curso)
- [G. Examen final](#examen-final)
- [H. Finalizacion y certificado](#finalizacion-certificado)
- [I. Instructor](#instructor)
- [J. Administrador](#administrador)
- [K. Cuenta y solicitudes](#cuenta-solicitudes)
- [L. Requerimientos no funcionales](#requerimientos-no-funcionales)

---

<a id="usuarios-registro-acceso"></a>
# A. Usuarios, registro y acceso

## RF-01. Registro de alumno

El sistema debe permitir que un visitante cree una cuenta con rol de Alumno proporcionando nombre, apellidos, correo electronico, confirmacion de correo, contraseña y confirmacion de contraseña.

Ejemplo de uso:  
Un visitante entra a la pagina de registro, escribe sus datos y el sistema crea su cuenta como Alumno.

---

## RF-02. Validacion del registro

El sistema debe validar que el correo tenga formato correcto, que la confirmacion del correo coincida, que el nombre y apellidos solo contengan letras, espacios, acentos y ñ, que la contraseña cumpla los requisitos minimos y que la confirmacion de contraseña coincida.

Ejemplo de uso:  
Si el visitante escribe Emanuel123 como nombre o un apellido con simbolos, el sistema debe mostrar un error y no permitir el registro.

---

## RF-03. Inicio de sesion

El sistema debe permitir que los usuarios inicien sesion usando correo electronico y contraseña.

Ejemplo de uso:  
Un alumno escribe su correo y contraseña para entrar a su escritorio y consultar sus cursos comprados.

---

## RF-04. Cierre de sesion

El sistema debe permitir que los usuarios cierren sesion de forma segura.

Ejemplo de uso:  
El usuario presiona Cerrar sesion y el sistema termina su sesion para proteger su cuenta.

---

## RF-05. Manejo de roles

El sistema debe manejar tres roles principales: Alumno, Instructor y Administrador.

Ejemplo de uso:  
Un Alumno entra al escritorio del alumno, un Instructor entra al panel de gestion de cursos y un Administrador entra al panel administrativo.

---

## RF-06. Control de acceso por rol

El sistema debe permitir que cada usuario acceda unicamente a las funciones correspondientes a su rol.

Ejemplo de uso:  
Un alumno no debe poder entrar al panel del instructor ni al panel del administrador, aunque intente abrir la URL directamente.

---

## RF-07. Edicion de informacion de cuenta

El sistema debe permitir que los usuarios autenticados editen informacion personal permitida, como nombre, apellidos, telefono o contraseña.

Ejemplo de uso:  
Un alumno entra a Mi cuenta, cambia su telefono y el sistema guarda la informacion actualizada.

---

<a id="cursos"></a>
# B. Cursos

## RF-08. Catalogo de cursos

El sistema debe permitir que visitantes y alumnos consulten los cursos publicados disponibles para compra.

Ejemplo de uso:  
Una persona entra a Cursos y ve los cursos publicados con portada, titulo, instructor, nivel, numero de lecciones y precio.

---

## RF-09. Informacion visible del curso

El sistema debe mostrar por cada curso imagen de portada, nombre, descripcion, instructor, nivel, numero de lecciones y precio en pesos mexicanos.

Ejemplo de uso:  
En el catalogo aparece una tarjeta del curso Desarrollo Web con su portada, instructor, nivel intermedio, cantidad de lecciones y precio.

---

## RF-10. Detalle del curso

El sistema debe permitir consultar el detalle de un curso, incluyendo descripcion, instructor, nivel, modulos, lecciones generales y precio.

Ejemplo de uso:  
Antes de comprar, el alumno abre el detalle del curso para revisar que temas contiene y cuanto cuesta.

---

## RF-11. Cursos unicamente de pago

El sistema debe manejar cursos como productos digitales de pago. El alumno no puede acceder al contenido completo si no existe una compra aprobada.

Ejemplo de uso:  
El alumno puede ver informacion publica del curso, pero no puede abrir sus lecciones completas hasta que la compra sea aprobada.

---

## RF-12. Precio en pesos mexicanos

El sistema debe registrar y mostrar el precio de los cursos en pesos mexicanos.

Ejemplo de uso:  
Un curso aparece con precio de 299.00 MXN en el catalogo y en el resumen del pedido.

---

<a id="compra-orden-pago"></a>
# C. Compra, orden y pago

## RF-13. Inicio de compra

El sistema debe permitir que un alumno autenticado inicie la compra de uno o varios cursos publicados. Si un visitante intenta comprar, el sistema debe solicitarle iniciar sesion o registrarse primero.

Ejemplo de uso:  
El visitante presiona Comprar en un curso y el sistema lo dirige a iniciar sesion o registrarse antes de continuar.

---

## RF-14. Informacion de contacto para compra

El sistema debe solicitar datos de contacto para la compra, como nombre, apellidos, correo electronico y telefono. Si el alumno ya tiene esos datos registrados, el sistema puede precargarlos para facilitar el proceso.

Los datos como direccion, ciudad, entidad federativa y codigo postal pueden manejarse como informacion opcional de facturacion.

Ejemplo de uso:  
Antes de pagar, el alumno revisa su nombre, correo y telefono. Si necesita facturacion, captura direccion, ciudad, entidad federativa y codigo postal.

---

## RF-15. Resumen del pedido

El sistema debe mostrar un resumen del pedido antes de pagar, incluyendo lista de cursos seleccionados, precio unitario de cada curso, subtotal por curso, total de la orden y metodo de pago.

Ejemplo de uso:  
Antes de ir a PayPal, el alumno ve que comprara Java desde cero y Bases de datos, cada curso con su precio y el total final de la orden.

---

## RF-16. Creacion de orden pendiente

El sistema debe crear una orden con estado pendiente cuando el alumno autenticado inicia el proceso de compra. La orden debe tener un numero visible generado por el sistema.

Al crear la orden, el sistema debe registrar los cursos incluidos en la compra mediante Orden_Detalle, generando un registro por cada curso seleccionado.

Ejemplo de uso:  
El alumno inicia la compra y el sistema genera la orden ORD-2026-000015 con estado pendiente. Si la orden contiene tres cursos, se crean tres registros en Orden_Detalle.

---

## RF-17. Boton de pago externo

El sistema debe mostrar un boton de pago con PayPal Sandbox o Stripe Sandbox.

Ejemplo de uso:  
En la pantalla de compra aparece un boton que dice Pagar con PayPal o Pagar con Stripe.

---

## RF-18. Procesamiento del pago en Sandbox

El sistema debe enviar la solicitud de pago a la pasarela externa en ambiente Sandbox.

Ejemplo de uso:  
El alumno presiona Pagar con PayPal, inicia sesion en PayPal Sandbox y realiza un pago de prueba.

---

## RF-19. Webhook de confirmacion de pago

El sistema debe recibir una notificacion automatica mediante webhook cuando PayPal o Stripe confirme el resultado del pago.

Ejemplo de uso:  
Despues de que PayPal aprueba el pago, PayPal envia una notificacion automatica a EduTech.

---

## RF-20. Validacion del pago

El sistema debe validar que el pago recibido corresponda al alumno, la orden, los cursos incluidos en el detalle de orden, el monto total y la moneda correctos.

Ejemplo de uso:  
Si la orden era por 648.00 MXN, el sistema debe comprobar que la pasarela confirmo esa orden, ese monto y esa moneda antes de liberar cursos.

---

## RF-21. Estados de pago

El sistema debe manejar estados de pago como pendiente, aprobado, rechazado o cancelado.

Ejemplo de uso:  
Si PayPal confirma la transaccion, el pago queda aprobado. Si la rechaza, queda rechazado. Si el alumno cancela, queda cancelado.

---

## RF-22. Estados de orden

El sistema debe manejar estados de orden como pendiente, completada, cancelada, fallida o expirada.

Ejemplo de uso:  
Una orden inicia pendiente. Si el pago se aprueba, cambia a completada. Si se rechaza, cambia a fallida. Si el alumno cancela, cambia a cancelada. Si no se paga a tiempo, cambia a expirada.

---

## RF-23. Liberacion automatica de cursos

El sistema debe liberar el acceso a cada curso incluido en la orden unicamente cuando el pago sea aprobado y la orden quede completada.

Ejemplo de uso:  
Si una orden aprobada incluye tres cursos, el sistema crea tres inscripciones activas, una por cada curso comprado.

---

## RF-24. Bloqueo por pago no aprobado

El sistema no debe permitir que el alumno acceda a cursos incluidos en una orden si el pago esta pendiente, rechazado o cancelado, o si la orden esta pendiente, fallida, cancelada o expirada.

Ejemplo de uso:  
Una orden pendiente aparece en Historial de pedidos, pero los cursos no aparecen en Mis cursos hasta que el pago sea aprobado.

---

## RF-25. Historial de pedidos

El sistema debe permitir que el alumno consulte su historial de pedidos, incluyendo numero de orden, cursos incluidos, fecha, total, estado de la orden y estado del pago cuando exista.

Ejemplo de uso:  
El alumno entra a Historial de pedidos y ve la orden ORD-2026-000015 con dos cursos, total de 648.00 MXN y estado completada.

---

## RF-26. Mis cursos

El sistema debe mostrar en Mis cursos unicamente los cursos cuya compra fue aprobada y cuya inscripcion esta activa.

Ejemplo de uso:  
Si la orden fue aprobada y contenia Java y Bases de datos, ambos cursos aparecen en Mis cursos.

---

<a id="inscripcion-acceso"></a>
# D. Inscripcion y acceso

## RF-27. Inscripcion automatica

El sistema debe crear automaticamente una inscripcion por cada curso incluido en Orden_Detalle cuando el pago sea aprobado y la orden quede completada.

Ejemplo de uso:  
Una orden con tres cursos aprobados genera tres inscripciones: una para Java, una para Bases de datos y una para Desarrollo Web.

---

## RF-28. Acceso solo a cursos comprados

El sistema debe permitir que el alumno acceda unicamente a los cursos que haya comprado correctamente.

Ejemplo de uso:  
Si el alumno compro Java, puede entrar a Java, pero no a Python si no lo compro.

---

<a id="modulos-lecciones"></a>
# E. Modulos y lecciones

## RF-29. Organizacion por modulos

El sistema debe permitir que cada curso este organizado en modulos.

Ejemplo de uso:  
Un curso puede tener modulos como Introduccion, Variables, Funciones y Examen final.

---

## RF-30. Datos del modulo

Cada modulo debe tener titulo y numero de orden dentro del curso.

Ejemplo de uso:  
El modulo 1 aparece antes del modulo 2 porque su numero de orden es menor.

---

## RF-31. Organizacion por lecciones

El sistema debe permitir que cada modulo tenga varias lecciones.

Ejemplo de uso:  
El modulo Git puede contener lecciones como Branches, Git Diff y Merge.

---

## RF-32. Datos de la leccion

Cada leccion debe tener titulo, numero de orden, texto descriptivo, video y recursos adicionales cuando correspondan.

Ejemplo de uso:  
Una leccion puede tener explicacion escrita, video de YouTube y un enlace al material de clase.

---

## RF-33. Visualizacion de lecciones

El sistema debe permitir que el alumno visualice las lecciones de los cursos a los que tiene acceso.

Ejemplo de uso:  
El alumno entra a una leccion y puede ver el video, leer el texto y abrir recursos.

---

## RF-34. Videos de leccion

El sistema debe permitir videos embebidos desde YouTube o Vimeo, o videos cargados localmente de forma optimizada.

Ejemplo de uso:  
El instructor agrega un enlace de YouTube y el sistema lo muestra dentro de EduTech.

---

## RF-35. Recursos adicionales

El sistema debe permitir agregar recursos adicionales a las lecciones, como enlaces, archivos descargables, PDF o repositorios.

Ejemplo de uso:  
Una leccion puede incluir un PDF, un enlace a documentacion y un repositorio de GitHub.

---

<a id="progreso-curso"></a>
# F. Progreso del curso

## RF-36. Marcar leccion como completada

El sistema debe permitir que el alumno marque una leccion como completada.

Ejemplo de uso:  
Despues de ver una leccion, el alumno presiona Marcar como completada y el sistema guarda el avance.

---

## RF-37. Avance secuencial obligatorio

El sistema debe bloquear la siguiente leccion hasta que el alumno complete la anterior.

Ejemplo de uso:  
El alumno no puede abrir la leccion 3 si no completo la leccion 2.

---

## RF-38. Registro de progreso

El sistema debe guardar el progreso del alumno en cada curso.

Ejemplo de uso:  
Si el alumno completo 5 lecciones y cierra sesion, al volver se conservan esas lecciones como completadas.

---

## RF-39. Consulta de progreso

El sistema debe mostrar cuantas lecciones ha completado el alumno y el porcentaje de avance del curso.

Ejemplo de uso:  
El sistema muestra 8 de 20 lecciones completadas, equivalente al 40 por ciento del curso.

---

<a id="examen-final"></a>
# G. Examen final

## RF-40. Examen final por curso

El sistema debe permitir que cada curso tenga un examen final.

Ejemplo de uso:  
Al terminar las lecciones, el alumno encuentra el examen final del curso.

---

## RF-41. Banco de preguntas

El sistema debe permitir que el instructor cree un banco de preguntas para el examen final.

Ejemplo de uso:  
El instructor registra 40 preguntas, aunque cada alumno solo respondera 20 en su intento.

---

## RF-42. Preguntas de opcion multiple

El sistema debe permitir preguntas de opcion multiple.

Ejemplo de uso:  
Una pregunta puede tener cuatro posibles respuestas y el alumno selecciona una.

---

## RF-43. Opciones de respuesta

Cada pregunta debe tener varias opciones de respuesta.

Ejemplo de uso:  
La pregunta Que es Git puede tener varias opciones y solo una correcta.

---

## RF-44. Preguntas aleatorias

El sistema debe generar el examen con preguntas aleatorias tomadas del banco de preguntas.

Ejemplo de uso:  
Dos alumnos pueden presentar el mismo examen, pero recibir preguntas diferentes o en diferente orden.

---

## RF-45. Tiempo limite

El sistema debe permitir configurar un tiempo limite para el examen final.

Ejemplo de uso:  
El instructor configura 30 minutos para resolver el examen.

---

## RF-46. Intentos permitidos

El sistema debe controlar el numero maximo de intentos permitidos para el examen.

Ejemplo de uso:  
Si el examen permite dos intentos, el alumno no puede presentar un tercer intento.

---

## RF-47. Calificacion automatica

El sistema debe calcular automaticamente la calificacion del intento con base en las respuestas correctas.

Ejemplo de uso:  
El alumno envia sus respuestas y el sistema calcula su calificacion al instante.

---

<a id="finalizacion-certificado"></a>
# H. Finalizacion y certificado

## RF-48. Finalizacion del curso

El sistema debe marcar la inscripcion como completada cuando el alumno complete las lecciones requeridas y apruebe el examen final.

Ejemplo de uso:  
Cuando el alumno termina todas las lecciones y aprueba el examen, el sistema registra la fecha de finalizacion.

---

## RF-49. Certificado digital

El sistema debe generar un certificado digital cuando el alumno finalice el curso.

Ejemplo de uso:  
El alumno completa el curso y puede ver o descargar su certificado.

---

## RF-50. Codigo visible del certificado

El sistema debe generar un codigo visible para el certificado.

Ejemplo de uso:  
El certificado muestra un codigo como EDU-2026-000015 para identificarlo y validarlo posteriormente.

---

<a id="instructor"></a>
# I. Instructor

## RF-51. Creacion de cursos por instructor

El sistema debe permitir que un instructor cree cursos con titulo, descripcion, portada, nivel y precio.

Ejemplo de uso:  
El instructor crea un curso nuevo y queda inicialmente como borrador.

---

## RF-52. Administracion de contenido del curso

El sistema debe permitir que el instructor cree y edite modulos, lecciones, videos, recursos y examen final de sus propios cursos.

Ejemplo de uso:  
El instructor agrega un nuevo modulo y varias lecciones con video y material adicional.

---

## RF-53. Envio de curso a revision

El sistema debe permitir que el instructor envie un curso a revision para que el administrador decida si se publica.

Ejemplo de uso:  
El instructor termina de preparar el curso y lo envia a revision.

---

## RF-54. Consulta de alumnos inscritos

El sistema debe permitir que el instructor consulte alumnos inscritos, progreso y resultados de examen de sus propios cursos.

Ejemplo de uso:  
El instructor revisa que alumnos estan avanzando y quienes aprobaron el examen.

---

<a id="administrador"></a>
# J. Administrador

## RF-55. Gestion de usuarios

El sistema debe permitir que el administrador consulte usuarios, active o desactive cuentas y asigne roles cuando corresponda.

Ejemplo de uso:  
El administrador acepta una solicitud de instructor y cambia el rol del usuario a Instructor.

---

## RF-56. Revision de cursos

El sistema debe permitir que el administrador revise cursos enviados por instructores, apruebe su publicacion o los rechace con comentarios.

Ejemplo de uso:  
El administrador revisa un curso pendiente y lo aprueba para que aparezca en el catalogo.

---

## RF-57. Consulta de ordenes, pagos e inscripciones

El sistema debe permitir que el administrador consulte ordenes, detalles de orden, pagos, webhooks e inscripciones generadas.

Ejemplo de uso:  
El administrador revisa una orden completada, sus cursos incluidos, el pago aprobado y las inscripciones generadas.

---

<a id="cuenta-solicitudes"></a>
# K. Cuenta y solicitudes

## RF-58. Solicitud de cuenta de instructor

El sistema debe permitir que un alumno envie una solicitud para convertirse en instructor, proporcionando area de experiencia, experiencia, evidencia o portafolio y motivo.

Ejemplo de uso:  
Un alumno llena el formulario de solicitud de instructor y el sistema crea la solicitud en estado pendiente.

---

## RF-59. Revision de solicitud de instructor

El sistema debe permitir que el administrador acepte o rechace solicitudes de instructor y guarde un comentario de revision.

Ejemplo de uso:  
El administrador acepta una solicitud y el sistema cambia el rol del usuario a Instructor.

---

## RF-60. Contacto

El sistema debe permitir que visitantes o usuarios envien mensajes desde la pantalla de contacto.

Ejemplo de uso:  
Una persona envia una duda desde contacto y el sistema muestra confirmacion de envio.

---

<a id="requerimientos-no-funcionales"></a>
# L. Requerimientos no funcionales

## RNF-01. Seguridad de contraseñas

El sistema no debe guardar contraseñas en texto plano. Debe guardar un hash seguro de la contraseña.

---

## RNF-02. Control de acceso directo por URL

El sistema no debe permitir acceder a cursos, lecciones, examenes o archivos protegidos mediante URL directa si el usuario no esta autenticado o no tiene permiso.

---

## RNF-03. Disponibilidad de video

El reproductor de video debe soportar contenido externo desde YouTube o Vimeo, y tambien videos locales optimizados si el sistema los implementa.

---

## RNF-04. Integridad de pagos

El sistema debe validar monto, moneda, orden, estado de pago y cursos incluidos antes de liberar accesos.

---

## RNF-05. Usabilidad

Las pantallas deben ser claras, responsivas y entendibles para visitantes, alumnos, instructores y administradores.

---

## RNF-06. Trazabilidad

El sistema debe guardar fechas relevantes de registro, compra, pago, inscripcion, progreso, examen y certificado para poder revisar el historial.

---

## RNF-07. Escalabilidad inicial

La estructura del proyecto debe permitir separar frontend, backend, base de datos, documentacion y recursos para facilitar el crecimiento del sistema.
