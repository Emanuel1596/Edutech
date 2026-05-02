Alumno: Usuario final que consume el contenido.
Instructor: Usuario creador y administrador de material didáctico.
Entidad de Pago: API de terceros (Stripe/PayPal) para procesar pagos.

Preguntas de reatroalimentación

1. **¿Por qué Alumno es un actor?** – Alumno es un actor porque interactúa con el sistema de forma que a través de él comprar y acceder a cursos de EduTech.
2. **Ejemplo de un alumno usando la aplicación** – 1. El Alumno entra a la página de EduTech y crea cuenta ingresando su nombre, correo y contraseña. 2. El Alumno ingresa "Kotlin" en la barra buscadora. El Sistema muestra una lista de cursos coincidentes con su precio y nombre del Instructor. 3. El Alumno selecciona un curso y hace clic en "Comprar". El Sistema lo redirige a la pantalla de pago... ¿Aquí entra el caso de uso?
3. **¿Por qué Instructor es un actor?** – Instructor es un actor porque interactúa con el sistema de forma que a través de él, es capaz de ver sus cursos, compartir contenido y evaluar a sus alumnos.
4. **¿Por qué Instructor es un actor?** – El Instructor accede a la página de EduTech con su correo y contraseña. 2. La página despliega el listado de sus cursos y el Instructor selecciona el curso en donde quiere agregar contenido...
5. **¿Por qué no simplemente llamar "Pago" al actor "Entidad_Pago"?** – "Pago" es una acción y "entidad de pago" es un sujeto.
6. **¿Por qué Entidad_Pago puede considerarse un actor?** – Porque interactúa directamente con el sistema, pues es quien se encarga de liberar los cursos al ser pagados.
7. **¿Entidad_Pago es un sistema interno o externo de la aplicación?** – Es externo porque opera por su cuenta.
8. **¿Cuál es la diferencia entre actor, entidad y proceso?** – El actor, quien interactúa con el sistema; la entidad, la estructura donde guardamos los datos del actor; el proceso, la secuencia de pasos que conectan al actor con el sistema para lograr un objetivo.
9. **¿Cuál es la diferencia entre rol y actor?** – El actor es quien interactúa, y el rol es la colección de privilegios que tiene al hacerlo, como publicar contenido educativo en cursos. Un privilegio que no tendría un alumno por ejemplo.
10. **¿Qué es una pasarela de pagos?** – Es un sistema externo (Stripe/PayPal) que actúa como un puente seguro entre EduTech, el Alumno y el Banco.
