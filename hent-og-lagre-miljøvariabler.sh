#!/bin/bash
# Henter secrets med nais-cli og skriver dem til .env
# Holdt POSIX-kompatibelt slik at både `sh hent-og-lagre-miljøvariabler.sh` og `./hent-og-lagre-miljøvariabler.sh` virker.

TEAM=teamfamilie
MILJO=dev-gcp
SECRET=azuread-familie-klage-frontend-lokal
BEGRUNNELSE="Lokal utvikling av familie-klage-frontend"
MAKS_ALDER_SEKUNDER=3600 # En time

# Scriptet kjøres av `pnpm start-env` ved hver oppstart. Vi hopper over hentingen dersom den
# ble gjort for under en time siden, slik at vi ikke logger unødvendige secret-uthentinger og
# ikke roterer cookie-nøklene (og dermed invaliderer sesjonen) hver gang appen restartes.
avbryt_hvis_nylig_hentet() {
  [ -f .env ] || return 0

  string_tidspunkt=$(grep '^FORRIGE_HENTING=' .env 2>/dev/null | head -1 | cut -d= -f2- | tr -d "'\"")
  [ -n "$string_tidspunkt" ] || return 0

  parset_tidspunkt=$(date -j -f "%d-%m-%y %H:%M:%S" "$string_tidspunkt" +%s 2>/dev/null || echo 0)
  case "$parset_tidspunkt" in
    ''|*[!0-9]*) return 0 ;;
  esac

  alder=$(( $(date +%s) - parset_tidspunkt ))
  if [ "$alder" -lt "$MAKS_ALDER_SEKUNDER" ]; then
    echo ".env er nylig oppdatert. Hopper over henting av secrets."
    exit 0
  fi
}
avbryt_hvis_nylig_hentet

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
SESSION_SECRET=$(openssl rand -hex 16)
FORRIGE_HENTING=$(date +"%d-%m-%y %H:%M:%S")

# Write the variables into the .env file
cat << EOF > .env
# Denne filen er generert automatisk ved å kjøre \`hent-og-lagre-miljøvariabler.sh\`, og blir
# overskrevet av scriptet. Ikke legg inn egne verdier her - de forsvinner.
#
# ENV og scope mot familie-klage settes av pnpm-scriptene:
#   pnpm start:lokal                -> ENV=local (mot backend på localhost:8094)
#   pnpm start:lokalt-mot-preprod   -> ENV=lokalt-mot-preprod (mot backend i preprod)
#
# Vil du overstyre scopet for én kjøring:
#   FAMILIE_KLAGE_SCOPE=api://... pnpm start:lokal
FORRIGE_HENTING='$FORRIGE_HENTING'

COOKIE_KEY1=$COOKIE_KEY1
COOKIE_KEY2=$COOKIE_KEY2
SESSION_SECRET=$SESSION_SECRET

CLIENT_ID=$KLAGE_FRONTEND_CLIENT_ID
CLIENT_SECRET=$KLAGE_FRONTEND_CLIENT_SECRET

APP_VERSION=0.0.1
EOF

echo ".env oppdatert med secrets for $SECRET: $FORRIGE_HENTING"
