#!/usr/bin/env bash
# Start the full DiseaseWatch v2 production stack (Docker)
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

docker compose up --build "$@"
