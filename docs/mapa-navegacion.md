# Mapa de navegación de EduTech

Versión corregida con estructura tipo árbol.

## 1. Zona pública

EduTech
├── Inicio
      
      │   ├── Presentación de EduTech
    
      │   ├── Cursos destacados
      
      │   │   └── Ver detalle → Detalle del c  urso
      
      │   ├── Ver cursos → Catálogo de cursos
      
      │   ├── Crear cuenta → Registro
      
      │   ├── Iniciar sesión → Inicio de sesión 
      
      │   └── ¿Quieres ser instructor? → Información para solicitar cuenta de instructor
      
    ├── Catálogo de cursos
    
    │   ├── Lista de cursos publicados

│   └── Ver detalle → Detalle del curso

├── Detalle del curso
    
    │   ├── Información general del curso
    
    │   ├── Instructor
    
    │   ├── Nivel
    
    │   ├── Módulos y lecciones incluidas
    
    │   ├── Precio en MXN
    
    │   └── Comprar curso
    
        │       ├── Si no ha iniciado sesión → Inicio de sesión / Registro
      
        │       └── Si inició sesión como Alumno → Compra del curso  
  ├── Registro
    │   ├── Formulario de registro
    
    │   ├── Registrarse
  
    │   │   ├── Si los datos son correctos → Crear cuenta con rol Alumno
  
    │   │   │   └── Iniciar sesión automáticamente → Escritorio del alumno
  
    │   │   └── Si los datos son incorrectos → Permanecer en Registro y mostrar errores
  
    │   └── Ya tengo cuenta → Inicio de sesión
├── Inicio de sesión
  
     │   ├── Formulario de acceso
    
    │   ├── Iniciar sesión
    
    │   │   ├── Si el rol es Alumno → Escritorio del alumno
    
    │   │   ├── Si el rol es Instructor → Escritorio del instructor
    
    │   │   ├── Si el rol es Administrador → Escritorio del administrador
    
    │   │   ├── Si el usuario está desactivado → Permanecer en Inicio de sesión y mostrar aviso
    
    │   │   └── Si los datos son incorrectos → Permanecer en Inicio de sesión y mostrar error
    
    │   └── Crear cuenta → Registro
├── ¿Quiénes somos?

    │   ├── Qué es EduTech
    
    │   ├── Misión
    
    │   ├── Visión
    
    │   └── Objetivo
├── Contacto

    │   ├── Formulario de contacto
    
    │   ├── Enviar mensaje
    
    │   └── Solicitar cuenta de instructor
    
    │       ├── Si no ha iniciado sesión → Inicio de sesión / Registro
    
    │       └── Si inició sesión como Alumno → Solicitud de instructor

├── Información para solicitar cuenta de instructor

    │   ├── Requisitos para solicitar cuenta de instructor
    
    │   ├── Explicación del proceso de revisión
    
    │   └── Solicitar cuenta de instructor
    
    │       ├── Si no ha iniciado sesión → Inicio de sesión / Registro
    
    │       └── Si inició sesión como Alumno → Solicitud de instructor
    
    └── Mi cuenta
        ├── Si no ha iniciado sesión → Inicio de sesión
        └── Si ya inició sesión → Mi cuenta según rol
    
## 2. Flujo de compra, orden y pago

Detalle del curso

    └── Comprar curso

      ├── Si no ha iniciado sesión → Inicio de sesión / Registro
      
      └── Si inició sesión como Alumno → Compra del curso

Compra del curso
├── Datos de contacto
 
    │   ├── Nombre
    │   ├── Apellidos
    │   ├── Correo
    │   └── Teléfono
├── Datos opcionales de facturación

    │   ├── Dirección
    │   ├── Ciudad
    │   ├── Estado
    │   └── Código postal
├── Resumen del pedido

    │   ├── Curso seleccionado
    │   ├── Precio actual del curso
    │    ├── Total de la orden
    │   └── Método de pago
├── Crear orden pendiente

    │   ├── Generar número de orden visible
    │   └── Guardar total de la orden
    └── Pagar con PayPal / Stripe Sandbox
        └── Pasarela externa
            └── Webhook hacia EduTech
                └── Confirmación de compra
                    ├── Si el pago es aprobado
                    │   ├── Actualizar pago a aprobado
                    │   ├── Cambiar orden a completada
                    │   ├── Crear inscripción activa
                    │   ├── Liberar acceso al curso
                    │   └── Ir a Mis cursos → Mis cursos
                    ├── Si el pago queda pendiente
                    │   ├── Mantener orden pendiente
                    │   └── Ver historial de pedidos → Historial de pedidos
                    ├── Si el pago es rechazado
                    │   ├── Cambiar pago a rechazado
                    │   ├── Cambiar orden a fallida
                    │   └── Intentar de nuevo → Compra del curso
                    ├── Si el pago es cancelado
                    │   ├── Cambiar pago a cancelado
                    │   ├── Cambiar orden a cancelada
                    │   └── Volver a compra → Compra del curso
                    └── Si la orden queda sin pago durante demasiado tiempo
                        ├── Cambiar orden a expirada
                        └── Ver historial de pedidos → Historial de pedidos

## 3. Zona del alumno

Escritorio del alumno

    ├── Resumen del alumno
    │   ├── Cursos comprados
    │   ├── Cursos en progreso
    │   ├── Pedidos pendientes
    │   └── Certificados obtenidos
    ├── Mis cursos → Vista del curso comprado
    ├── Historial de pedidos → Detalle del pedido
    ├── Mis calificaciones
    ├── Mis certificados → Ver certificado
    ├── Solicitar cuenta de instructor → Solicitud de instructor
    ├── Mi cuenta
    └── Cerrar sesión → Inicio

Vista del curso comprado

    ├── Información del curso
    ├── Progreso del curso
    │   ├── Lecciones completadas
    │   └── Porcentaje de avance
├── Módulos
    
    │   └── Lecciones
    │       ├── Lección completada
    │       ├── Lección desbloqueada
    │       └── Lección bloqueada
├── Abrir lección

    │   ├── Si la lección está desbloqueada → Lección
    │   └── Si la lección está bloqueada → Permanecer en Vista del curso y mostrar aviso
└── Ir al examen final
   
      ├── Si completó las lecciones requeridas → Examen final
      └── Si no completó las lecciones → Permanecer en Vista del curso y mostrar aviso

Lección
├── Título
├── Video
   
    │   ├── Si tipo_video = YouTube → Mostrar video embebido
    │   ├── Si tipo_video = Vimeo → Mostrar video embebido
    │   └── Si tipo_video = Local → Reproducir video local optimizado
├── Texto descriptivo
├── Recursos adicionales

    │   ├── Si tipo_recurso = PDF → Descargar PDF
    │   ├── Si tipo_recurso = Enlace → Abrir enlace
    │   ├── Si tipo_recurso = Archivo → Descargar archivo
    │   └── Si tipo_recurso = Repositorio → Ver repositorio
├── Marcar como completada

    │   ├── Guardar progreso de lección
    │   ├── Recalcular porcentaje de avance
    │   └── Desbloquear siguiente lección, si corresponde
└── Siguiente lección
   
        ├── Si está desbloqueada → Lección siguiente
        └── Si está bloqueada → Mostrar aviso

Examen final
├── Instrucciones

    │   ├── Tiempo límite
    │   ├── Intentos disponibles
    │   ├── Calificación mínima
    │   └── Cantidad de preguntas
└── Iniciar examen
      
        ├── Si tiene intentos disponibles → Presentar examen
        └── Si no tiene intentos disponibles → Resultado del examen / Aviso de intentos agotados

Presentar examen

    ├── Crear intento en estado en_progreso
    ├── Preguntas aleatorias
    ├── Opciones de respuesta
    ├── Temporizador
    ├── Siguiente pregunta
    └── Enviar respuestas
        ├── Guardar respuestas del alumno
        ├── Calcular calificación
        ├── Cambiar intento a finalizado
        └── Resultado del examen

Resultado del examen

    ├── Si aprueba
    │   ├── Verificar finalización del curso
    │   ├── Registrar fecha de finalización
    │   ├── Generar certificado con código visible
    │   └── Ver certificado → Mis certificados
    ├── Si reprueba y tiene intentos disponibles
    │   └── Reintentar examen → Examen final
    └── Si reprueba y no tiene intentos disponibles
        └── Permanecer en Resultado del examen

Mi cuenta
  
├── Ver datos personales
   
    │   ├── Nombre
    │   ├── Apellidos
    │   ├── Correo
    │   └── Teléfono
    ├── Editar datos
    ├── Cambiar contraseña
    └── Guardar cambios
        ├── Si los datos son correctos → Mostrar “datos actualizados”
        └── Si los datos son incorrectos → Mostrar errores

Solicitud de instructor

    ├── Formulario de solicitud
    │   ├── Área de experiencia
    │   ├── Experiencia
    │   ├── Enlace a portafolio, CV, LinkedIn, GitHub u otra evidencia
    │   └── Motivo de solicitud
    └── Enviar solicitud
        ├── Si los datos son correctos
        │   ├── Crear solicitud en estado pendiente
        │   └── Mostrar “solicitud enviada para revisión”
        └── Si los datos son incorrectos → Mostrar errores

## 4. Zona del instructor

    Escritorio del instructor
    ├── Resumen del instructor
    │   ├── Cursos creados
    │   ├── Cursos publicados
    │   ├── Cursos en borrador
    │   ├── Cursos pendientes de revisión
    │   ├── Alumnos inscritos
    │   └── Exámenes activos
    ├── Mis cursos creados
    │   ├── Crear curso → Crear curso
    │   ├── Editar curso → Editar curso
    │   └── Administrar curso → Administrar curso
    ├── Mi cuenta
    └── Cerrar sesión → Inicio

Crear curso
  
    ├── Título
    ├── Descripción
    ├── Portada
    ├── Nivel
    ├── Precio en MXN
    └── Guardar curso
        ├── Si los datos son correctos
        │   ├── Crear curso en estado borrador
        │   └── Administrar curso
        └── Si los datos son incorrectos → Mostrar errores

Editar curso
   
    ├── Datos actuales del curso
    │   ├── Título
    │   ├── Descripción
    │   ├── Portada
    │   ├── Nivel
    │   └── Precio en MXN
    └── Actualizar curso
        ├── Si los datos son correctos → Administrar curso
        └── Si los datos son incorrectos → Mostrar errores

Administrar curso
   
    ├── Datos del curso
    │   ├── Estado del curso
    │   ├── Título
    │   ├── Descripción
    │   ├── Nivel
    │   └── Precio
    ├── Editar datos generales → Editar curso
    ├── Enviar curso a revisión
    │   ├── Si tiene datos mínimos, módulos, lecciones y examen configurado
    │   │   ├── Cambiar estado a pendiente_revision
    │   │   └── Mostrar “curso enviado a revisión”
    │   └── Si falta información → Mostrar errores
    ├── Módulos y lecciones
    │   ├── Lista de módulos
    │   ├── Lista de lecciones por módulo
    │   ├── Crear módulo
    │   ├── Editar módulo
    │   ├── Ordenar módulos
    │   ├── Crear lección
    │   ├── Editar lección
    │   └── Contenido de lección
    │       ├── Texto descriptivo
    │       ├── Video
    │       │   ├── YouTube
    │       │   ├── Vimeo
    │       │   └── Local
    │       └── Recursos adicionales
    │           ├── PDF
    │           ├── Enlace
    │           ├── Archivo
    │           └── Repositorio
    ├── Examen final y banco de preguntas
    │   ├── Configurar examen final
    │   │   ├── Título
    │   │   ├── Descripción
    │   │   ├── Tiempo límite
    │   │   ├── Número de intentos
    │   │   ├── Calificación mínima
    │   │   └── Cantidad de preguntas
    │   └── Banco de preguntas
    │       ├── Crear pregunta
    │       ├── Editar pregunta
    │       ├── Crear / editar opciones
    │       └── Definir respuesta correcta
    ├── Alumnos inscritos
    ├── Progreso de alumnos
    └── Resultados del examen → Detalle del resultado

## 5. Zona del administrador

  Escritorio del administrador
    ├── Resumen general
    │   ├── Usuarios registrados
    │   ├── Cursos publicados
    │   ├── Cursos pendientes de revisión
    │   ├── Pagos aprobados
    │   ├── Pagos pendientes
    │   ├── Inscripciones activas
    │   └── Solicitudes de instructor pendientes
    ├── Gestión de usuarios → Gestión de usuarios
    ├── Solicitudes de instructor → Solicitudes de instructor
    ├── Gestión de cursos → Gestión de cursos
    ├── Órdenes y pagos → Órdenes y pagos
    ├── Inscripciones → Inscripciones
    ├── Configuración de pasarela → Configuración de pasarela
    ├── Seguridad y acceso → Seguridad y acceso
    ├── Mi cuenta
    └── Cerrar sesión → Inicio

Gestión de usuarios
  
    ├── Lista de usuarios
    │   ├── Nombre
    │   ├── Correo
    │   ├── Rol
    │   └── Estado de cuenta
    ├── Activar usuario → Cambiar esta_activo a true
    ├── Desactivar usuario → Cambiar esta_activo a false sin eliminar historial
    └── Asignar rol
        ├── Si corresponde → Cambiar rol del usuario
        └── Si no corresponde → Mostrar aviso

Solicitudes de instructor

    ├── Lista de solicitudes
    │   ├── Alumno solicitante
    │   ├── Área de experiencia
    │   ├── Fecha de solicitud
    │   └── Estado de solicitud
    └── Ver detalle de solicitud → Detalle de solicitud de instructor

Detalle de solicitud de instructor
  
    ├── Datos del alumno
    ├── Experiencia
    ├── Portafolio / evidencia
    ├── Motivo de solicitud
    ├── Aceptar solicitud
    │   ├── Cambiar solicitud a aceptada
    │   ├── Cambiar rol del usuario a Instructor
    │   └── Mostrar “solicitud aceptada”
    └── Rechazar solicitud
        ├── Cambiar solicitud a rechazada
        └── Mostrar “solicitud rechazada”

Gestión de cursos
   
    ├── Lista de todos los cursos
    │   ├── Título
    │   ├── Instructor
    │   ├── Estado
    │   ├── Precio
    │   └── Fecha de creación
    └── Ver detalle administrativo del curso → Detalle administrativo del curso

Detalle administrativo del curso
  
    ├── Datos generales del curso
    ├── Instructor
    ├── Módulos y lecciones
    ├── Examen final
    ├── Alumnos inscritos
    ├── Publicar curso
    │   ├── Cambiar estado a publicado
    │   └── El curso aparece en el catálogo
    └── Despublicar curso
        ├── Cambiar estado a no_publicado
        └── El curso ya no aparece para nuevas compras, pero los alumnos que ya lo compraron conservan acceso

Órdenes y pagos
   
    ├── Lista de órdenes
    │   ├── Número de orden
    │   ├── Alumno
    │   ├── Curso
    │   ├── Total
    │   ├── Moneda
    │   └── Estado de orden
    ├── Lista de pagos
    │   ├── Proveedor
    │   ├── Estado de pago
    │   ├── Monto pagado
    │   ├── Moneda
    │   └── ID externo de pago
    ├── Webhooks recibidos
    │   ├── Tipo de evento
    │   ├── ID externo del evento
    │   ├── Estado de procesamiento
    │   └── Fecha de recepción
    └── Ver detalle de orden / pago → Detalle de orden / pago

Detalle de orden / pago
    
    ├── Datos de la orden
    ├── Datos del pago
    ├── Datos del webhook
    └── Validación de monto, moneda, alumno, curso y orden

Inscripciones
    
    ├── Lista de inscripciones
    │   ├── Alumno
    │   ├── Curso
    │   ├── Orden
    │   ├── Estado de inscripción
    │   ├── Fecha de inscripción
    │   └── Fecha de finalización
    └── Ver detalle de inscripción → Detalle de inscripción

Detalle de inscripción
 
    ├── Alumno
    ├── Curso
    ├── Orden relacionada
    ├── Estado de inscripción
    ├── Progreso del alumno
    └── Cancelar inscripción
        ├── Solo en casos excepcionales
        ├── Cambiar estado de inscripción a cancelada
        └── Motivos válidos
            ├── Reembolso
            ├── Pago fraudulento
            ├── Error administrativo
            └── Validación incorrecta del pago

Configuración de pasarela
    
    ├── PayPal Sandbox
    ├── Stripe Sandbox
    ├── Credenciales de prueba
    └── URL de webhook

Seguridad y acceso

    ├── Reglas por rol
    │   ├── Alumno
    │   ├── Instructor
    │   └── Administrador
    ├── Protección de cursos
    ├── Protección de lecciones
    ├── Protección de exámenes
    ├── Protección contra URL directa
    └── Revisión de accesos indebidos

## 6. Flujo resumido de estados

Curso
  
    ├── Instructor crea curso
    ├── Curso en borrador
    ├── Instructor envía a revisión
    ├── Curso en pendiente_revision
    └── Administrador revisa
        ├── Si aprueba → publicado
        └── Si no aprueba → permanece en pendiente_revision o vuelve a borrador

Orden y pago
 
    ├── Alumno inicia compra
    ├── Orden pendiente
    ├── Alumno paga con PayPal / Stripe
    ├── Pago pendiente
    └── Webhook confirma resultado
        ├── Pago aprobado → Orden completada → Crear inscripción activa → Liberar curso
        ├── Pago rechazado → Orden fallida → No liberar curso
        ├── Pago cancelado → Orden cancelada → No liberar curso
        └── Sin confirmación por mucho tiempo → Orden expirada → No liberar curso

Inscripción
  
    ├── Pago aprobado + Orden completada
    ├── Crear inscripción activa
    ├── Alumno accede al curso
    ├── Alumno completa lecciones + aprueba examen
    ├── Inscripción completada
    └── Generar certificado

Solicitud de instructor
    
    ├── Alumno autenticado solicita ser instructor
    ├── Solicitud pendiente
    └── Administrador revisa
        ├── Si acepta → Solicitud aceptada → Usuario cambia a rol Instructor
        └── Si rechaza → Solicitud rechazada → Usuario conserva rol Alumno

Examen
 
    ├── Alumno inicia examen
    ├── Intento en_progreso
    ├── Alumno envía respuestas
    ├── Intento finalizado
    └── Resultado
        ├── Si aprueba → Verificar finalización del curso
        ├── Si reprueba y tiene intentos → Permitir reintento
        └── Si reprueba y no tiene intentos → Mostrar intentos agotados

  <img width="3329" height="2823" alt="mapa navegaciónv0200 drawio" src="https://github.com/user-attachments/assets/ff6751c2-944a-485a-bf68-1dc93eec7d6f" />
