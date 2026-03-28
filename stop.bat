@echo off
:: Set text encoding to UTF-8
CHCP 65001 > nul
setlocal enabledelayedexpansion

title 青云志 (Path to Court) - 停止服务 (Service Stopper)
color 0e

echo.
echo  ==============================================================
echo     正在安全停止开发环境服务...
echo  ==============================================================
echo.

:: 辅助函数：根据端口杀进程
set PORTS=5173 8055
for %%P in (%PORTS%) do (
    echo  [SEARCH] 正在检测端口 %%P...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%P ^| findstr LISTENING') do (
        echo   ^> 发现进程 PID: %%a (Port: %%P)
        taskkill /f /pid %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   ^> [SUCCESS] 已强制终止服务。
        ) else (
            echo   ^> [INFO] 服务可能已处于停止状态。
        )
    )
)

echo.
echo  --------------------------------------------------------------
echo  [DONE] 清理完成！端口 5173 (Vite) 和 8055 (Directus) 已释放。
echo  --------------------------------------------------------------
echo.
echo  按任意键关闭此窗口。
pause > nul
