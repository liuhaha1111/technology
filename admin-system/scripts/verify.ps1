$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

Write-Host "[verify] backend tests"
npm --prefix admin-backend test

Write-Host "[verify] frontend tests"
npm --prefix admin-frontend test

Write-Host "[verify] backend build"
npm --prefix admin-backend run build

Write-Host "[verify] frontend build"
npm --prefix admin-frontend run build

Write-Host "[verify] completed"
