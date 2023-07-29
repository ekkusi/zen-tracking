#!/bin/bash

# Ensure we will be in root
parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"
cd "../../"

git pull
docker pull ekkusi/zen-tracking
docker stop zen-tracking || true && docker rm zen-tracking || true
docker run --env-file .env -d --name zen-tracking -p 4000:4000 ekkusi/zen-tracking
docker rmi $(docker images -f "dangling=true" -q --no-trunc)
echo "New container running and old ones removed successfully!"