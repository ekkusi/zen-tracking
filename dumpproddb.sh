#!/bin/bash

set -a # automatically export all variables
source .env
set +a

if [[ $1 == "" ]]; then
 echo "Provide path to dump file"
 exit 1
fi



export PGPASSWORD=$DB_PASSWORD

pg_dump $DATABASE_URL --file=$1 --verbose --clean --no-owner --schema-only --no-privileges --if-exists

# pg_dump --dbname=$DB_NAME --host=$DB_HOST --port=$DB_PORT --username=$DB_USER --file=$1 --verbose --clean --no-owner --schema-only --no-privileges --if-exists

echo "Done!"
exit 0