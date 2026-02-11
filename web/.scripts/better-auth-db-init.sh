#!/bin/bash

docker exec -it dating-app_dev_web-container \
  npx @better-auth/cli@latest generate --yes --config src/lib/utils/auth.ts

docker exec -it dating-app_dev_web-container \
  npx @better-auth/cli@latest migrate --yes --config src/lib/utils/auth.ts
