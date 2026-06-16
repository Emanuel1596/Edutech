-- Paso 16 - Certificados para intentos aprobados ya existentes.
-- Este archivo es opcional. El backend también genera certificados automáticamente.
-- Ejecutar desde la raíz:
-- docker compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d bd_edutech < database/sql/04_dml_certificados_aprobados.sql

INSERT INTO edutech.certificado
  (id_inscripcion, codigo_certificado, url_certificado)
SELECT DISTINCT
  ie.id_inscripcion,
  LEFT('EDU-' || EXTRACT(YEAR FROM CURRENT_DATE)::int || '-' || LPAD(ie.id_inscripcion::text, 6, '0'), 20)::char(20) AS codigo_certificado,
  'certificado.html?codigo=' || LEFT('EDU-' || EXTRACT(YEAR FROM CURRENT_DATE)::int || '-' || LPAD(ie.id_inscripcion::text, 6, '0'), 20) AS url_certificado
FROM edutech.intento_examen ie
WHERE ie.aprobado = TRUE
ON CONFLICT (id_inscripcion) DO NOTHING;
