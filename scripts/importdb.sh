#!/bin/bash

callPath=$(pwd)
scriptPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$scriptPath"

set -a # automatically export all variables
source "../modules/backend/.env" # Take vars from prisma config
set +a

databaseUrl=$DATABASE_URL # Defaults to modules/backend/prisma/.env DATABASE_URL variable

while getopts ":d:f:" opt; do
  case $opt in
    d)
      echo "-d was triggered, chaging db url to: $OPTARG" >&2
      databaseUrl=$OPTARG
      ;;
    f)
      echo "-f was triggered, adding relativePath to '$OPTARG'">&2
      relativeFilePath=$OPTARG
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

absoluteFilePath="$(cd ../db; pwd)/schema.sql"
if [ -n "${relativeFilePath}" ]; then absoluteFilePath="$callPath/$relativeFilePath"; else echo "relativeFilePath is not set"; fi

echo -e "Importing database from $absoluteFilePath"
echo -e "Importing to: $databaseUrl: \n\n"

psql $databaseUrl --file=$absoluteFilePath --echo-all --echo-errors
echo "done"
exit 0