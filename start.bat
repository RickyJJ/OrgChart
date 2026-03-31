@echo off
:: Set text encoding to UTF-8
chcp 65001 > nul
setlocal

title QingYunZhi Start

echo.
echo  ==============================================================
echo     青 云 志 - Path to Court (Dev Control Panel)
echo  ==============================================================
echo.
echo  [SYSTEM] 全静态化模式 - 仅启动前端 (Static Mode - Frontend Only)
echo.

:: Frontend only (Directus/PostgreSQL 已砍掉)
echo  [1/1] 部署前端引擎: Vite + React (Port: 5173)...
echo       ^> 窗口名称: [QYZ-Frontend]
start "QYZ-Frontend" cmd /v:on /k "echo [Vite] Starting... && npm run dev"

echo.
echo  --------------------------------------------------------------
echo  [SUCCESS] 前端服务已启动。
echo.
echo  - 前端开发地址: http://localhost:5173
echo.
echo  [NOTE] 如需恢复后端服务，请运行: npm run start:full
echo.
echo  按任意键关闭此窗口。
pause > nul
