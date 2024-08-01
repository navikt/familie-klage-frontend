kubectl config use-context dev-gcp

function get_secrets() {
  local repo=$1
  kubectl -n teamfamilie get secret ${repo} -o json | jq '.data | map_values(@base64d)'
}

KLAGE_FRONTEND_LOKAL_SECRETS=$(get_secrets azuread-familie-klage-frontend-lokal)

KLAGE_FRONTEND_CLIENT_ID=$(echo "$KLAGE_FRONTEND_LOKAL_SECRETS" | jq -r '.AZURE_APP_CLIENT_ID')
KLAGE_FRONTEND_CLIENT_SECRET=$(echo "$KLAGE_FRONTEND_LOKAL_SECRETS" | jq -r '.AZURE_APP_CLIENT_SECRET')

# Generate random 32 character strings for the cookie and session keys
COOKIE_KEY1=$(openssl rand -hex 16)
COOKIE_KEY2=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY1=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY2=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY3=$(openssl rand -hex 16)
PASSPORTCOOKIE_KEY4=$(openssl rand -hex 16)
SESSION_SECRET=$(openssl rand -hex 16)

if [ -z "$KLAGE_FRONTEND_CLIENT_ID" ]
then
      echo "Klarte ikke å hente miljøvariabler. Er du pålogget Naisdevice og google?"
      return 1
fi

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