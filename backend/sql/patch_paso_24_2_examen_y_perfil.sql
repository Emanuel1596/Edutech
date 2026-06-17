BEGIN;

ALTER TABLE edutech.examen DROP CONSTRAINT IF EXISTS ck_examen_tiempo;
ALTER TABLE edutech.examen DROP CONSTRAINT IF EXISTS ck_examen_max_intentos;

UPDATE edutech.examen
SET tiempo_limite_minutos = 10
WHERE tiempo_limite_minutos < 10;

UPDATE edutech.examen
SET tiempo_limite_minutos = 180
WHERE tiempo_limite_minutos > 180;

UPDATE edutech.examen
SET max_intentos = 0
WHERE max_intentos < 0;

ALTER TABLE edutech.examen
  ADD CONSTRAINT ck_examen_tiempo
  CHECK (tiempo_limite_minutos >= 10 AND tiempo_limite_minutos <= 180);

ALTER TABLE edutech.examen
  ADD CONSTRAINT ck_examen_max_intentos
  CHECK (max_intentos >= 0);

COMMIT;
