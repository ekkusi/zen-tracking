#!/bin/bash

parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"

docker build .. --tag zen-tracking
docker-compose -f docker-compose.prod.yml restart -d zen-tracking
