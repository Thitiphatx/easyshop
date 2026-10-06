#!/bin/bash
# EasyShop Setup Script
# Generates .env with fresh secrets on first run

set -e

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
  echo "⚠️  .env already exists. Do you want to regenerate secrets? (y/N)"
  read -r answer
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "✅ Keeping existing .env"
    exit 0
  fi
fi

echo "🔐 Generating secrets..."

# Generate random passwords and secrets
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 20)
MYSQL_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 20)
RCON_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 20)
JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 43)
ENCRYPT_SECRET=$(openssl rand -hex 32)

cat > "$ENV_FILE" <<EOF
DATABASE_URL="mysql://easyshop:${MYSQL_PASSWORD}@localhost:3306/easyshop"

RCON_HOST=localhost
RCON_PORT=25575
RCON_PASSWORD=${RCON_PASSWORD}

MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_USER=easyshop
MYSQL_DATABASE=easyshop
MYSQL_PASSWORD=${MYSQL_PASSWORD}

JWT_SECRET=${JWT_SECRET}
ENCRYPT_SECRET=${ENCRYPT_SECRET}

EASYSHOP_KEY=easyshop-setup-2026

# Cloudflare Turnstile (fill in your own keys)
NEXT_PUBLIC_TURNSTILE_SITE=
TURNSTILE_SECRET=
EOF

echo "✅ .env generated successfully!"
echo ""
echo "⚠️  Remember to fill in:"
echo "   - NEXT_PUBLIC_TURNSTILE_SITE"
echo "   - TURNSTILE_SECRET"
echo ""
echo "▶️  Run: docker compose up -d"
