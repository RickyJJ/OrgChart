@echo off
:: Set text encoding to UTF-8
chcp 65001 > nul
setlocal

title QingYunZhi Stop

echo.
echo =========================================================
echo    正在停止服务 (Stopping services)...
echo =========================================================
echo.

:: 停止 5173 (Vite)
echo [1/2] 正在释放端口 5173 (Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /f /pid %%a >nul 2>&1
    echo ^> 已成功停止 5173。
)

:: 停止 8055 (Directus)
echo [2/2] 正在释放端口 8055 (Directus)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8055 ^| findstr LISTENING') do (
    taskkill /f /pid %%a >nul 2>&1
    echo ^> 已成功停止 8055。
)

echo.
echo [DONE] 服务已清理。
echo =========================================================
echo 按任意键关闭此窗口。 (Press any key to close)
pause > nul
