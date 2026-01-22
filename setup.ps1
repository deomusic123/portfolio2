# Portfolio2 - Setup Check Script

Write-Host "Portfolio2 - Setup Inicial" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Check .env files
Write-Host "Verificando archivos de entorno..." -ForegroundColor Yellow

$webEnv = Test-Path "apps\web\.env.local"
$dashEnv = Test-Path "apps\dashboard\.env.local"

if ($webEnv) {
    Write-Host "[OK] apps/web/.env.local existe" -ForegroundColor Green
} else {
    Write-Host "[X] apps/web/.env.local NO existe" -ForegroundColor Red
}

if ($dashEnv) {
    Write-Host "[OK] apps/dashboard/.env.local existe" -ForegroundColor Green
} else {
    Write-Host "[X] apps/dashboard/.env.local NO existe" -ForegroundColor Red
}

Write-Host ""
Write-Host "ACCION REQUERIDA: Edita los archivos .env.local con tus credenciales Supabase" -ForegroundColor Yellow
Write-Host ""

# Check node_modules
Write-Host "Verificando dependencias..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "[OK] node_modules existe" -ForegroundColor Green
} else {
    Write-Host "[X] Ejecuta: npm install --legacy-peer-deps" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup Base de Datos (Supabase SQL Editor):" -ForegroundColor Yellow

if (Test-Path "docs\database\schema.sql") {
    Write-Host "[OK] 1. Ejecuta docs\database\schema.sql" -ForegroundColor Green
} else {
    Write-Host "[X] docs\database\schema.sql NO encontrado" -ForegroundColor Red
}

if (Test-Path "docs\database\seo_pages.sql") {
    Write-Host "[OK] 2. Ejecuta docs\database\seo_pages.sql" -ForegroundColor Green
} else {
    Write-Host "[X] docs\database\seo_pages.sql NO encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "Comandos disponibles:" -ForegroundColor Cyan
Write-Host "  npm run dev                # Ambas apps" -ForegroundColor White
Write-Host "  npm run dev:web            # Solo landing (puerto 3000)" -ForegroundColor White
Write-Host "  npm run dev:dashboard      # Solo dashboard (puerto 3001)" -ForegroundColor White

Write-Host ""
Write-Host "URLs despues de npm run dev:" -ForegroundColor Cyan
Write-Host "  Landing:      http://localhost:3000" -ForegroundColor White
Write-Host "  Dashboard:    http://localhost:3001" -ForegroundColor White
Write-Host "  Comparativas: http://localhost:3000/comparar" -ForegroundColor White

Write-Host ""
Write-Host "Documentacion:" -ForegroundColor Cyan
Write-Host "  - RESUMEN_FINAL.md" -ForegroundColor Yellow
Write-Host "  - docs/VALIDATION_GUIDE.md" -ForegroundColor Yellow

Write-Host ""
Write-Host "==========================" -ForegroundColor Cyan
Write-Host "Setup check completado" -ForegroundColor Green
