#!/bin/bash
# Henter secrets med nais-cli og skriver dem til .env
# Holdt POSIX-kompatibelt slik at både `sh hent-og-lagre-miljøvariabler.sh` og `./hent-og-lagre-miljøvariabler.sh` virker.

TEAM=teamfamilie
MILJO=dev-gcp
SECRET=azuread-familie-klage-frontend-lokal
BEGRUNNELSE="Lokal utvikling av familie-klage-frontend"

if ! command -v nais >/dev/null 2>&1; then
  echo "nais-cli mangler. Installer den: https://cli.nais.io"
  exit 1
fi

if ! nais device status | grep -q "Connected"; then
  echo "Naisdevice er ikke tilkoblet. Start naisdevice og velg connect. Status må være grønn."
  exit 1
fi

# nais-cli skriver feilmeldinger til stdout, så vi fanger dem og viser dem videre.
if ! SECRET_JSON=$(nais secret get "$SECRET" -e "$MILJO" -t "$TEAM" \
  --with-values --reason "$BEGRUNNELSE" -o json 2>&1); then
  echo "Klarte ikke hente secreten $SECRET:"
  echo "$SECRET_JSON"
  echo "Er du på naisdevice og logget inn med 'nais login -y'?"
  exit 1
fi

SECRET_KV=$(printf '%s\n' "$SECRET_JSON" | jq -r '.data[] | "\(.key)=\(.value)"')

velg() { printf '%s\n' "$SECRET_KV" | grep "^$1=" | head -1 | cut -d= -f2-; }

KLAGE_FRONTEND_CLIENT_ID=$(velg AZURE_APP_CLIENT_ID)
KLAGE_FRONTEND_CLIENT_SECRET=$(velg AZURE_APP_CLIENT_SECRET)

if [ -z "$KLAGE_FRONTEND_CLIENT_ID" ] || [ -z "$KLAGE_FRONTEND_CLIENT_SECRET" ]; then
  echo "Fant ikke AZURE_APP_CLIENT_ID/AZURE_APP_CLIENT_SECRET i $SECRET."
  exit 1
fi

# Generate random 32 character strings for the cookie and session keys
COOKIE_KEY1=$(openssl rand -hex 16)
COOKIE_KEY2=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY1=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY2=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY3=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY4=$(openssl rand -hex 16)
SESSION_SECRET=$(openssl rand -hex 16)

# Write the variables into the .env file
cat << EOF > .env
# Denne filen er generert automatisk ved å kjøre \`hent-og-lagre-miljøvariabler.sh\`

COOKIE_KEY1=$COOKIE_KEY1
COOKIE_KEY2=$COOKIE_KEY2
SESSION_SECRET=$SESSION_SECRET

CLIENT_ID=$KLAGE_FRONTEND_CLIENT_ID
CLIENT_SECRET=$KLAGE_FRONTEND_CLIENT_SECRET

# Lokalt
#ENV=local
#FAMILIE_KLAGE_SCOPE=api://dev-gcp.teamfamilie.familie-klage-lokal/.default

# Lokalt mot preprod
ENV=lokalt-mot-preprod
FAMILIE_KLAGE_SCOPE=api://dev-gcp.teamfamilie.familie-klage/.default

APP_VERSION=0.0.1
EOF
