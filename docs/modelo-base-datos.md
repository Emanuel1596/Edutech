# Identificación de entidades y atributos de base de datos

## Proyecto: EduTech - Plataforma Web de Cursos

## Objetivo

Este documento presenta la identificación de entidades y atributos principales para la base de datos del sistema EduTech.

EduTech permite que los alumnos se registren, compren cursos, accedan a módulos y lecciones, registren su progreso, presenten un examen final y obtengan certificados. También contempla usuarios con rol de instructor y administrador.

---

## Criterios usados para identificar entidades

Para identificar las entidades se usaron estos criterios:

1. Una entidad representa información importante que el sistema necesita guardar.
2. Los atributos deben ser claros y atómicos.
3. Los datos repetidos y controlados se manejan mediante catálogos.
4. Si un dato solo tiene dos estados, como activo/inactivo, se puede manejar con BOOLEAN.
5. Si un dato tiene varios estados de negocio, como pendiente, aprobado, rechazado o cancelado, se maneja con catálogo.
6. Los botones, pantallas, secciones, menús o dashboards no son entidades de base de datos.
7. Los datos calculables, como el porcentaje de avance, no se guardan como atributo fijo si pueden obtenerse mediante consulta.
8. Las contraseñas no se guardan en texto plano; se guarda un password_hash.
9. Los estados se guardan en la base de datos, pero normalmente los cambios de estado los realiza el backend.
10. Los identificadores externos de pago no los genera EduTech, sino la pasarela de pago.
11. Una orden puede incluir varios cursos; por eso los cursos comprados se guardan en Orden_Detalle.

---

## Criterio para tipos de dato

Los tipos de dato se plantean pensando en PostgreSQL y en el tamaño esperado del proyecto.

| Caso | Tipo sugerido |
|---|---|
| Identificadores principales | INTEGER PK |
| Llaves foráneas | INTEGER FK |
| Texto corto | VARCHAR(n) |
| Texto largo | TEXT |
| Dinero o calificaciones | NUMERIC(p,s) |
| Fecha y hora | TIMESTAMP |
| Verdadero / falso | BOOLEAN |
| Teléfono mexicano | CHAR(10) |
| Código postal mexicano | CHAR(5) |
| Código de moneda | CHAR(3) |
| Contenido de webhook | JSONB |

---

# Entidades y atributos

---

## 2. Rol

Representa los roles principales del sistema.

**Justificación:**  
Se crea porque EduTech maneja diferentes tipos de usuario: Alumno, Instructor y Administrador. Separar los roles en una entidad permite controlar permisos y evita repetir texto en la tabla de usuarios.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_rol | INTEGER PK |
| nombre_rol | VARCHAR(30) |

### Registros de catálogo

| id_rol | nombre_rol |
|---:|---|
| 1 | Alumno |
| 2 | Instructor |
| 3 | Administrador |

---

## 3. Usuario

Representa a las personas que utilizan el sistema.

**Justificación:**  
Se crea porque el sistema necesita almacenar los datos de alumnos, instructores y administradores. Esta entidad permite registrar usuarios, iniciar sesión y controlar su rol dentro del sistema.

Se usa esta_activo como BOOLEAN en lugar de crear una tabla Estado_Usuario, porque para este proyecto el usuario solo necesita estar activo o inactivo.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_usuario | INTEGER PK |
| id_rol | INTEGER FK |
| nombre | VARCHAR(80) |
| apellido_paterno | VARCHAR(80) |
| apellido_materno | VARCHAR(80) |
| correo | VARCHAR(150) |
| password_hash | VARCHAR(255) |
| telefono | CHAR(10) |
| esta_activo | BOOLEAN |
| fecha_registro | TIMESTAMP |
| fecha_actualizacion | TIMESTAMP |

### Registros de ejemplo

| id_usuario | id_rol | nombre | apellido_paterno | apellido_materno | correo | password_hash | telefono | esta_activo | fecha_registro | fecha_actualizacion |
|---:|---:|---|---|---|---|---|---|---|---|---|
| 1 | 1 | Emanuel | Villanueva | García | emanuel@gmail.com | hash_ejemplo_1 | 5512345678 | true | 2026-05-01 10:00:00 | 2026-05-01 10:00:00 |
| 2 | 2 | Luisa | Pérez | Ramírez | luisa@gmail.com | hash_ejemplo_2 | 5598765432 | true | 2026-05-01 11:00:00 | 2026-05-01 11:00:00 |

---

## 4. Nivel_Curso

Representa el nivel de dificultad de un curso.

**Justificación:**  
Se crea para normalizar los niveles de dificultad. Es mejor usar catálogo porque el nivel se repite en muchos cursos y debe tener valores controlados.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_nivel_curso | INTEGER PK |
| nombre_nivel | VARCHAR(30) |

### Registros de catálogo

| id_nivel_curso | nombre_nivel |
|---:|---|
| 1 | principiante |
| 2 | intermedio |
| 3 | avanzado |

---

## 5. Estado_Curso

Representa el estado de publicación de un curso.

**Justificación:**  
Se crea como catálogo porque el curso puede tener más de dos estados. No basta con un BOOLEAN, ya que no solo existe publicado/no publicado.

### Estados propuestos

| Estado | Explicación |
|---|---|
| borrador | El instructor todavía está creando el curso. |
| pendiente_revision | El curso ya fue terminado por el instructor, pero falta revisión del administrador. |
| publicado | El curso aparece en el catálogo y puede comprarse. |
| no_publicado | El curso no aparece en el catálogo. |

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_curso | INTEGER PK |
| nombre_estado_curso | VARCHAR(30) |

### Registros de catálogo

| id_estado_curso | nombre_estado_curso |
|---:|---|
| 1 | borrador |
| 2 | pendiente_revision |
| 3 | publicado |
| 4 | no_publicado |

---

## 6. Curso

Representa los cursos creados dentro de la plataforma.

**Justificación:**  
Se crea porque EduTech necesita almacenar la información de cada curso: usuario instructor, nivel, estado, título, descripción, imagen y precio.

No se usa resumen porque no está como requerimiento obligatorio. La descripción completa puede recortarse visualmente en el frontend cuando se muestre en el catálogo.

Cuando se crea un curso, el backend puede asignarle automáticamente el estado borrador.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_curso | INTEGER PK |
| id_usuario | INTEGER FK |
| id_nivel_curso | INTEGER FK |
| id_estado_curso | INTEGER FK |
| titulo | VARCHAR(150) |
| descripcion | TEXT |
| imagen_portada | VARCHAR(255) |
| precio_mxn | NUMERIC(10,2) |
| fecha_creacion | TIMESTAMP |
| fecha_actualizacion | TIMESTAMP |

### Registros de ejemplo

| id_curso | id_usuario | id_nivel_curso | id_estado_curso | titulo | descripcion | imagen_portada | precio_mxn | fecha_creacion | fecha_actualizacion |
|---:|---:|---:|---:|---|---|---|---:|---|---|
| 1 | 2 | 1 | 3 | Java desde cero | Curso introductorio de Java con módulos, lecciones y examen final. | java.jpg | 299.00 | 2026-05-02 09:00:00 | 2026-05-02 09:00:00 |
| 2 | 2 | 2 | 1 | Bases de datos | Curso sobre entidades, relaciones, normalización y SQL. | bd.jpg | 349.00 | 2026-05-02 10:00:00 | 2026-05-02 10:00:00 |

---

## 7. Modulo

Representa las divisiones internas de un curso.

**Justificación:**  
Se crea porque los cursos se organizan por módulos. Cada módulo pertenece a un curso y tiene un orden dentro de él.

No se agrega descripción al módulo porque el requerimiento indica que el módulo tiene nombre y número. La descripción detallada vive en las lecciones.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_modulo | INTEGER PK |
| id_curso | INTEGER FK |
| titulo | VARCHAR(150) |
| numero_orden | INTEGER |

### Registros de ejemplo

| id_modulo | id_curso | titulo | numero_orden |
|---:|---:|---|---:|
| 1 | 1 | Introducción a Java | 1 |
| 2 | 1 | Variables y tipos de datos | 2 |

---

## 8. Tipo_Video

Representa el tipo de video que tendrá una lección.

**Justificación:**  
Se crea porque el reproductor de EduTech debe poder manejar diferentes formas de mostrar un video. No es lo mismo mostrar un video de YouTube, uno de Vimeo o uno cargado localmente en el servidor.

| Tipo de video | Cómo lo interpreta el sistema |
|---|---|
| youtube | El sistema muestra el video como inserción externa de YouTube. |
| vimeo | El sistema muestra el video como inserción externa de Vimeo. |
| local | El sistema reproduce un archivo guardado en el servidor. |

### Ejemplo de formulario para el instructor

| Campo | Ejemplo |
|---|---|
| Título de la lección | Introducción a Java |
| Tipo de video | YouTube |
| URL o ruta del video | https://youtube.com/watch?v=abc123 |

Si el instructor selecciona youtube, el sistema sabe que debe mostrar el video como contenido embebido de YouTube.

Si selecciona vimeo, el sistema debe usar el reproductor de Vimeo.

Si selecciona local, el sistema debe reproducir un archivo guardado dentro del servidor o almacenamiento del sistema.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_tipo_video | INTEGER PK |
| nombre_tipo_video | VARCHAR(30) |

### Registros de catálogo

| id_tipo_video | nombre_tipo_video |
|---:|---|
| 1 | youtube |
| 2 | vimeo |
| 3 | local |

---

## 9. Leccion

Representa una lección perteneciente a un módulo.

**Justificación:**  
Se crea porque cada módulo contiene lecciones. La lección almacena el contenido principal que consume el alumno: título, texto descriptivo, video y orden.

Se usa esta_activa como BOOLEAN en lugar de crear Estado_Leccion, porque para este proyecto basta con saber si la lección está disponible o no.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_leccion | INTEGER PK |
| id_modulo | INTEGER FK |
| id_tipo_video | INTEGER FK |
| titulo | VARCHAR(150) |
| numero_orden | INTEGER |
| texto_descriptivo | TEXT |
| url_video | VARCHAR(255) |
| duracion_segundos | INTEGER |
| esta_activa | BOOLEAN |

### Registros de ejemplo

| id_leccion | id_modulo | id_tipo_video | titulo | numero_orden | texto_descriptivo | url_video | duracion_segundos | esta_activa |
|---:|---:|---:|---|---:|---|---|---:|---|
| 1 | 1 | 1 | Bienvenida al curso | 1 | Presentación general del curso. | https://youtube.com/watch?v=abc123 | 300 | true |
| 2 | 1 | 1 | Instalación de herramientas | 2 | Instalación de Java y editor de código. | https://youtube.com/watch?v=def456 | 600 | true |

---

## 10. Tipo_Recurso

Representa los tipos de recursos adicionales que puede tener una lección.

**Justificación:**  
Se crea porque los recursos no siempre se muestran igual. Un PDF puede descargarse, un enlace puede abrirse en otra pestaña, un archivo puede descargarse y un repositorio puede abrirse como sitio externo.

| Tipo de recurso | Cómo se muestra en la lección |
|---|---|
| pdf | Se muestra como material descargable. |
| enlace | Se muestra como enlace externo. |
| archivo | Se muestra como archivo descargable. |
| repositorio | Se muestra como enlace a repositorio de código. |

### Ejemplo de visualización para el alumno

| Recurso | Tipo | Acción mostrada |
|---|---|---|
| Guía de instalación | pdf | Descargar PDF |
| Documentación oficial Java | enlace | Abrir enlace |
| Proyecto base | archivo | Descargar archivo |
| Código fuente | repositorio | Ver repositorio |

Sin Tipo_Recurso, el sistema solo tendría una URL y no sabría claramente cómo presentar cada material.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_tipo_recurso | INTEGER PK |
| nombre_tipo_recurso | VARCHAR(30) |

### Registros de catálogo

| id_tipo_recurso | nombre_tipo_recurso |
|---:|---|
| 1 | pdf |
| 2 | enlace |
| 3 | archivo |
| 4 | repositorio |

---

## 11. Recurso

Representa materiales adicionales que pueden asociarse a una o varias lecciones.

**Justificación:**  
Se crea para almacenar materiales adicionales como PDFs, enlaces, archivos o repositorios. Se separa de Leccion porque una lección puede tener varios recursos y un mismo recurso puede reutilizarse en más de una lección.

Se elimina id_creador porque no está explícitamente en los requerimientos y puede deducirse desde el curso/instructor si fuera necesario.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_recurso | INTEGER PK |
| id_tipo_recurso | INTEGER FK |
| titulo | VARCHAR(150) |
| descripcion | VARCHAR(255) |
| url_recurso | VARCHAR(255) |
| fecha_creacion | TIMESTAMP |

### Registros de ejemplo

| id_recurso | id_tipo_recurso | titulo | descripcion | url_recurso | fecha_creacion |
|---:|---:|---|---|---|---|
| 1 | 1 | Guía de instalación | PDF con pasos de instalación. | recursos/guia-instalacion.pdf | 2026-05-02 12:00:00 |
| 2 | 2 | Documentación oficial Java | Enlace de apoyo. | https://docs.oracle.com | 2026-05-02 12:30:00 |

---

## 12. Leccion_Recurso

Representa la relación entre lecciones y recursos.

**Justificación:**  
Se crea como entidad intermedia porque una lección puede tener varios recursos y un mismo recurso puede aparecer en varias lecciones.

El atributo numero_orden no ordena las lecciones ni el video principal. Solo indica el orden en que se muestran los recursos adicionales dentro de una misma lección.

Ejemplo:

| id_leccion | id_recurso | numero_orden |
|---:|---:|---:|
| 1 | 1 | 1 |
| 1 | 2 | 2 |
| 2 | 1 | 1 |

Interpretación:

- En la lección 1, el recurso 1 aparece primero.
- En la lección 1, el recurso 2 aparece segundo.
- En la lección 2, el recurso 1 también puede aparecer primero porque es otra lección.

Para evitar errores, no debe repetirse el mismo numero_orden dentro de la misma lección.

| Regla | Explicación |
|---|---|
| No repetir numero_orden para la misma lección | Evita que dos recursos aparezcan en la misma posición. |
| Permitir repetir numero_orden en lecciones diferentes | Cada lección tiene su propio orden de recursos. |

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_leccion | INTEGER PK/FK |
| id_recurso | INTEGER PK/FK |
| numero_orden | INTEGER |

### Registros de ejemplo

| id_leccion | id_recurso | numero_orden |
|---:|---:|---:|
| 1 | 1 | 1 |
| 1 | 2 | 2 |

---

## 13. Moneda

Representa las monedas permitidas en órdenes y pagos.

**Justificación:**  
Se crea porque las pasarelas de pago manejan la moneda de forma explícita. Aunque el sistema use pesos mexicanos, conviene registrar la moneda en órdenes y pagos.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_moneda | INTEGER PK |
| codigo_moneda | CHAR(3) |
| nombre_moneda | VARCHAR(50) |

### Registros de catálogo

| id_moneda | codigo_moneda | nombre_moneda |
|---:|---|---|
| 1 | MXN | Peso mexicano |
| 2 | USD | Dólar estadounidense |

---

## 14. Estado_Orden

Representa los estados de una orden de compra.

**Justificación:**  
Se crea como catálogo porque una orden puede tener varios estados de negocio.

### Estados propuestos

| Estado | Explicación |
|---|---|
| pendiente | La orden se creó, pero el pago todavía no se confirma. |
| completada | El pago fue aprobado y el curso puede liberarse. |
| cancelada | El alumno canceló explícitamente la compra. |
| fallida | Hubo error o rechazo en el proceso de pago. |
| expirada | La orden quedó sin pago durante demasiado tiempo. |

Si el alumno solo abandona la página sin cancelar, la orden puede permanecer como pendiente hasta que el sistema la marque como expirada.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_orden | INTEGER PK |
| nombre_estado_orden | VARCHAR(30) |

### Registros de catálogo

| id_estado_orden | nombre_estado_orden |
|---:|---|
| 1 | pendiente |
| 2 | completada |
| 3 | cancelada |
| 4 | fallida |
| 5 | expirada |

---

## 15. Orden

Representa el pedido generado cuando un alumno inicia una compra.

Justificación:
Se crea porque el sistema necesita registrar cada compra realizada por el alumno. Una orden puede incluir uno o varios cursos.

La orden ya no guarda id_curso directamente, porque eso solo permitiría comprar un curso por orden. Para permitir varios cursos en una misma compra, los cursos se guardan en Orden_Detalle.

Se conservan id_orden y numero_orden porque no cumplen la misma función:

- id_orden: identificador interno de la base de datos.
- numero_orden: número visible para el usuario en comprobantes, historial de pedidos y correos.

El numero_orden no se captura a mano. Lo genera el backend cuando se crea la orden.

Ejemplo de generación:

| Campo | Valor |
|---|---|
| id_orden | 15 |
| año | 2026 |
| numero_orden | ORD-2026-000015 |

Si después cambia el estado de la orden, el numero_orden no cambia. Lo que cambia es el estado.

| Momento | Número de orden | Estado |
|---|---|---|
| Orden creada | ORD-2026-000015 | pendiente |
| Después del webhook | ORD-2026-000015 | completada |

En el comprobante se sigue mostrando el mismo número de orden, pero con estado actualizado.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_orden | INTEGER PK |
| numero_orden | CHAR(20) |
| id_usuario | INTEGER FK |
| id_moneda | INTEGER FK |
| id_estado_orden | INTEGER FK |
| total | NUMERIC(10,2) |
| fecha_creacion | TIMESTAMP |
| fecha_actualizacion | TIMESTAMP |

### Registros de ejemplo

| id_orden | numero_orden | id_usuario | id_moneda | id_estado_orden | total | fecha_creacion | fecha_actualizacion |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | ORD-2026-000001 | 1 | 1 | 2 | 648.00 | 2026-05-03 09:00:00 | 2026-05-03 09:05:00 |
| 2 | ORD-2026-000002 | 1 | 1 | 1 | 399.00 | 2026-05-03 10:00:00 | 2026-05-03 10:00:00 |

---

## 16. Orden_Detalle

Representa cada curso incluido dentro de una orden.

Justificación:
Se crea porque una orden puede incluir varios cursos. Cada registro de Orden_Detalle representa un curso específico dentro de la compra y conserva el precio usado en ese momento.

Esto evita conectar Orden directamente con Curso. La relación correcta es:

Orden se conecta con Orden_Detalle y Orden_Detalle se conecta con Curso.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_orden_detalle | INTEGER PK |
| id_orden | INTEGER FK |
| id_curso | INTEGER FK |
| precio_unitario | NUMERIC(10,2) |

### Registros de ejemplo

| id_orden_detalle | id_orden | id_curso | precio_unitario |
|---:|---:|---:|---:|
| 1 | 1 | 1 | 299.00 |
| 2 | 1 | 2 | 349.00 |
| 3 | 2 | 3 | 399.00 |

---

## 17. Diferencia entre precio_mxn, precio_unitario y total

precio_mxn, precio_unitario y total no son lo mismo.

| Campo | Significado |
|---|---|
| Curso.precio_mxn | Precio actual del curso. |
| Orden_Detalle.precio_unitario | Precio del curso en el momento exacto de la compra. |
| Orden.total | Total cobrado en una orden específica. |

Ejemplo:

| Momento | Curso.precio_mxn | Orden_Detalle.precio_unitario | Orden.total |
|---|---:|---:|---:|
| Emanuel compra Java y Bases de datos | 299.00 y 349.00 | 299.00 y 349.00 | 648.00 |
| Después cambia el precio de Java | 399.00 | 299.00 | 648.00 |

Por eso se guardan estos datos. Curso.precio_mxn puede cambiar, pero Orden_Detalle.precio_unitario conserva el precio usado en la compra y Orden.total conserva el total cobrado.

---

## 18. Estado_Federativo

Representa los estados de México usados en los datos de compra.

**Justificación:**  
Se crea porque el sistema será usado en México y el estado federativo es un dato repetido. Normalizarlo evita escribir muchas veces valores como “CDMX”, “Ciudad de México” o “Cdmx”.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_federativo | INTEGER PK |
| nombre_estado_federativo | VARCHAR(80) |

### Registros de catálogo

| id_estado_federativo | nombre_estado_federativo |
|---:|---|
| 1 | Ciudad de México |
| 2 | Estado de México |
| 3 | Jalisco |
| 4 | Nuevo León |

---

## 19. Ciudad

Representa las ciudades disponibles para los datos de compra.

**Justificación:**  
Se crea porque la ciudad también puede repetirse en muchos registros de compra. Además, cada ciudad pertenece a un estado federativo.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_ciudad | INTEGER PK |
| id_estado_federativo | INTEGER FK |
| nombre_ciudad | VARCHAR(80) |

### Registros de ejemplo

| id_ciudad | id_estado_federativo | nombre_ciudad |
|---:|---:|---|
| 1 | 1 | Ciudad de México |
| 2 | 2 | Toluca |

---

## 20. Datos_Compra

Guarda los datos de contacto y facturación capturados durante la compra.

**Justificación:**  
Se crea para conservar una copia de los datos usados al momento de comprar. Estos datos pueden coincidir con los datos del usuario, pero se guardan aparte porque representan la información capturada en esa orden específica.

Se usa una sola direccion porque para este proyecto no se requiere separar dirección en línea 1 y línea 2.

Se normalizan ciudad y estado federativo mediante catálogos.

El código postal se deja como atributo porque convertirlo en catálogo sería demasiado para el alcance del proyecto.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_orden | INTEGER PK/FK |
| nombre_contacto | VARCHAR(80) |
| apellido_paterno_contacto | VARCHAR(80) |
| apellido_materno_contacto | VARCHAR(80) |
| correo_contacto | VARCHAR(150) |
| telefono_contacto | CHAR(10) |
| direccion | VARCHAR(180) |
| id_ciudad | INTEGER FK |
| codigo_postal | CHAR(5) |

### Registros de ejemplo

| id_orden | nombre_contacto | apellido_paterno_contacto | apellido_materno_contacto | correo_contacto | telefono_contacto | direccion | id_ciudad | codigo_postal |
|---:|---|---|---|---|---|---|---:|---|
| 1 | Emanuel | Villanueva | García | emanuel@gmail.com | 5512345678 | Av. Universidad 3000 Depto 2 | 1 | 04510 |
| 2 | Emanuel | Villanueva | García | emanuel@gmail.com | 5512345678 | Av. Universidad 3000 Depto 2 | 1 | 04510 |

---

## 21. Proveedor_Pago

Representa las pasarelas de pago permitidas.

**Justificación:**  
Se crea para controlar qué proveedores puede usar EduTech para procesar pagos, como PayPal o Stripe.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_proveedor_pago | INTEGER PK |
| nombre_proveedor | VARCHAR(30) |

### Registros de catálogo

| id_proveedor_pago | nombre_proveedor |
|---:|---|
| 1 | PayPal |
| 2 | Stripe |

---

## 22. Estado_Pago

Representa los estados posibles de un pago.

**Justificación:**  
Se crea como catálogo porque un pago puede tener varios estados de negocio. El estado del pago determina si el curso se libera o no.

### Estados propuestos

| Estado | Explicación |
|---|---|
| pendiente | El pago fue iniciado, pero todavía no se confirma. |
| aprobado | La pasarela confirmó que el pago fue exitoso. |
| rechazado | La pasarela rechazó el pago. |
| cancelado | El usuario canceló el proceso de pago. |

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_pago | INTEGER PK |
| nombre_estado_pago | VARCHAR(30) |

### Registros de catálogo

| id_estado_pago | nombre_estado_pago |
|---:|---|
| 1 | pendiente |
| 2 | aprobado |
| 3 | rechazado |
| 4 | cancelado |

---

## 23. Pago

Representa el pago asociado a una orden.

**Justificación:**  
Se crea porque cada orden necesita registrar información del pago realizado o intentado. No guarda datos bancarios sensibles, solo datos necesarios para relacionar la orden con la pasarela externa.

Se usa monto_pagado para distinguirlo de Orden.total.

| Campo | Significado |
|---|---|
| Orden.total | Total que EduTech espera cobrar. |
| Pago.monto_pagado | Monto confirmado por la pasarela. |

id_pago_externo no lo genera EduTech. Lo genera la pasarela de pago y se guarda para relacionar el pago interno con la transacción externa.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_pago | INTEGER PK |
| id_orden | INTEGER FK |
| id_proveedor_pago | INTEGER FK |
| id_estado_pago | INTEGER FK |
| id_moneda | INTEGER FK |
| id_pago_externo | VARCHAR(120) |
| monto_pagado | NUMERIC(10,2) |
| fecha_pago | TIMESTAMP |

### Registros de ejemplo

| id_pago | id_orden | id_proveedor_pago | id_estado_pago | id_moneda | id_pago_externo | monto_pagado | fecha_pago |
|---:|---:|---:|---:|---:|---|---:|---|
| 1 | 1 | 1 | 2 | 1 | PAYPAL-ABC123 | 299.00 | 2026-05-03 09:05:00 |
| 2 | 2 | 1 | 1 | 1 | PAYPAL-DEF456 | 349.00 | NULL |

---

## 24. Estado_Webhook

Representa el estado de procesamiento de una notificación recibida desde una pasarela de pago.

**Justificación:**  
Se crea para saber si un webhook fue recibido, procesado o falló. Esto ayuda a controlar la liberación automática del curso.

### Estados propuestos

| Estado | Explicación |
|---|---|
| recibido | EduTech recibió el evento, pero aún no lo procesa completamente. |
| procesado | El evento fue validado y aplicado correctamente. |
| fallido | El evento no pudo procesarse por error o inconsistencia. |

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_webhook | INTEGER PK |
| nombre_estado_webhook | VARCHAR(30) |

### Registros de catálogo

| id_estado_webhook | nombre_estado_webhook |
|---:|---|
| 1 | recibido |
| 2 | procesado |
| 3 | fallido |

---

## 25. Webhook_Pago

Guarda las notificaciones recibidas desde PayPal o Stripe.

**Justificación:**  
Se crea porque la pasarela de pago notifica automáticamente el resultado del pago. Esta entidad permite registrar qué evento llegó, cuándo llegó y si fue procesado.

El atributo contenido_evento guarda la información completa enviada por la pasarela. Sirve como evidencia técnica de lo que respondió PayPal o Stripe.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_webhook | INTEGER PK |
| id_pago | INTEGER FK |
| id_proveedor_pago | INTEGER FK |
| id_estado_webhook | INTEGER FK |
| tipo_evento | VARCHAR(100) |
| id_evento_externo | VARCHAR(150) |
| contenido_evento | JSONB |
| fecha_recibido | TIMESTAMP |

### Registros de ejemplo

| id_webhook | id_pago | id_proveedor_pago | id_estado_webhook | tipo_evento | id_evento_externo | contenido_evento | fecha_recibido |
|---:|---:|---:|---:|---|---|---|---|
| 1 | 1 | 1 | 2 | PAYMENT.CAPTURE.COMPLETED | WH-001 | {"status":"COMPLETED"} | 2026-05-03 09:05:10 |
| 2 | 2 | 1 | 1 | CHECKOUT.ORDER.CREATED | WH-002 | {"status":"CREATED"} | 2026-05-03 10:00:10 |

---

## 26. Estado_Inscripcion

Representa los estados posibles de una inscripción.

**Justificación:**  
Se crea como catálogo porque la inscripción puede tener varios estados de negocio.

### Estados propuestos

| Estado | Explicación |
|---|---|
| activa | El alumno tiene acceso al curso. |
| completada | El alumno terminó el curso. |
| cancelada | La inscripción fue cancelada o revocada. |

El estado cancelada se usaría cuando el acceso al curso fue revocado después de haberse creado la inscripción, por ejemplo por reembolso, error administrativo o validación del pago.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_inscripcion | INTEGER PK |
| nombre_estado_inscripcion | VARCHAR(30) |

### Registros de catálogo

| id_estado_inscripcion | nombre_estado_inscripcion |
|---:|---|
| 1 | activa |
| 2 | completada |
| 3 | cancelada |

---

## 27. Inscripcion

Representa el acceso de un alumno a un curso comprado.

Justificación:
Se crea porque el sistema necesita saber qué cursos fueron liberados para el alumno después de una compra aprobada.

La inscripción se genera a partir de Orden_Detalle, no directamente desde Orden. Esto es necesario porque una orden puede tener varios cursos.

Ejemplo:

| Orden | Curso en Orden_Detalle | Inscripción generada |
|---|---|---|
| ORD-2026-000001 | Java desde cero | Inscripción a Java |
| ORD-2026-000001 | Bases de datos | Inscripción a Bases de datos |

Si una orden contiene tres cursos, se crean tres registros en Orden_Detalle y después tres inscripciones, una por cada curso comprado.

La fecha de finalización se guarda aquí porque la finalización pertenece al acceso del alumno a ese curso específico.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_inscripcion | INTEGER PK |
| id_orden_detalle | INTEGER FK |
| id_estado_inscripcion | INTEGER FK |
| fecha_inscripcion | TIMESTAMP |
| fecha_finalizacion | TIMESTAMP |

### Registros de ejemplo

| id_inscripcion | id_orden_detalle | id_estado_inscripcion | fecha_inscripcion | fecha_finalizacion |
|---:|---:|---:|---|---|
| 1 | 1 | 1 | 2026-05-03 09:06:00 | NULL |
| 2 | 2 | 1 | 2026-05-03 09:06:00 | NULL |

---

## 28. Progreso_Leccion

Registra las lecciones completadas por un alumno dentro de una inscripción.

**Justificación:**  
Se crea para guardar el avance real del alumno. Con esta entidad se puede calcular el porcentaje de avance sin guardarlo directamente.

La base guarda qué lecciones se completaron. El backend puede calcular el porcentaje usando esos datos.

| Lecciones completadas | Total de lecciones | Porcentaje |
|---:|---:|---:|
| 8 | 20 | 40% |

No se guarda un atributo llamado porcentaje_avance, porque podría desactualizarse. Es mejor calcularlo cuando se necesite.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_inscripcion | INTEGER PK/FK |
| id_leccion | INTEGER PK/FK |
| completada | BOOLEAN |
| fecha_completada | TIMESTAMP |

### Registros de ejemplo

| id_inscripcion | id_leccion | completada | fecha_completada |
|---:|---:|---|---|
| 1 | 1 | true | 2026-05-03 11:00:00 |
| 1 | 2 | false | NULL |

---

## 29. Estado_Examen

Representa los estados posibles del examen.

**Justificación:**  
Se crea como catálogo porque el examen puede tener varios estados.

### Estados propuestos

| Estado | Explicación |
|---|---|
| borrador | El examen todavía se está configurando. |
| activo | El examen puede ser presentado por los alumnos. |
| inactivo | El examen ya no está disponible. |

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_examen | INTEGER PK |
| nombre_estado_examen | VARCHAR(30) |

### Registros de catálogo

| id_estado_examen | nombre_estado_examen |
|---:|---|
| 1 | borrador |
| 2 | activo |
| 3 | inactivo |

---

## 30. Examen

Representa el examen final de un curso.

**Justificación:**  
Se crea porque cada curso puede tener un examen final con tiempo límite, número de intentos, calificación mínima y cantidad de preguntas.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_examen | INTEGER PK |
| id_curso | INTEGER FK |
| id_estado_examen | INTEGER FK |
| titulo | VARCHAR(150) |
| descripcion | TEXT |
| tiempo_limite_minutos | INTEGER |
| max_intentos | INTEGER |
| calificacion_minima | NUMERIC(5,2) |
| cantidad_preguntas | INTEGER |

### Registros de ejemplo

| id_examen | id_curso | id_estado_examen | titulo | descripcion | tiempo_limite_minutos | max_intentos | calificacion_minima | cantidad_preguntas |
|---:|---:|---:|---|---|---:|---:|---:|---:|
| 1 | 1 | 2 | Examen final de Java | Evaluación final del curso. | 30 | 2 | 70.00 | 10 |
| 2 | 2 | 1 | Examen final de Bases de Datos | Evaluación sobre modelado y SQL. | 40 | 2 | 70.00 | 15 |

---

## 31. Pregunta

Representa una pregunta del banco de preguntas.

**Justificación:**  
Se crea para almacenar las preguntas que el instructor usará en el examen final.

Se usa esta_activa como BOOLEAN en lugar de crear Estado_Pregunta, porque para este proyecto basta con saber si la pregunta está activa o no.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_pregunta | INTEGER PK |
| id_examen | INTEGER FK |
| texto_pregunta | TEXT |
| esta_activa | BOOLEAN |

### Registros de ejemplo

| id_pregunta | id_examen | texto_pregunta | esta_activa |
|---:|---:|---|---|
| 1 | 1 | ¿Qué es una clase en Java? | true |
| 2 | 1 | ¿Qué palabra reservada se usa para crear un objeto? | true |

---

## 32. Opcion_Respuesta

Representa las opciones de respuesta de una pregunta.

**Justificación:**  
Se crea porque cada pregunta de opción múltiple necesita varias opciones y una de ellas debe identificarse como correcta.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_opcion | INTEGER PK |
| id_pregunta | INTEGER FK |
| texto_opcion | TEXT |
| es_correcta | BOOLEAN |

### Registros de ejemplo

| id_opcion | id_pregunta | texto_opcion | es_correcta |
|---:|---:|---|---|
| 1 | 1 | Una plantilla para crear objetos | true |
| 2 | 1 | Una base de datos | false |

---

## 33. Estado_Intento

Representa el estado de un intento de examen.

**Justificación:**  
Se crea como catálogo porque un intento puede tener más de dos estados importantes. No basta con un BOOLEAN.

### Estados propuestos

| Estado | Explicación |
|---|---|
| en_progreso | El alumno inició el examen, pero todavía no lo envía. |
| finalizado | El alumno envió respuestas y ya tiene calificación. |
| invalidado | El sistema anuló el intento por una regla, error o salida indebida. |
| abandonado | El alumno salió o perdió conexión antes de terminar. |

Las reglas para cambiar un intento a invalidado o abandonado normalmente las define el backend.

Ejemplos:

| Situación | Estado posible |
|---|---|
| El alumno inicia el examen | en_progreso |
| El alumno envía el examen | finalizado |
| El sistema detecta salida indebida | invalidado |
| El alumno pierde conexión o cierra sin terminar | abandonado |

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_estado_intento | INTEGER PK |
| nombre_estado_intento | VARCHAR(30) |

### Registros de catálogo

| id_estado_intento | nombre_estado_intento |
|---:|---|
| 1 | en_progreso |
| 2 | finalizado |
| 3 | invalidado |
| 4 | abandonado |

---

## 34. Intento_Examen

Representa cada intento realizado por un alumno al presentar un examen.

**Justificación:**  
Se crea para guardar cada presentación del examen. Permite controlar intentos, calificación, fecha de inicio, fecha de finalización y aprobación.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_intento | INTEGER PK |
| id_examen | INTEGER FK |
| id_inscripcion | INTEGER FK |
| id_estado_intento | INTEGER FK |
| numero_intento | INTEGER |
| fecha_inicio | TIMESTAMP |
| fecha_fin | TIMESTAMP |
| calificacion | NUMERIC(5,2) |
| aprobado | BOOLEAN |

### Registros de ejemplo

| id_intento | id_examen | id_inscripcion | id_estado_intento | numero_intento | fecha_inicio | fecha_fin | calificacion | aprobado |
|---:|---:|---:|---:|---:|---|---|---:|---|
| 1 | 1 | 1 | 2 | 1 | 2026-05-04 12:00:00 | 2026-05-04 12:25:00 | 80.00 | true |
| 2 | 1 | 1 | 1 | 2 | 2026-05-05 12:00:00 | NULL | NULL | NULL |

---

## 35. Pregunta_Intento

Guarda las preguntas asignadas a un intento de examen.

**Justificación:**  
Se crea porque el examen usa preguntas aleatorias. Esta entidad conserva qué preguntas le tocaron a cada alumno en cada intento.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_intento | INTEGER PK/FK |
| id_pregunta | INTEGER PK/FK |
| numero_orden | INTEGER |

### Registros de ejemplo

| id_intento | id_pregunta | numero_orden |
|---:|---:|---:|
| 1 | 1 | 1 |
| 1 | 2 | 2 |

---

## 36. Respuesta_Alumno

Guarda la respuesta seleccionada por el alumno.

**Justificación:**  
Se crea para guardar qué respondió el alumno en cada pregunta del intento. También se guarda si fue correcta para conservar el resultado histórico, aunque después el instructor edite la pregunta.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_intento | INTEGER PK/FK |
| id_pregunta | INTEGER PK/FK |
| id_opcion | INTEGER FK |
| es_correcta | BOOLEAN |

### Registros de ejemplo

| id_intento | id_pregunta | id_opcion | es_correcta |
|---:|---:|---:|---|
| 1 | 1 | 1 | true |
| 1 | 2 | 2 | false |

---

## 37. Certificado

Representa el certificado emitido al completar un curso.

**Justificación:**  
Se crea para registrar el certificado que obtiene el alumno cuando completa todas las lecciones y aprueba el examen final.

Se conservan id_certificado y codigo_certificado porque no cumplen la misma función:

| Campo | Uso |
|---|---|
| id_certificado | Identificador interno de la base de datos. |
| codigo_certificado | Código visible para el alumno, útil para mostrar, descargar o validar el certificado. |

El codigo_certificado no se captura a mano. Lo genera el backend cuando se emite el certificado.

Ejemplo de generación:

| Campo | Valor |
|---|---|
| id_certificado | 8 |
| año | 2026 |
| codigo_certificado | EDU-2026-000008 |

El alumno no necesita ver id_certificado. En el certificado se muestra algo como EDU-2026-000008.

### Atributos

| Atributo | Tipo de dato sugerido |
|---|---|
| id_certificado | INTEGER PK |
| id_inscripcion | INTEGER FK |
| codigo_certificado | CHAR(20) |
| fecha_emision | TIMESTAMP |
| url_certificado | VARCHAR(255) |

### Registros de ejemplo

| id_certificado | id_inscripcion | codigo_certificado | fecha_emision | url_certificado |
|---:|---:|---|---|---|
| 1 | 1 | EDU-2026-000001 | 2026-05-04 13:00:00 | certificados/EDU-2026-000001.pdf |
| 2 | 2 | EDU-2026-000002 | 2026-05-06 13:00:00 | certificados/EDU-2026-000002.pdf |

---


# Reglas de integridad explicadas

Estas reglas se explican fuera del diagrama para que el modelo sea más fácil de defender.

| Regla | Explicación |
|---|---|
| Examen.id_curso debe ser único | Cada curso debe tener como máximo un examen final. |
| Orden_Detalle debe evitar repetir id_orden e id_curso | Evita que el mismo curso aparezca dos veces en la misma orden. |
| Modulo debe evitar repetir id_curso y numero_orden | Evita dos módulos en la misma posición dentro del curso. |
| Leccion debe evitar repetir id_modulo y numero_orden | Evita dos lecciones en la misma posición dentro del módulo. |
| Leccion_Recurso debe evitar repetir id_leccion y numero_orden | Evita dos recursos en la misma posición dentro de una lección. |
| Intento_Examen debe evitar repetir id_inscripcion y numero_intento | Controla el número de intentos por inscripción. |
| Pregunta_Intento debe evitar repetir id_intento e id_pregunta | Evita que una pregunta se repita dentro del mismo intento. |
| Pregunta_Intento debe evitar repetir id_intento y numero_orden | Evita dos preguntas en la misma posición del examen. |
| Pago debe evitar repetir id_proveedor_pago e id_pago_externo | Evita duplicar pagos externos de PayPal o Stripe. |
| Webhook_Pago debe evitar repetir id_evento_externo | Evita procesar dos veces el mismo webhook. |


