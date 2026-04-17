#!/bin/zsh
set -e

PROJECT_DIR="/Users/yorickjue/Desktop/idea_project/kami-manager"
cd "$PROJECT_DIR"

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"

PIDS="$(lsof -ti tcp:3001 || true)"

if [[ -n "$PIDS" ]]; then
  kill $PIDS
  sleep 1
fi

npm run build

nohup env HOST=0.0.0.0 NODE_ENV=production node server/index.js > .kami-manager.log 2>&1 &
sleep 2

if [[ -n "$LAN_IP" ]]; then
  echo "LAN URL: http://$LAN_IP:3001" >> .kami-manager.log
fi

open http://127.0.0.1:3001/
