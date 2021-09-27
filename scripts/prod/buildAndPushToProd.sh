#!/bin/bash

# Ensure we will be in root
parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"
cd "../../"

docker build -t zen-tracking .
docker save zen-tracking | gzip > ./tmp/zen-tracking.tar.gz
scp ./tmp/zen-tracking.tar.gz eke@199.247.31.107:~/zen-tracking/tmp/ 

cat scripts/prod/loadAndRestart.sh |ssh eke@199.247.31.107 /bin/bash