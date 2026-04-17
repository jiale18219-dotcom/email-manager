#!/bin/zsh
set -e

PROJECT_DIR="/Users/yorickjue/Desktop/idea_project/kami-manager"
cd "$PROJECT_DIR"

PIDS="$(lsof -ti tcp:3001 || true)"

if [[ -n "$PIDS" ]]; then
  kill $PIDS
fi
