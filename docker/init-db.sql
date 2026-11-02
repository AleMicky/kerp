-- Inicialización de usuarios y base de datos para PXP / KERP
CREATE USER dbkerp_conexion WITH PASSWORD 'dbkerp_conexion' SUPERUSER;
CREATE USER dbkerp_dbkerp_conexion WITH PASSWORD 'dbkerp_conexion' SUPERUSER;
CREATE USER dbkerp_admin WITH PASSWORD 'a1a69c4e834c5aa6cce8c6eceee84295' SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE dbkerp TO dbkerp_conexion;
GRANT ALL PRIVILEGES ON DATABASE dbkerp TO dbkerp_dbkerp_conexion;
GRANT ALL PRIVILEGES ON DATABASE dbkerp TO dbkerp_admin;
