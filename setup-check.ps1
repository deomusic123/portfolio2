# Script de Configuración Inicial - Portfolio2 Monorepo

Write-Host "🚀 Portfolio2 - Setup Inicial" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Verificar archivos .env.local
Write-Host "📋 Verificando archivos de entorno..." -ForegroundColor Yellow

$webEnvExists = Test-Path "apps\web\.env.local"
$dashboardEnvExists = Test-Path "apps\dashboard\.env.local"

if ($webEnvExists) {
    Write-Host "✅ apps/web/.env.local existe" -ForegroundColor Green
} else {
    Write-Host "❌ apps/web/.env.local NO existe" -ForegroundColor Red
    if (Test-Path "apps\web\.env.example") {
        Copy-Item "apps\web\.env.example" "apps\web\.env.local"
        Write-Host "   → Creado desde .env.example" -ForegroundColor Yellow
    }
}

if ($dashboardEnvExists) {
    Write-Host "✅ apps/dashboard/.env.local existe" -ForegroundColor Green
} else {
    Write-Host "❌ apps/dashboard/.env.local NO existe" -ForegroundColor Red
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" "apps\dashboard\.env.local"
        Write-Host "   → Creado desde .env.local.example" -ForegroundColor Yellow
    }
}

Write-Host "`n📝 SIGUIENTE PASO: Configurar credenciales de Supabase`n" -ForegroundColor Cyan

Write-Host "Edita los siguientes archivos con tus credenciales:" -ForegroundColor White
Write-Host "  1. apps\web\.env.local" -ForegroundColor Yellow
Write-Host "  2. apps\dashboard\.env.local`n" -ForegroundColor Yellow

Write-Host "Necesitas obtener de Supabase (https://app.supabase.com):" -ForegroundColor White
Write-Host "  • NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Cyan
Write-Host "  • NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Cyan
Write-Host "  • SUPABASE_SERVICE_ROLE_KEY (solo dashboard)`n" -ForegroundColor Cyan

# Verificar node_modules
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules NO existe" -ForegroundColor Red
    Write-Host "   Ejecuta: npm install --legacy-peer-deps`n" -ForegroundColor Yellow
}

# SQL Scripts
Write-Host "🗄️  Setup Base de Datos (Supabase)" -ForegroundColor Yellow
Write-Host "Ejecuta estos scripts SQL en Supabase (SQL Editor):`n" -ForegroundColor White

if (Test-Path "docs\database\schema.sql") {
    Write-Host "  1. docs\database\schema.sql" -ForegroundColor Green
    Write-Host "     (Tablas principales: users, leads, projects, etc.)`n" -ForegroundColor Gray
} else {
    Write-Host "  ⚠️  docs\database\schema.sql NO encontrado`n" -ForegroundColor Red
}

if (Test-Path "docs\database\seo_pages.sql") {
    Write-Host "  2. docs\database\seo_pages.sql" -ForegroundColor Green
    Write-Host "     (Tabla SEO + 3 comparativas de ejemplo)`n" -ForegroundColor Gray
} else {
    Write-Host "  ⚠️  docs\database\seo_pages.sql NO encontrado`n" -ForegroundColor Red
}

# Resumen de comandos
Write-Host "🎯 Comandos disponibles después del setup:`n" -ForegroundColor Cyan

Write-Host "  npm run dev                # Ambas apps" -ForegroundColor White
Write-Host "  npm run dev:web            # Solo landing (puerto 3000)" -ForegroundColor White
Write-Host "  npm run dev:dashboard      # Solo dashboard (puerto 3001)" -ForegroundColor White
Write-Host "  npm run build              # Build todas las apps" -ForegroundColor White
Write-Host "  npm run type-check         # TypeScript check`n" -ForegroundColor White

Write-Host "📚 URLs una vez iniciado:" -ForegroundColor Cyan
Write-Host "  • Landing:      http://localhost:3000" -ForegroundColor White
Write-Host "  • Dashboard:    http://localhost:3001" -ForegroundColor White
Write-Host "  • Comparativas: http://localhost:3000/comparar" -ForegroundColor White
Write-Host "  • Sitemap:      http://localhost:3000/sitemap.xml`n" -ForegroundColor White

Write-Host "Guias de ayuda:" -ForegroundColor Cyan
Write-Host "  - RESUMEN_FINAL.md" -ForegroundColor Yellow
Write-Host "  - docs/VALIDATION_GUIDE.md" -ForegroundColor Yellow
Write-Host "  - docs/IMPLEMENTATION_PLAN_COMPLETED.md" -ForegroundColor Yellow
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup inicial completado" -ForegroundColor Green
Write-Host "Configura las variables de entorno y ejecuta npm run dev" -ForegroundColor Green
