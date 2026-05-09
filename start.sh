#!/usr/bin/env bash
# Tinder Clone 一键启动脚本 (macOS / Linux / Git Bash)

set -e

echo ""
echo "==================================="
echo "  Tinder Clone - M1"
echo "==================================="
echo ""

# 检查 node
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] 未检测到 Node.js，请先安装: https://nodejs.org"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[1/4] 检查 mock-server 依赖..."
if [ ! -d "mock-server/node_modules" ]; then
  echo "      首次运行，安装后端依赖..."
  (cd mock-server && npm install)
fi

echo "[2/4] 检查 web 依赖..."
if [ ! -d "web/node_modules" ]; then
  echo "      首次运行，安装前端依赖（可能需要几分钟）..."
  (cd web && npm install)
fi

echo "[3/4] 检查 mock 数据..."
if [ ! -f "mock-server/db.json" ]; then
  echo "      初始化 Mock 数据..."
  (cd mock-server && npm run seed)
fi

echo "[4/4] 启动服务..."
echo ""
echo "  后端: http://localhost:3001"
echo "  前端: http://localhost:5173"
echo ""
echo "  按 Ctrl+C 停止所有服务"
echo ""

# 后台启动后端
(cd mock-server && npm start) &
BACK_PID=$!

# 前台启动前端
(cd web && npm run dev) &
FRONT_PID=$!

cleanup() {
  echo ""
  echo "正在停止服务..."
  kill $BACK_PID $FRONT_PID 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

wait
