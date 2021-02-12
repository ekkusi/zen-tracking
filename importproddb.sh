#!/bin/bash

set -a # automatically export all variables
source .env
set +a

if [[ $1 == "" ]]; then
 echo "provide path to dump file"
 exit 1
fi

echo -e "Restoring database from $1 \n\n"

psql $DATABASE_URL --file=$1 --echo-all --echo-errors
echo "done"
exit 0