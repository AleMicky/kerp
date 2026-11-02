#!/bin/bash
# Script para inicializar/restaurar la base de datos PXP en Docker
set -e

if [ "$1" == "--manual" ]; then
    echo "=========================================================="
    echo " Modo MANUAL: responda las preguntas de la siguiente forma:"
    echo "   1) Ingrese una opcion: 1"
    echo "   2) Ingrese el nombre de usuario: dbkerp_conexion"
    echo "   3) Ingrese el nombre de la BD para ELIMINARLA: dbkerp"
    echo "   4) Desea obtener un backup: NO"
    echo "   5) Desea restaurar los datos de prueba: n"
    echo "=========================================================="
    docker compose exec -it web python3 pxp/utilidades/restaurar_bd/restaurar_todo_v3.py
else
    echo "=========================================================="
    echo " Restaurando Base de Datos 'dbkerp' automáticamente (Python 3)...   "
    echo " (Si prefieres el modo interactivo ejecuta: ./iniciar_bd.sh --manual)"
    echo "=========================================================="
    docker compose exec -i web bash -c "printf '1\ndbkerp_conexion\ndbkerp\nNO\nn\n' | python3 pxp/utilidades/restaurar_bd/restaurar_todo_v3.py"
fi
