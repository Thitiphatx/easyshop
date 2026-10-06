# EasyShop Setup Script - PowerShell
# Generates .env with fresh cryptographic secrets

function Get-RandomBytes {
    param([int]$Count)
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
    $bytes = New-Object byte[] $Count
    $rng.GetBytes($bytes)
    $rng.Dispose()
    return $bytes
}

function New-RandomAlphanumeric {
    param([int]$Length)
    $result = ''
    while ($result.Length -lt $Length) {
        $bytes = Get-RandomBytes -Count 64
        $result += [System.Convert]::ToBase64String($bytes) -replace '[^a-zA-Z0-9]', ''
    }
    return $result.Substring(0, $Length)
}

function New-RandomHex {
    param([int]$Bytes)
    $raw = Get-RandomBytes -Count $Bytes
    return ($raw | ForEach-Object { $_.ToString('x2') }) -join ''
}

$JWT_SECRET     = New-RandomAlphanumeric -Length 43
$ENCRYPT_SECRET = New-RandomHex -Bytes 32
$EASYSHOP_KEY   = 'easyshop-' + (New-RandomAlphanumeric -Length 16)

$envContent = @"
DATABASE_URL=

RCON_HOST=
RCON_PORT=25575
RCON_PASSWORD=

MYSQL_ROOT_PASSWORD=
MYSQL_USER=easyshop
MYSQL_DATABASE=easyshop
MYSQL_PASSWORD=

JWT_SECRET=$JWT_SECRET
ENCRYPT_SECRET=$ENCRYPT_SECRET

EASYSHOP_KEY=$EASYSHOP_KEY

# Cloudflare Turnstile (fill in your own keys)
NEXT_PUBLIC_TURNSTILE_SITE=
TURNSTILE_SECRET=
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

# Copy .env to clipboard
Get-Content ".env" | Set-Clipboard

Write-Host "[OK] .env generated successfully!" -ForegroundColor Green
Write-Host "[OK] .env content copied to clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "[WARNING] Remember to fill in:" -ForegroundColor Yellow
Write-Host "   - NEXT_PUBLIC_TURNSTILE_SITE"
Write-Host "   - TURNSTILE_SECRET"
Write-Host ""
Write-Host "[NEXT] Run: docker compose up -d" -ForegroundColor Cyan
