#!/bin/bash

parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"

docker-compose -f ../../docker-compose.prod.yml up -d --no-deps --build zen-tracking

