#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

set -a # automatically export all variables
source "../modules/backend/prisma/.env" # Take DATABASE_URL from prisma config
set +a

filePath="${1:-"zen_tracking_dump.sql"}"

echo -e "Restoring database from $filePath \n\n"

psql $DATABASE_URL --file=$filePath --echo-all --echo-errors
echo "done"
exit 0