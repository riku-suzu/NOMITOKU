#!/bin/sh
# ローカル開発サーバーをまとめて起動する（API: 8000 / フロント: 3001）
# 初回のみ: uv venv --python 3.11 .venv && uv pip install --python .venv -r requirements.txt
cd "$(dirname "$0")"

.venv/bin/uvicorn api.main:app --reload --env-file .env --port 8000 &
API_PID=$!
trap 'kill $API_PID 2>/dev/null' EXIT INT TERM

npm --prefix frontend-react run dev
