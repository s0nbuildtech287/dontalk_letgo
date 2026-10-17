Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  KHOI DONG LETGOO JAVA BACKEND (Spring Boot + Postgres)" -ForegroundColor Yellow
Write-Host "  API Docs: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Yellow

$env:JAVA_HOME = "C:\Users\XUAN SON\.jdks\corretto-18.0.2"
& ".\gradlew.bat" bootRun
