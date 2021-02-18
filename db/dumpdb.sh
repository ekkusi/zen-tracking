#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

set -a # automatically export all variables
source "../modules/backend/prisma/.env" # Take vars from prisma config
set +a

databaseUrl=$DATABASE_URL_PROD # Defaults to modules/backend/prisma/.env DATABASE_URL_PROD variable
filePath="zen_tracking_dump.sql"

while getopts ":d:f:" opt; do
  case $opt in
    d)
      echo "-d was triggered, chaging db url to: $OPTARG" >&2
      databaseUrl=$OPTARG
      ;;
    f)
      echo "-f was triggered, changing file path to: $OPTARG" >&2
      filePath=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

echo
echo -e "Dumping db from: $databaseUrl:"
echo -e "Dumping db to: $filePath \n"

pg_dump $databaseUrl --file=$filePath --verbose --clean --no-owner --schema-only --no-privileges --if-exists

echo "Done!"
exit 0