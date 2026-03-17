$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

Write-Host "[admin-system] installing dependencies..."
npm --prefix . install

Write-Host "[admin-system] starting backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$repoRoot'; npm --prefix admin-backend run dev"

Write-Host "[admin-system] starting frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$repoRoot'; npm --prefix admin-frontend run dev"

Write-Host "[admin-system] services launched:"
Write-Host "  frontend: http://localhost:3100"
Write-Host "  backend : http://localhost:3200/api/v1/health"
