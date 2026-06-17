 # Historias de Usuario - EduTech

## Proyecto

EduTech - Plataforma web para venta y consumo de cursos en línea.

## Formato usado

Cada historia usa el formato:

> Como [rol], quiero [acción], para [beneficio].

Además, cada historia incluye criterios de aceptación para comprobar cuándo se considera terminada.

---

# Épica 1. Registro, autenticación y roles

## HU-01. Registro de alumno

**Como** visitante, **quiero** crear una cuenta en EduTech, **para** poder comprar cursos y consultar mi avance.

### Criterios de aceptación

- El formulario debe solicitar nombre, apellidos, correo, confirmación de correo, contraseña y confirmación de contraseña.
- El sistema debe validar que el correo tenga formato válido.
- El sistema debe validar que nombre y apellidos no contengan números ni símbolos no permitidos.
- El sistema debe impedir registrar un correo ya existente.
- El usuario creado debe quedar con rol de Alumno.

---

## HU-02. Inicio de sesión

**Como** usuario registrado, **quiero** iniciar sesión con correo y contraseña, **para** acceder a las funciones de mi rol.

### Criterios de aceptación

- El sistema debe validar credenciales.
- Si las credenciales son correctas, debe guardar la sesión en el navegador.
- Si las credenciales son incorrectas, debe mostrar un mensaje de error.
- El sistema debe redirigir según el rol: Alumno, Instructor o Administrador.

---

## HU-03. Protección por rol

**Como** sistema, **quiero** bloquear las pantallas que no correspondan al rol del usuario, **para** evitar accesos indebidos por URL directa.

### Criterios de aceptación

- Un alumno no debe ver el panel de instructor ni el panel administrador.
- Un instructor no debe ver funciones exclusivas de administrador.
- Un usuario sin sesión no debe acceder a páginas protegidas.
- Al intentar entrar sin permiso, el sistema debe redirigir o mostrar un mensaje de acceso no autorizado.

---

# Épica 2. Catálogo y compra de cursos

## HU-04. Consultar catálogo

**Como** visitante o alumno, **quiero** ver los cursos publicados, **para** conocer la oferta disponible.

### Criterios de aceptación

- El catálogo debe cargar cursos desde el backend.
- Cada curso debe mostrar portada, título, instructor, nivel, número de lecciones y precio.
- Si no hay cursos, debe mostrarse un mensaje claro.

---

## HU-05. Consultar detalle de curso

**Como** visitante o alumno, **quiero** abrir el detalle de un curso, **para** revisar descripción, módulos, lecciones y precio antes de comprar.

### Criterios de aceptación

- El detalle debe obtener el curso por su identificador.
- Debe mostrar información general del curso.
- Debe mostrar módulos y lecciones.
- Si el curso ya fue comprado, no debe mostrar la opción de comprar otra vez.

---

## HU-06. Agregar curso al carrito

**Como** alumno, **quiero** agregar un curso al carrito, **para** comprarlo junto con otros cursos.

### Criterios de aceptación

- El sistema debe guardar el curso seleccionado en el carrito.
- No debe duplicar el mismo curso dentro del carrito.
- Debe permitir continuar hacia el flujo de compra.

---

## HU-07. Crear orden de compra

**Como** alumno, **quiero** crear una orden con los cursos del carrito, **para** iniciar el proceso de pago.

### Criterios de aceptación

- La orden debe quedar asociada al usuario autenticado.
- La orden debe guardar uno o varios cursos en orden_detalle.
- La orden debe quedar inicialmente en estado pendiente.
- El total debe coincidir con la suma de los cursos comprados.

---

## HU-08. Confirmar pago sandbox

**Como** alumno, **quiero** simular el pago en un ambiente sandbox, **para** completar la compra sin usar dinero real.

### Criterios de aceptación

- El sistema debe permitir aprobar el pago en modo sandbox.
- Al aprobarse, la orden debe pasar a estado completada.
- Se debe registrar el pago como aprobado.
- Se debe generar la inscripción del alumno al curso comprado.

---

## HU-09. Webhook de pago

**Como** sistema, **quiero** recibir una notificación de la pasarela de pago, **para** confirmar el pago desde backend y liberar el curso.

### Criterios de aceptación

- El webhook debe recibir el identificador de la orden.
- El sistema debe validar que la orden exista.
- El sistema debe validar el monto pagado.
- El sistema debe guardar el evento del webhook.
- El sistema debe evitar procesar dos veces el mismo evento externo.
- Si el pago es aprobado, debe crear pago e inscripción.

---

# Épica 3. Alumno, aula, progreso y examen

## HU-10. Ver mis cursos

**Como** alumno, **quiero** ver los cursos que ya compré, **para** entrar a estudiar.

### Criterios de aceptación

- La pantalla debe mostrar solo cursos inscritos del alumno autenticado.
- Cada curso debe tener acceso al aula.
- No deben aparecer cursos no comprados como si fueran propios.

---

## HU-11. Consultar aula del curso

**Como** alumno, **quiero** entrar al aula de un curso comprado, **para** consultar módulos, lecciones y recursos.

### Criterios de aceptación

- El aula debe validar que el alumno tenga inscripción activa.
- Debe mostrar módulos y lecciones.
- Debe indicar visualmente lecciones completadas.
- Debe bloquear lecciones que todavía no correspondan.

---

## HU-12. Completar lección

**Como** alumno, **quiero** marcar una lección como completada, **para** registrar mi avance.

### Criterios de aceptación

- El sistema debe guardar la lección completada en la base de datos.
- Al recargar la página, el avance debe mantenerse.
- El progreso del curso debe actualizarse.
- La siguiente lección debe desbloquearse cuando corresponda.

---

## HU-13. Presentar examen final

**Como** alumno, **quiero** presentar el examen final cuando termine las lecciones, **para** acreditar el curso.

### Criterios de aceptación

- El examen debe estar bloqueado si faltan lecciones obligatorias.
- El examen debe mostrar preguntas y opciones.
- El sistema debe registrar las respuestas del alumno.
- El sistema debe calcular la calificación.
- El intento debe guardarse en la base de datos.

---

## HU-14. Obtener certificado

**Como** alumno, **quiero** recibir un certificado al aprobar el examen, **para** tener evidencia de finalización del curso.

### Criterios de aceptación

- El certificado solo debe generarse si el examen fue aprobado.
- Debe incluir nombre del alumno, curso, fecha de emisión y código de verificación.
- Debe quedar registrado en la base de datos.
- Debe mostrarse en una vista con diseño de certificado.
- Debe permitir imprimir o descargar desde el navegador.

---

# Épica 4. Instructor

## HU-15. Gestionar cursos

**Como** instructor, **quiero** crear y editar cursos, **para** publicar contenido en la plataforma.

### Criterios de aceptación

- El instructor debe acceder a su panel solo con rol Instructor.
- Debe poder registrar título, descripción, precio, nivel, categoría y portada.
- Debe poder editar cursos existentes sin perder datos.
- No debe editar cursos de otros instructores.

---

## HU-16. Gestionar módulos y lecciones

**Como** instructor, **quiero** crear módulos y lecciones, **para** organizar el contenido del curso.

### Criterios de aceptación

- El instructor debe poder agregar módulos.
- Debe poder agregar lecciones con título, contenido, video o recurso.
- Debe poder ordenar el contenido.
- Las lecciones deben quedar asociadas al curso correcto.

---

## HU-17. Configurar examen

**Como** instructor, **quiero** configurar el examen final, **para** evaluar el aprendizaje del alumno.

### Criterios de aceptación

- Debe poder definir título, tiempo, número de intentos y calificación mínima.
- La calificación mínima debe estar en el rango permitido.
- Debe poder agregar preguntas y respuestas.
- Debe poder marcar la respuesta correcta.

---

# Épica 5. Administrador

## HU-18. Gestionar usuarios y roles

**Como** administrador, **quiero** consultar usuarios y asignar roles, **para** controlar los permisos del sistema.

### Criterios de aceptación

- El panel debe cargar usuarios desde la base de datos.
- El administrador debe poder revisar el rol de cada usuario.
- Debe poder activar, desactivar o cambiar rol cuando aplique.
- Solo el rol Administrador debe tener acceso.

---

## HU-19. Revisar cursos

**Como** administrador, **quiero** revisar cursos publicados o pendientes, **para** mantener control del contenido en la plataforma.

### Criterios de aceptación

- El panel debe mostrar cursos registrados.
- Debe permitir identificar instructor, estado y datos generales.
- Debe permitir publicar o despublicar cursos si el sistema lo requiere.

---

## HU-20. Consultar pagos e inscripciones

**Como** administrador, **quiero** consultar pagos e inscripciones, **para** verificar compras y accesos de alumnos.

### Criterios de aceptación

- Debe mostrar órdenes y pagos.
- Debe indicar estado de la orden y del pago.
- Debe permitir revisar inscripciones generadas después de la compra.
- Debe mostrar información útil para validar el flujo de pago.
