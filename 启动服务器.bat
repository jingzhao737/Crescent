@echo off
chcp 65001 >nul
title Portfolio 服务器
echo ================================
echo   Portfolio 本地服务器
echo ================================
echo.
echo 正在启动... 稍后会自动打开浏览器
echo.
echo 关闭此窗口即可停止服务器
echo ================================
echo.

cd /d "%~dp0"
npx --yes serve -l 3456 --no-clipboard
