@echo off
title LetGoo Backend Server
echo ========================================================
echo   KHOI DONG LETGOO JAVA BACKEND (Spring Boot + Postgres)
echo   API Docs: http://localhost:8080/swagger-ui.html
echo ========================================================
set "JAVA_HOME=C:\Users\XUAN SON\.jdks\corretto-18.0.2"
call gradlew.bat bootRun
pause
