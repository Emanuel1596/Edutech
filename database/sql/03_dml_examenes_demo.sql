-- Paso 15 - Exámenes demo para cursos que no tenían examen activo.
-- Este archivo es opcional. Hackeo ya trae examen en 02_dml_edutech.sql.
-- Ejecutar desde la raíz con:
-- docker compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d bd_edutech < database/sql/03_dml_examenes_demo.sql

DO $$
DECLARE
  v_estado_activo INT;
  v_id_examen INT;
BEGIN
  SELECT id_estado_examen
  INTO v_estado_activo
  FROM edutech.estado_examen
  WHERE nombre_estado_examen = 'activo'
  LIMIT 1;

  IF v_estado_activo IS NULL THEN
    RAISE EXCEPTION 'No existe el estado de examen activo.';
  END IF;

  IF EXISTS (SELECT 1 FROM edutech.curso WHERE id_curso = 2)
     AND NOT EXISTS (SELECT 1 FROM edutech.examen WHERE id_curso = 2) THEN
    INSERT INTO edutech.examen
      (id_curso, id_estado_examen, titulo, descripcion, tiempo_limite_minutos, max_intentos, calificacion_minima, cantidad_preguntas)
    VALUES
      (2, v_estado_activo, 'Examen final de Bases de datos', 'Evaluación final del curso.', 30, 2, 70.00, 2)
    RETURNING id_examen INTO v_id_examen;

    INSERT INTO edutech.pregunta (id_examen, texto_pregunta, esta_activa) VALUES
      (v_id_examen, '¿Qué es una base de datos?', TRUE),
      (v_id_examen, '¿Para qué sirve una llave primaria?', TRUE);

    INSERT INTO edutech.opcion_respuesta (id_pregunta, texto_opcion, es_correcta)
    SELECT p.id_pregunta, opcion.texto, opcion.correcta
    FROM edutech.pregunta p
    CROSS JOIN LATERAL (
      VALUES
        ('Un conjunto organizado de datos', TRUE),
        ('Una imagen decorativa del sistema', FALSE)
    ) AS opcion(texto, correcta)
    WHERE p.id_examen = v_id_examen
      AND p.texto_pregunta = '¿Qué es una base de datos?';

    INSERT INTO edutech.opcion_respuesta (id_pregunta, texto_opcion, es_correcta)
    SELECT p.id_pregunta, opcion.texto, opcion.correcta
    FROM edutech.pregunta p
    CROSS JOIN LATERAL (
      VALUES
        ('Identificar de forma única un registro', TRUE),
        ('Cambiar el color de una tabla', FALSE)
    ) AS opcion(texto, correcta)
    WHERE p.id_examen = v_id_examen
      AND p.texto_pregunta = '¿Para qué sirve una llave primaria?';
  END IF;

  IF EXISTS (SELECT 1 FROM edutech.curso WHERE id_curso = 3)
     AND NOT EXISTS (SELECT 1 FROM edutech.examen WHERE id_curso = 3) THEN
    INSERT INTO edutech.examen
      (id_curso, id_estado_examen, titulo, descripcion, tiempo_limite_minutos, max_intentos, calificacion_minima, cantidad_preguntas)
    VALUES
      (3, v_estado_activo, 'Examen final de Desarrollo Web', 'Evaluación final del curso.', 30, 2, 70.00, 2)
    RETURNING id_examen INTO v_id_examen;

    INSERT INTO edutech.pregunta (id_examen, texto_pregunta, esta_activa) VALUES
      (v_id_examen, '¿Para qué sirve HTML?', TRUE),
      (v_id_examen, '¿Para qué sirve CSS?', TRUE);

    INSERT INTO edutech.opcion_respuesta (id_pregunta, texto_opcion, es_correcta)
    SELECT p.id_pregunta, opcion.texto, opcion.correcta
    FROM edutech.pregunta p
    CROSS JOIN LATERAL (
      VALUES
        ('Definir la estructura de una página web', TRUE),
        ('Guardar contraseñas del servidor', FALSE)
    ) AS opcion(texto, correcta)
    WHERE p.id_examen = v_id_examen
      AND p.texto_pregunta = '¿Para qué sirve HTML?';

    INSERT INTO edutech.opcion_respuesta (id_pregunta, texto_opcion, es_correcta)
    SELECT p.id_pregunta, opcion.texto, opcion.correcta
    FROM edutech.pregunta p
    CROSS JOIN LATERAL (
      VALUES
        ('Dar estilo visual a la página web', TRUE),
        ('Crear directamente la base de datos', FALSE)
    ) AS opcion(texto, correcta)
    WHERE p.id_examen = v_id_examen
      AND p.texto_pregunta = '¿Para qué sirve CSS?';
  END IF;
END $$;
