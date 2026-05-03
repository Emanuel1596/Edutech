*ZONA DE ACCESO Y REGISTRO
--Pantalla: Registro de Alumno
-Sección: Formulario de captura de datos (Nombre, Apellidos, Correo, Password).
-Botón: "Registrarse" -> Pantalla destino: Iniciar Sesión.
  -Condición: ¿Los datos cumplen con el formato y las contraseñas coinciden?
    -Si se cumple: Crear cuenta y redirigir a Login.
    -No se cumple: Permanecer en pantalla y mostrar mensajes de error específicos.

--Pantalla: Iniciar Sesión
-Sección: Campos de entrada para correo electrónico y contraseña .
-Botón: "Entrar" -> Pantalla destino: Depende del Rol.
  -Condición 1: ¿El correo y la contraseña existen y coinciden en la base de datos?
    -Si no se cumple: Permanecer en pantalla y mostrar error "Credenciales incorrectas".
    -Si se cumple: Validar Condición 2.
  -Condición 2: ¿Qué rol tiene el usuario?
    -Si es Alumno: Redirigir a Dashboard Alumno.
    -Si es Instructor: Redirigir a Dashboard Instructor.

*Si es Administrador: Redirigir a Panel Administrador.
--ZONA DEL ALUMNO
--Pantalla: Detalle del Curso
-Sección: Descripción extendida, temario por módulos, precio e instructor .
-Botón: "Comprar ahora" -> Pantalla destino: Checkout / Pago.
  -Condición: ¿El usuario ha iniciado sesión previamente?
    -Si se cumple: Redirigir directamente a la pantalla de Checkout.
    -Si no se cumple: Redirigir a la pantalla de Iniciar Sesión.
--Pantalla: Checkout / Pasarela de Pago
-Sección: Resumen del pedido, datos de facturación y botones de PayPal/Stripe Sandbox.
-Botón: "Pagar con [Pasarela]" -> Pantalla destino: Procesamiento Externo.
  -Condición: ¿El Webhook recibió la confirmación de "Aprobado"?
    -Si se cumple: Redirigir a Mis Cursos con el acceso ya liberado.
    -No se cumple: Redirigir a Historial de Pedidos con estado "Pendiente/Cancelado" y mantener curso bloqueado.

--Pantalla: Aula Virtual (Lecciones)
-Sección: Reproductor de video, recursos descargables y barra de progreso.
-Botón: "Siguiente Lección" -> Pantalla destino: Lección posterior.
  -Condición: ¿El alumno marcó como completada la lección anterior (RF-36)?
    -Si se cumple: Desbloquear y mostrar el contenido de la siguiente lección.
    -No se cumple: Mostrar aviso "Lección bloqueada" y permanecer en la lección actual.
--Pantalla: Examen Final
-Sección: Cuestionario de opción múltiple generado aleatoriamente con temporizador.
-Botón: "Enviar Examen" -> Pantalla destino: Resultado de Evaluación.
  -Condición 1: ¿La calificación obtenida es igual o mayor al 60%?
    -Si se cumple: Mostrar botón "Ver Certificado" y registrar finalización del curso.
    -No se cumple: Validar Condición 2.
  -Condición 2: ¿Al alumno le quedan intentos disponibles?
    -Si se cumple: Mostrar botón "Reintentar Examen".
    -No se cumple: Bloquear el examen y mostrar mensaje "Intentos agotados".

*ZONA DEL INSTRUCTOR
--Pantalla: Dashboard del Instructor
-Sección: Resumen de cursos creados por el autor e indicadores de progreso de alumnos.
-Botón: "Crear Nuevo Curso" -> Pantalla destino: Formulario de Creación.
-Botón: "Gestionar Contenido" -> Pantalla destino: Gestión de Módulos.
  -Condición: ¿El instructor tiene cursos activos?
    -Si se cumple: Mostrar lista de cursos y estadísticas.
  -No se cumple: Mostrar mensaje "Aún no tienes cursos creados, ¡comienza aquí!".
--Pantalla: Gestión de Módulos y Lecciones
-Sección: Lista jerárquica de temas del curso, cargador de videos y archivos de apoyo.
-Botón: "Añadir Lección" -> Pantalla destino: Editor de Lección.
-Botón: "Guardar Orden" -> Pantalla destino: Misma pantalla (Actualizada).
  -Condición: ¿El video es un enlace válido de YouTube/Vimeo o archivo optimizado?
    -Si se cumple: Guardar lección y previsualizar video.
    -No se cumple: Permanecer en pantalla y mostrar error "Formato de video no soportado".
--Pantalla: Gestión de Examen Final
-Sección: Configuración de tiempo límite, intentos permitidos y banco de preguntas.
-Botón: "Agregar Pregunta" -> Pantalla destino: Formulario de Pregunta.
-Botón: "Publicar Examen" -> Pantalla destino: Dashboard Instructor.
  -Condición: ¿El banco tiene al menos 10 preguntas configuradas?
    Si se cumple: Habilitar el examen para los alumnos.
    -No se cumple: Permanecer en pantalla y mostrar error "Faltan preguntas para completar el banco".

*ZONA DEL ADMINISTRADOR (Color Rojo/Rosa)
--Pantalla: Panel de Administración General
-Sección: Métricas globales de la plataforma, usuarios activos y ventas totales.
-Botón: "Usuarios" -> Pantalla destino: Gestión de Usuarios y Roles.
-Botón: "Cursos" -> Pantalla destino: Supervisión de Contenido.
  -Condición: ¿Existen alertas de seguridad o pagos pendientes de revisión?
    -Si se cumple: Mostrar panel de notificaciones prioritarias.
    -No se cumple: Mostrar resumen estadístico normal.
--Pantalla: Gestión de Usuarios y Roles
-Sección: Listado completo de usuarios registrados con opciones de edición y bloqueo.
-Botón: "Cambiar Rol" -> Pantalla destino: Confirmación de Cambio.
-Botón: "Desactivar Usuario" -> Pantalla destino: Misma pantalla (Actualizada).
  -Condición: ¿El administrador intenta cambiar su propio rol o eliminarse?
    -Si se cumple: Permanecer en pantalla y mostrar mensaje "Acción no permitida por seguridad".
    -No se cumple: Procesar el cambio de rol en la base de datos.
--Pantalla: Supervisión de Pagos y Pasarela
-Sección: Historial de transacciones de PayPal/Stripe Sandbox y configuración de llaves API.
-Botón: "Ver Detalles de Pago" -> Pantalla destino: Detalle de Orden.
-Botón: "Validar Pasarela" -> Pantalla destino: Prueba de conexión Sandbox.
  -Condición: ¿La respuesta del Webhook de pago es válida?
    -Si se cumple: Confirmar estado de orden como "Aprobado".
    -No se cumple: Marcar orden como "Fallida" y notificar al administrador.

  <img width="3329" height="2823" alt="mapa navegaciónv0200 drawio" src="https://github.com/user-attachments/assets/ff6751c2-944a-485a-bf68-1dc93eec7d6f" />
