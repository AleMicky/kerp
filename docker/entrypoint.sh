#!/bin/bash
set -e

PROJECT_DIR="/var/www/html/kerp"
cd "$PROJECT_DIR"

# 1. Configurar archivo .pgpass para restaurar_todo.py y conexiones de postgres
echo "${DB_HOST:-db}:${DB_PORT:-5432}:*:${DB_USER:-dbkerp_conexion}:${DB_PASS:-dbkerp_conexion}" > /root/.pgpass
echo "${DB_HOST:-db}:${DB_PORT:-5432}:*:postgres:${POSTGRES_PASSWORD:-postgres_password}" >> /root/.pgpass
chmod 0600 /root/.pgpass

# 2. Crear enlaces simbólicos necesarios de PXP
ln -sfn pxp/lib lib
ln -sfn pxp/index.php index.php
ln -sfn pxp/sis_generador sis_generador
ln -sfn pxp/sis_organigrama sis_organigrama
ln -sfn pxp/sis_parametros sis_parametros
ln -sfn pxp/sis_seguridad sis_seguridad
ln -sfn pxp/sis_workflow sis_workflow

# 3. Directorios de trabajo y archivos requeridos
mkdir -p reportes_generados uploaded_files
touch sistemas.txt
chown -R www-data:www-data reportes_generados uploaded_files
chmod 775 reportes_generados uploaded_files

# Registrar sistemas adicionales en sistemas.txt si no están registrados
for dir in sis_*; do
    if [ -d "$dir" ] && [ ! -L "$dir" ]; then
        if ! grep -q "^../../../$dir/" sistemas.txt 2>/dev/null; then
            echo "../../../$dir/" >> sistemas.txt
            echo "Registrado sistema adicional en sistemas.txt: ../../../$dir/"
        fi
    fi
done

# 4. Crear o configurar DatosGenerales.php
if [ ! -f pxp/lib/DatosGenerales.php ]; then
    echo "Generando pxp/lib/DatosGenerales.php a partir de DatosGenerales.sample.php..."
    cp pxp/lib/DatosGenerales.sample.php pxp/lib/DatosGenerales.php
fi

# Ajustar variables esenciales en DatosGenerales.php
sed -i "s/\$_SESSION\[\"_HOST\"\]\s*=\s*.*/\$_SESSION\[\"_HOST\"\] = \"${DB_HOST:-db}\";/" pxp/lib/DatosGenerales.php
sed -i "s/\$_SESSION\[\"_PUERTO\"\]\s*=\s*.*/\$_SESSION\[\"_PUERTO\"\] = \"${DB_PORT:-5432}\";/" pxp/lib/DatosGenerales.php
sed -i "s/\$_SESSION\[\"_BASE_DATOS\"\]\s*=\s*.*/\$_SESSION\[\"_BASE_DATOS\"\] = \"${DB_NAME:-dbkerp}\";/" pxp/lib/DatosGenerales.php
sed -i "s/\$_SESSION\[\"_USUARIO_CONEXION\"\]\s*=\s*.*/\$_SESSION\[\"_USUARIO_CONEXION\"\] = \"conexion\";/" pxp/lib/DatosGenerales.php
sed -i "s/\$_SESSION\[\"_CONTRASENA_CONEXION\"\]\s*=\s*.*/\$_SESSION\[\"_CONTRASENA_CONEXION\"\] = \"${DB_PASS:-dbkerp_conexion}\";/" pxp/lib/DatosGenerales.php
sed -i "s/\$_SESSION\[\"_FOLDER\"\]\s*=\s*.*/\$_SESSION\[\"_FOLDER\"\] = \"\/kerp\/\";/" pxp/lib/DatosGenerales.php

exec "$@"
