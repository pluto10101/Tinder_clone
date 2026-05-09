@echo off
REM Tinder Clone 一键启动脚本 (Windows)
REM 同时启动 mock-server (3001) 和 web (5173)

echo.
echo ===================================
echo   Tinder Clone - M1
echo ===================================
echo.

REM 检查 node
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] 未检测到 Node.js，请先安装: https://nodejs.org
  pause
  exit /b 1
)

echo [1/4] 检查 mock-server 依赖...
if not exist "mock-server\node_modules" (
  echo       首次运行，安装后端依赖...
  cd mock-server
  call npm install
  cd ..
)

echo [2/4] 检查 web 依赖...
if not exist "web\node_modules" (
  echo       首次运行，安装前端依赖（可能需要几分钟）...
  cd web
  call npm install
  cd ..
)

echo [3/4] 检查 mock 数据...
if not exist "mock-server\db.json" (
  echo       初始化 Mock 数据...
  cd mock-server
  call npm run seed
  cd ..
)

echo [4/4] 启动服务...
echo.
echo   后端: http://localhost:3001
echo   前端: http://localhost:5173
echo.
echo   浏览器会自动打开 http://localhost:5173
echo   关闭此窗口或 Ctrl+C 即可停止服务
echo.

start "Tinder Mock Server" cmd /k "cd mock-server && npm start"
timeout /t 2 /nobreak >nul
start "Tinder Web" cmd /k "cd web && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo 已在独立窗口中启动两个服务。
pause
