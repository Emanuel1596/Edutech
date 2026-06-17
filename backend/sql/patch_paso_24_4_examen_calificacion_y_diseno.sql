BEGIN;

ALTER TABLE edutech.examen DROP CONSTRAINT IF EXISTS ck_examen_calificacion;

UPDATE edutech.examen
SET calificacion_minima = 60
WHERE calificacion_minima < 60;

UPDATE edutech.examen
SET calificacion_minima = 100
WHERE calificacion_minima > 100;

ALTER TABLE edutech.examen
  ADD CONSTRAINT ck_examen_calificacion
  CHECK (calificacion_minima >= 60 AND calificacion_minima <= 100);

COMMIT;
