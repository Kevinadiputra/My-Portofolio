# Script untuk menambahkan Environment Variables ke Vercel
# Jalankan: .\add-env-to-vercel.ps1

Write-Host "=== Vercel Environment Variables Setup ===" -ForegroundColor Cyan
Write-Host ""

# Cek apakah .env.local ada
if (-Not (Test-Path ".env.local")) {
    Write-Host "Error: File .env.local tidak ditemukan!" -ForegroundColor Red
    Write-Host "Pastikan Anda sudah membuat file .env.local dengan Supabase credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ File .env.local ditemukan" -ForegroundColor Green
Write-Host ""

# Baca .env.local
$envContent = Get-Content .env.local
$supabaseUrl = ""
$supabaseKey = ""

foreach ($line in $envContent) {
    if ($line -match "^NEXT_PUBLIC_SUPABASE_URL=(.+)$") {
        $supabaseUrl = $matches[1]
    }
    if ($line -match "^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)$") {
        $supabaseKey = $matches[1]
    }
}

# Validasi
if ($supabaseUrl -eq "" -or $supabaseKey -eq "") {
    Write-Host "Error: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY tidak ditemukan di .env.local" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pastikan .env.local Anda memiliki:" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_SUPABASE_URL=your_url" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" -ForegroundColor Yellow
    exit 1
}

Write-Host "Ditemukan environment variables:" -ForegroundColor Green
Write-Host "- NEXT_PUBLIC_SUPABASE_URL: $($supabaseUrl.Substring(0, [Math]::Min(40, $supabaseUrl.Length)))..." -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_SUPABASE_ANON_KEY: $($supabaseKey.Substring(0, [Math]::Min(40, $supabaseKey.Length)))..." -ForegroundColor Gray
Write-Host ""

# Konfirmasi
Write-Host "Apakah Anda ingin menambahkan environment variables ini ke Vercel?" -ForegroundColor Yellow
Write-Host "Ketik 'yes' untuk melanjutkan atau 'no' untuk membatalkan: " -NoNewline
$confirm = Read-Host

if ($confirm -ne "yes") {
    Write-Host "Dibatalkan." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=== Menambahkan Environment Variables ke Vercel ===" -ForegroundColor Cyan
Write-Host ""

# Tambahkan ke Production
Write-Host "Adding to Production..." -ForegroundColor Yellow
Write-Host $supabaseUrl | vercel env add NEXT_PUBLIC_SUPABASE_URL production
Write-Host $supabaseKey | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Tambahkan ke Preview
Write-Host ""
Write-Host "Adding to Preview..." -ForegroundColor Yellow
Write-Host $supabaseUrl | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
Write-Host $supabaseKey | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Tambahkan ke Development
Write-Host ""
Write-Host "Adding to Development..." -ForegroundColor Yellow
Write-Host $supabaseUrl | vercel env add NEXT_PUBLIC_SUPABASE_URL development
Write-Host $supabaseKey | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

Write-Host ""
Write-Host "✓ Environment variables berhasil ditambahkan!" -ForegroundColor Green
Write-Host ""
Write-Host "Sekarang Anda bisa deploy dengan:" -ForegroundColor Cyan
Write-Host "  vercel --prod" -ForegroundColor White
Write-Host ""
