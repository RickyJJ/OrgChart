@echo off
:: Set text encoding to UTF-8
CHCP 65001 > nul
setlocal

title 青云志 (Path to Court) - 开发服务总控 (Dev Control Center)

:: Use a stylish color (Aqua on Black)
color 0b

echo.
echo  ==============================================================
echo     青 云 志 - Path to Court (Dev Control Panel)
echo  ==============================================================
echo.
echo  [SYSTEM] 正在初始化多核并行开发环境...
echo.

:: 检查 backend 目录是否存在
if not exist "backend" (
    color 0c
    echo  [ERROR] 找不到 backend 目录！请确保在项目根目录运行此脚本。
    pause
    exit /b
)

:: 1. 启动后端 (Directus)
echo  [1/2] 部署后端驱动: Directus CMS (Port: 8055)...
echo       ^> 窗口名称: [QYZ-Backend]
start "QYZ-Backend" cmd /v:on /k "cd backend && echo [Directus] Starting... && npx directus start"

:: 等待 2 秒让日志稍微错开
timeout /t 2 /nobreak > nul

:: 2. 启动前端 (Vite)
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
echo  [TIP] 建议首次启动前执行 'npm install' 以确保依赖完整。
echo  --------------------------------------------------------------
echo.
echo  按任意键退出主控制窗（关联窗口将继续保持运行）。
pause > nul
