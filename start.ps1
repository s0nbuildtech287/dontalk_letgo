Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  KHOI DONG HE THONG LETGOO (React Frontend + Java Backend)" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; .\run.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\fe'; npm run dev"
