# Lista de actores del sistema

## Proyecto: EduTech - Plataforma Web de Cursos



Un actor representa a una persona, rol o sistema externo que interactúa con la plataforma para realizar una acción.

---

## Actores del sistema

| Actor | Tipo de actor | Descripción |
|---|---|---|
| Visitante | Persona externa | Usuario que entra a la plataforma sin iniciar sesión. Puede consultar la página de inicio, ver el catálogo de cursos, revisar el detalle de un curso, registrarse o iniciar sesión. |
| Alumno | Usuario registrado | Usuario que puede comprar cursos, acceder a los cursos adquiridos, ver módulos y lecciones, marcar lecciones como completadas, consultar su progreso, presentar el examen final y obtener certificados. |
| Instructor | Usuario registrado | Usuario encargado de crear y administrar sus propios cursos. Puede crear módulos, lecciones, recursos, configurar el examen final, administrar preguntas y consultar el progreso o resultados de sus alumnos. |
| Administrador | Usuario registrado | Usuario encargado de supervisar el sistema. Puede gestionar usuarios, asignar roles, revisar cursos, publicar o despublicar cursos, consultar pagos, revisar inscripciones y supervisar reglas de acceso. |
| Pasarela de pago | Sistema externo | Sistema externo, como PayPal o Stripe, que procesa el pago del curso. Después de procesar la transacción, notifica a EduTech mediante un webhook para confirmar si el pago fue aprobado, rechazado, cancelado o quedó pendiente. |
