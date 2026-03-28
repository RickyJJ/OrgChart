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
echo  [SYSTEM] 正在初始化并行开发环境... (Initializing...)
echo.

:: 1. Backend
echo  [1/2] 部署后端驱动: Directus CMS (Port: 8055)...
echo       ^> 窗口名称: [QYZ-Backend]
start "QYZ-Backend" cmd /v:on /k "cd backend && echo [Directus] Starting... && npx directus start"

:: 2. Frontend
timeout /t 2 /nobreak > nul
echo  [2/2] 部署前端引擎: Vite + React (Port: 5173)...
echo       ^> 窗口名称: [QYZ-Frontend]
start "QYZ-Frontend" cmd /v:on /k "echo [Vite] Starting... && npm run dev"

echo.
echo  --------------------------------------------------------------
echo  [SUCCESS] 指令已全量下发。
echo.
echo  - 后端管理后台: http://127.0.0.1:8055/admin
echo  - 前端开发地址: http://localhost:5173
echo.
echo  按任意键关闭此窗口（关联窗口将继续启动）。
pause > nul
