#!/bin/bash

parentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parentPath"
cd "../../"

./scripts/importdb.sh -f db/update_version.sql 