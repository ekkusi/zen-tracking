#!/bin/bash

callPath=$(pwd)
parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"

set -a # automatically export all variables
source "../modules/backend/prisma/.env" # Take vars from prisma config
set +a

databaseUrl=$DATABASE_URL_PROD # Defaults to modules/backend/prisma/.env DATABASE_URL_PROD variable

while getopts ":d:f:b" opt; do
  case $opt in
    d)
      echo "-d was triggered, changing db url to: $OPTARG" >&2
      databaseUrl=$OPTARG
      ;;
    f)
      echo "-f was triggered, adding relativePath to '$OPTARG'">&2
      relativeFilePath=$OPTARG
      ;;
    b)
      echo "-b was triggered, putting dump to backups">&2
      backupFileName="$(date +"%m-%d-%YT%T").sql"
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


absoluteFilePath="$(cd ../db; pwd)/zen_tracking_dump.sql"
if [ -n "${relativeFilePath}" ]; then absoluteFilePath="$callPath/$relativeFilePath"; fi
if [ -n "${backupFileName}" ]; then absoluteFilePath="$(cd ../db/prod-backups; pwd)/$backupFileName"; fi


echo
echo -e "Dumping db from: $databaseUrl:"
echo -e "Dumping db to: $absoluteFilePath \n"

pg_dump $databaseUrl --file=$absoluteFilePath --verbose --clean --no-owner --no-privileges --if-exists

echo "Done!"
exit 0