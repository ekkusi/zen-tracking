#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

set -a # automatically export all variables
source "../modules/backend/prisma/.env" # Take DATABASE_URL from prisma config
set +a

filePath="${1:-"zen_tracking_dump.sql"}"

pg_dump $DATABASE_URL --file=$filePath --verbose --clean --no-owner --schema-only --no-privileges --if-exists

# pg_dump --dbname=$DB_NAME --host=$DB_HOST --port=$DB_PORT --username=$DB_USER --file=$1 --verbose --clean --no-owner --schema-only --no-privileges --if-exists

echo "Done!"
exit 0