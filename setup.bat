@echo off
:: EasyShop Setup Script for Windows

if exist ".env" (
    echo [WARNING] .env already exists. Regenerate secrets? (y/N)
    set /p "answer="
    if /I not "%answer%"=="y" (
        echo [OK] Keeping existing .env
        exit /b 0
    )
)

echo [INFO] Generating secrets...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
