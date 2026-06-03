-- =========================================================
-- DCL EDUTECH
-- =========================================================

-- =========================================================
-- 0) CREAR USUARIOS CON LOGIN
-- =========================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'usr_admin_edutech') THEN
    CREATE ROLE usr_admin_edutech LOGIN PASSWORD 'Admin_EduTech_1596#';
  ELSE
    ALTER ROLE usr_admin_edutech WITH LOGIN PASSWORD 'Admin_EduTech_1596#';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'usr_dev_edutech') THEN
    CREATE ROLE usr_dev_edutech LOGIN PASSWORD 'Dev_EduTech_1596#';
  ELSE
    ALTER ROLE usr_dev_edutech WITH LOGIN PASSWORD 'Dev_EduTech_1596#';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'usr_ro_edutech') THEN
    CREATE ROLE usr_ro_edutech LOGIN PASSWORD 'Read_EduTech_1596#';
  ELSE
    ALTER ROLE usr_ro_edutech WITH LOGIN PASSWORD 'Read_EduTech_1596#';
  END IF;
END
$$;


REVOKE ALL ON DATABASE bd_edutech FROM PUBLIC;

GRANT ALL PRIVILEGES ON DATABASE bd_edutech TO usr_admin_edutech;
GRANT CONNECT, TEMPORARY ON DATABASE bd_edutech TO usr_dev_edutech;
GRANT CONNECT ON DATABASE bd_edutech TO usr_ro_edutech;


REVOKE ALL ON SCHEMA edutech FROM PUBLIC;

GRANT USAGE, CREATE ON SCHEMA edutech TO usr_admin_edutech;
GRANT USAGE, CREATE ON SCHEMA edutech TO usr_dev_edutech;
GRANT USAGE ON SCHEMA edutech TO usr_ro_edutech;


-- =========================================================
-- 3) PRIVILEGIOS SOBRE OBJETOS EXISTENTES
-- =========================================================

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA edutech TO usr_admin_edutech;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA edutech TO usr_dev_edutech;
GRANT SELECT ON ALL TABLES IN SCHEMA edutech TO usr_ro_edutech;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA edutech TO usr_admin_edutech;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA edutech TO usr_dev_edutech;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA edutech TO usr_ro_edutech;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA edutech TO usr_admin_edutech;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA edutech TO usr_dev_edutech;


-- =========================================================
-- 4) PRIVILEGIOS POR DEFECTO PARA OBJETOS FUTUROS
-- =========================================================

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT ALL PRIVILEGES ON TABLES TO usr_admin_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO usr_dev_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT SELECT ON TABLES TO usr_ro_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT ALL PRIVILEGES ON SEQUENCES TO usr_admin_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO usr_dev_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT USAGE, SELECT ON SEQUENCES TO usr_ro_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT EXECUTE ON FUNCTIONS TO usr_admin_edutech;

ALTER DEFAULT PRIVILEGES IN SCHEMA edutech
GRANT EXECUTE ON FUNCTIONS TO usr_dev_edutech;


-- =========================================================
-- 5) VALIDACIÓN DE ROLES
-- =========================================================

SELECT rolname
FROM pg_roles
WHERE rolname IN ('usr_admin_edutech', 'usr_dev_edutech', 'usr_ro_edutech')
ORDER BY rolname;


-- =========================================================
-- FIN DEL SCRIPT DCL
-- =========================================================
