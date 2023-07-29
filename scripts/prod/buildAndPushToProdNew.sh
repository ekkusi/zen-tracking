#!/bin/bash

# Ensure we will be in root
parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"
cd "../../"

docker build --platform linux/amd64 -t ekkusi/zen-tracking:latest .
docker push ekkusi/zen-tracking:latest