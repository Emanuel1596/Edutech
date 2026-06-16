-- =========================================================
-- DML EDUTECH
-- =========================================================

SET search_path TO edutech;

-- =========================================================
-- 0) INICIO DE TRANSACCIÓN
-- =========================================================

BEGIN;


-- =========================================================
-- 1) INSERCIÓN DE CATÁLOGOS
-- =========================================================

INSERT INTO rol (nombre_rol) VALUES
('Alumno'),
('Instructor'),
('Administrador');

INSERT INTO nivel_curso (nombre_nivel) VALUES
('principiante'),
('intermedio'),
('avanzado');

INSERT INTO categoria (nombre_categoria, descripcion) VALUES
('Seguridad informática', 'Cursos relacionados con protección de información, seguridad web y buenas prácticas digitales.'),
('Programación', 'Cursos relacionados con desarrollo de software, lógica y construcción de aplicaciones.'),
('Bases de datos', 'Cursos relacionados con modelado, SQL, consultas y administración de datos.'),
('Desarrollo web', 'Cursos relacionados con HTML, CSS, JavaScript y creación de sitios web.'),
('Educación en línea', 'Cursos generales preparados para aprendizaje dentro de una plataforma digital.');

INSERT INTO estado_curso (nombre_estado_curso) VALUES
('borrador'),
('pendiente_revision'),
('publicado'),
('no_publicado');

INSERT INTO tipo_video (nombre_tipo_video) VALUES
('youtube'),
('vimeo'),
('local');

INSERT INTO tipo_recurso (nombre_tipo_recurso) VALUES
('pdf'),
('enlace'),
('archivo'),
('repositorio');

INSERT INTO moneda (codigo_moneda, nombre_moneda) VALUES
('MXN', 'Peso mexicano'),
('USD', 'Dólar estadounidense');

INSERT INTO estado_orden (nombre_estado_orden) VALUES
('pendiente'),
('completada'),
('cancelada'),
('fallida'),
('expirada');

INSERT INTO estado_federativo (nombre_estado_federativo) VALUES
('Ciudad de México'),
('Estado de México'),
('Jalisco'),
('Nuevo León');

INSERT INTO ciudad (id_estado_federativo, nombre_ciudad) VALUES
(1, 'Ciudad de México'),
(2, 'Toluca'),
(3, 'Guadalajara'),
(4, 'Monterrey');

INSERT INTO proveedor_pago (nombre_proveedor) VALUES
('PayPal'),
('Stripe');

INSERT INTO estado_pago (nombre_estado_pago) VALUES
('pendiente'),
('aprobado'),
('rechazado'),
('cancelado');

INSERT INTO estado_webhook (nombre_estado_webhook) VALUES
('recibido'),
('procesado'),
('fallido');

INSERT INTO estado_inscripcion (nombre_estado_inscripcion) VALUES
('activa'),
('completada'),
('cancelada');

INSERT INTO estado_examen (nombre_estado_examen) VALUES
('borrador'),
('activo'),
('inactivo');

INSERT INTO estado_intento (nombre_estado_intento) VALUES
('en_progreso'),
('finalizado'),
('invalidado'),
('abandonado');

INSERT INTO estado_solicitud_instructor (nombre_estado_solicitud) VALUES
('pendiente'),
('aceptada'),
('rechazada');

INSERT INTO estado_revision_curso (nombre_estado_revision_curso) VALUES
('pendiente'),
('aprobada'),
('rechazada');


-- =========================================================
-- 2) INSERCIÓN DE USUARIOS
-- =========================================================

INSERT INTO usuario
(id_rol, nombre, apellido_paterno, apellido_materno, correo, password_hash, telefono, esta_activo)
VALUES
(1, 'Emanuel', 'Villanueva', 'Garcia', 'emanuel.alumno@edutech.com', '$2b$10$hash_alumno_demo', '5512345678', TRUE),
(2, 'Lester', 'Crest', NULL, 'lester.instructor@edutech.com', '$2b$10$hash_instructor_demo', '5598765432', TRUE),
(2, 'Luisa', 'Perez', NULL, 'luisa.instructor@edutech.com', '$2b$10$hash_instructor2_demo', '5511112222', TRUE),
(3, 'Andrea', 'Admin', NULL, 'admin@edutech.com', '$2b$10$hash_admin_demo', '5522223333', TRUE);


-- =========================================================
-- 3) INSERCIÓN DE SOLICITUDES Y CURSOS
-- =========================================================

INSERT INTO solicitud_instructor
(id_usuario_solicitante, id_usuario_revisor, id_estado_solicitud_instructor, area_experiencia, experiencia, evidencia_url, motivo, comentario_revision, fecha_revision)
VALUES
(1, 4, 2, 'Desarrollo web', 'Experiencia creando cursos y páginas web.', 'https://github.com/emanuel/demo', 'Quiero publicar cursos en EduTech.', 'Solicitud aceptada para prueba.', CURRENT_TIMESTAMP);

INSERT INTO curso
(id_usuario, id_nivel_curso, id_estado_curso, titulo, descripcion, imagen_portada, precio_mxn)
VALUES
(2, 2, 3, 'Hackeo', 'Curso introductorio de seguridad y análisis básico de sistemas.', 'assets/img/curso-hackeo.jpg', 399.00),
(3, 1, 3, 'Bases de datos', 'Curso para aprender modelado, normalización y consultas SQL.', 'assets/img/curso-bd.jpg', 349.00),
(3, 1, 3, 'Desarrollo Web', 'Curso introductorio de HTML, CSS y JavaScript.', 'assets/img/curso-web.jpg', 299.00);

INSERT INTO curso_categoria (id_curso, id_categoria) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 2),
(3, 4),
(3, 2);

INSERT INTO revision_curso
(id_curso, id_estado_revision_curso, id_usuario_revisor, comentario)
VALUES
(1, 2, 4, 'Curso aprobado para publicación.'),
(2, 2, 4, 'Curso aprobado para publicación.'),
(3, 2, 4, 'Curso aprobado para publicación.');


-- =========================================================
-- 4) INSERCIÓN DE MÓDULOS, LECCIONES Y RECURSOS
-- =========================================================

INSERT INTO modulo (id_curso, titulo, numero_orden) VALUES
(1, 'Conociendo la seguridad informática', 1),
(1, 'Reconocimiento del entorno digital', 2),
(1, 'Protección de cursos y evaluaciones', 3),
(1, 'Proyecto de cierre', 4),
(1, 'Examen Final', 5),
(2, 'Fundamentos del modelo relacional', 1),
(2, 'Diseño y normalización', 2),
(2, 'Consultas SQL', 3),
(3, 'HTML y estructura', 1),
(3, 'CSS y diseño visual', 2),
(3, 'JavaScript básico', 3);

INSERT INTO leccion
(id_modulo, id_tipo_video, titulo, numero_orden, texto_descriptivo, url_video, duracion_segundos, esta_activa)
VALUES
(1, 1, 'Bienvenida al curso', 1, 'Presentación general del curso de seguridad informática.', 'https://youtube.com/watch?v=seg-demo-1', 360, TRUE),
(1, 1, '¿Qué es la seguridad informática?', 2, 'Conceptos principales de seguridad informática.', 'https://youtube.com/watch?v=seg-demo-2', 600, TRUE),
(1, 1, 'Usuarios, contraseñas y control de acceso', 3, 'Revisión de accesos y protección básica de cuentas.', 'https://youtube.com/watch?v=seg-demo-3', 720, TRUE),
(1, 1, 'Riesgos básicos dentro de una plataforma web', 4, 'Identificación de riesgos comunes en plataformas web.', 'https://youtube.com/watch?v=seg-demo-4', 640, TRUE),
(2, 1, 'Elementos visibles de una pantalla web', 1, 'Reconocimiento de interfaz, formularios y navegación.', 'https://youtube.com/watch?v=seg-demo-5', 500, TRUE),
(2, 1, 'Identificación de formularios y rutas de acceso', 2, 'Análisis de rutas, formularios y flujos de usuario.', 'https://youtube.com/watch?v=seg-demo-6', 520, TRUE),
(2, 1, 'Buenas prácticas para proteger la información', 3, 'Buenas prácticas para reducir riesgos básicos.', 'https://youtube.com/watch?v=seg-demo-7', 680, TRUE),
(2, 1, 'Errores comunes al configurar permisos', 4, 'Errores frecuentes en permisos y accesos.', 'https://youtube.com/watch?v=seg-demo-8', 620, TRUE),
(3, 1, 'Acceso solo para alumnos inscritos', 1, 'Control de acceso a contenido comprado.', 'https://youtube.com/watch?v=seg-demo-9', 700, TRUE),
(3, 1, 'Protección de exámenes y archivos', 2, 'Protección básica de recursos y evaluaciones.', 'https://youtube.com/watch?v=seg-demo-10', 760, TRUE),
(3, 1, 'Revisión de avance y finalización', 3, 'Seguimiento de avance del alumno.', 'https://youtube.com/watch?v=seg-demo-11', 540, TRUE),
(4, 1, 'Análisis visual de una plataforma educativa', 1, 'Actividad final de revisión visual.', 'https://youtube.com/watch?v=seg-demo-12', 650, TRUE),
(4, 1, 'Recomendaciones finales de seguridad', 2, 'Cierre con recomendaciones prácticas.', 'https://youtube.com/watch?v=seg-demo-13', 480, TRUE),
(5, 1, 'Examen final', 1, 'Evaluación final del curso.', 'https://youtube.com/watch?v=seg-demo-14', 900, TRUE),
(6, 1, 'Qué es una base de datos', 1, 'Introducción a bases de datos.', 'https://youtube.com/watch?v=bd-demo-1', 500, TRUE),
(6, 1, 'Tablas, campos y registros', 2, 'Elementos básicos del modelo relacional.', 'https://youtube.com/watch?v=bd-demo-2', 620, TRUE),
(6, 1, 'Llaves primarias y foráneas', 3, 'Relación entre tablas mediante llaves.', 'https://youtube.com/watch?v=bd-demo-3', 700, TRUE),
(7, 1, 'Primera forma normal', 1, 'Reglas básicas de normalización.', 'https://youtube.com/watch?v=bd-demo-4', 640, TRUE),
(7, 1, 'Segunda forma normal', 2, 'Dependencias y separación de datos.', 'https://youtube.com/watch?v=bd-demo-5', 630, TRUE),
(7, 1, 'Tercera forma normal', 3, 'Eliminación de dependencias transitivas.', 'https://youtube.com/watch?v=bd-demo-6', 650, TRUE),
(8, 1, 'SELECT básico', 1, 'Consulta básica de datos.', 'https://youtube.com/watch?v=bd-demo-7', 560, TRUE),
(8, 1, 'JOIN entre tablas', 2, 'Consulta de datos relacionados.', 'https://youtube.com/watch?v=bd-demo-8', 720, TRUE),
(8, 1, 'Filtros y ordenamientos', 3, 'Uso de WHERE y ORDER BY.', 'https://youtube.com/watch?v=bd-demo-9', 610, TRUE),
(9, 1, 'Estructura de una página HTML', 1, 'Etiquetas principales de HTML.', 'https://youtube.com/watch?v=web-demo-1', 480, TRUE),
(9, 1, 'Textos, enlaces e imágenes', 2, 'Contenido básico de una página web.', 'https://youtube.com/watch?v=web-demo-2', 520, TRUE),
(9, 1, 'Formularios básicos', 3, 'Campos y botones en HTML.', 'https://youtube.com/watch?v=web-demo-3', 580, TRUE),
(10, 1, 'Selectores CSS', 1, 'Aplicación de estilos con selectores.', 'https://youtube.com/watch?v=web-demo-4', 600, TRUE),
(10, 1, 'Colores, espacios y tamaños', 2, 'Estilos visuales básicos.', 'https://youtube.com/watch?v=web-demo-5', 610, TRUE),
(10, 1, 'Diseño responsive básico', 3, 'Adaptación a diferentes pantallas.', 'https://youtube.com/watch?v=web-demo-6', 660, TRUE),
(11, 1, 'Variables y funciones', 1, 'Primeros pasos con JavaScript.', 'https://youtube.com/watch?v=web-demo-7', 700, TRUE),
(11, 1, 'Eventos del navegador', 2, 'Interacción con botones y formularios.', 'https://youtube.com/watch?v=web-demo-8', 680, TRUE),
(11, 1, 'Proyecto final de página web', 3, 'Integración de HTML, CSS y JavaScript.', 'https://youtube.com/watch?v=web-demo-9', 780, TRUE);


INSERT INTO recurso
(id_tipo_recurso, titulo, descripcion, url_recurso)
VALUES
(1, 'Guía PDF de seguridad', 'Material complementario del curso de Hackeo.', 'assets/recursos/guia-seguridad.pdf'),
(4, 'Repositorio de prácticas', 'Repositorio con ejercicios de SQL.', 'https://github.com/edutech/sql-demo');

INSERT INTO leccion_recurso (id_leccion, id_recurso, numero_orden) VALUES
(1, 1, 1),
(3, 2, 1);


-- =========================================================
-- 5) INSERCIÓN DE ORDEN CON VARIOS CURSOS, PAGO E INSCRIPCIONES
-- =========================================================

INSERT INTO orden
(numero_orden, id_usuario, id_moneda, id_estado_orden, total)
VALUES
('ORD-2026-000001', 1, 1, 2, 748.00);

INSERT INTO orden_detalle
(id_orden, id_curso, precio_unitario)
VALUES
(1, 1, 399.00),
(1, 2, 349.00);

INSERT INTO datos_compra
(id_orden, nombre_contacto, apellido_paterno_contacto, apellido_materno_contacto, correo_contacto, telefono_contacto, direccion, id_ciudad, codigo_postal)
VALUES
(1, 'Emanuel', 'Villanueva', 'Garcia', 'emanuel.alumno@edutech.com', '5512345678', 'Av. Universidad 3000', 1, '04510');

INSERT INTO pago
(id_orden, id_proveedor_pago, id_estado_pago, id_pago_externo, monto_pagado, fecha_pago)
VALUES
(1, 1, 2, 'PAYPAL-DEMO-000001', 748.00, CURRENT_TIMESTAMP);

INSERT INTO webhook_pago
(id_pago, id_estado_webhook, tipo_evento, id_evento_externo, contenido_evento)
VALUES
(1, 2, 'PAYMENT.CAPTURE.COMPLETED', 'WH-DEMO-000001', '{"status":"COMPLETED","provider":"PayPal"}');

INSERT INTO inscripcion
(id_orden_detalle, id_estado_inscripcion)
VALUES
(1, 1),
(2, 1);


-- =========================================================
-- 6) INSERCIÓN DE PROGRESO, EXAMEN, RESPUESTAS Y CERTIFICADO
-- =========================================================

INSERT INTO progreso_leccion
(id_inscripcion, id_leccion, completada, fecha_completada)
VALUES
(1, 1, TRUE, CURRENT_TIMESTAMP),
(1, 2, FALSE, NULL);

INSERT INTO examen
(id_curso, id_estado_examen, titulo, descripcion, tiempo_limite_minutos, max_intentos, calificacion_minima, cantidad_preguntas)
VALUES
(1, 2, 'Examen final de Hackeo', 'Evaluación final del curso.', 30, 2, 70.00, 2);

INSERT INTO pregunta
(id_examen, texto_pregunta, esta_activa)
VALUES
(1, '¿Qué representa una vulnerabilidad?', TRUE),
(1, '¿Qué debe hacerse con las contraseñas?', TRUE);

INSERT INTO opcion_respuesta
(id_pregunta, texto_opcion, es_correcta)
VALUES
(1, 'Una debilidad que puede ser explotada', TRUE),
(1, 'Un diseño visual del sistema', FALSE),
(2, 'Guardarlas en texto plano', FALSE),
(2, 'Guardarlas como hash seguro', TRUE);

INSERT INTO intento_examen
(id_examen, id_inscripcion, id_estado_intento, numero_intento, fecha_fin, calificacion, aprobado)
VALUES
(1, 1, 2, 1, CURRENT_TIMESTAMP, 100.00, TRUE);

INSERT INTO pregunta_intento
(id_intento, id_pregunta, numero_orden)
VALUES
(1, 1, 1),
(1, 2, 2);

INSERT INTO respuesta_alumno
(id_intento, id_pregunta, id_opcion, es_correcta)
VALUES
(1, 1, 1, TRUE),
(1, 2, 4, TRUE);

INSERT INTO certificado
(id_inscripcion, codigo_certificado, url_certificado)
VALUES
(1, 'EDU-2026-000001', 'certificados/EDU-2026-000001.pdf');


-- =========================================================
-- 7) MENSAJE DE CONTACTO
-- =========================================================

INSERT INTO mensaje_contacto
(nombre, correo, asunto, mensaje)
VALUES
('Visitante Demo', 'visitante@correo.com', 'Duda sobre cursos', 'Quiero información sobre los cursos disponibles.');


-- =========================================================
-- FIN DE TRANSACCIÓN
-- =========================================================

COMMIT;


-- =========================================================
-- CONSULTAS DE VALIDACIÓN
-- =========================================================

SELECT * FROM vw_orden_resumen;
SELECT * FROM vw_inscripcion_detalle;
