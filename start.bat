@echo off
title LetGoo Launcher
echo ========================================================
echo   KHOI DONG HE THONG LETGOO (React Frontend + Java Backend)
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080/swagger-ui.html
echo ========================================================

start "LetGoo Backend" cmd /c "cd /d %~dp0backend && call run.bat"
start "LetGoo Frontend" cmd /c "cd /d %~dp0fe && npm run dev"
