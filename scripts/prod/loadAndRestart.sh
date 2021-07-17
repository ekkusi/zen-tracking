#!/bin/bash

# Ensure we will be in root
parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"
cd "../../"

docker load < ./tmp/zen-tracking.tar.gz
docker image prune
docker-compose -f docker-compose.prod.yml up -d