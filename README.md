# familie-klage-frontend

Frontend app for behandling av klager (team familie)

# Kom i gang med utvikling

* Installere avhengigheter `yarn`
* Starte dev-server `yarn start:dev`
* Åpne `http://localhost:8020` i nettleseren din

For å kunne installere avhengigheter fra navikt registry må man være logget inn i github packages. Kjør kommando:
`npm login --scope=@navikt --registry=https://npm.pkg.github.com`
username er det samme på github og passordet er utvikler-tokenet som er generert i github.
Dersom tokenet allerede er generert, finnes det typisk i m2-settings/gradle.properties fil.

## Client id & client secret
Appen krever en del miljøvariabler og legges til i .env fila i root på prosjektet.
```
    ENV=local
    APP_VERSION=0.0.1
    COOKIE_KEY1='<any string of length 32>'
    COOKIE_KEY2='<any string of length 32>'
    PASSPORTCOOKIE_KEY1='<any string of length 32>'
    PASSPORTCOOKIE_KEY2='<any string of length 32>'
    PASSPORTCOOKIE_KEY3='<any string of length 12>'
    PASSPORTCOOKIE_KEY4='<any string of length 12>'
    SESSION_SECRET='<any string of length 32>'

    FAMILIE_KLAGE_SCOPE='api://<AZURE_APP_CLIENT_ID fra secret til azuread-familie-klage-lokal>/.default'
    CLIENT_ID='<AZURE_APP_CLIENT_ID fra secret>'
    CLIENT_SECRET='<AZURE_APP_CLIENT_SECRET fra secret>'
```

Secrets kan bli lagt inn automatisk dersom man kjører `sh hent-og-lagre-miljøvariabler.sh`. Scriptet krever at du har `jq`, er pålogget naisdevice og er logget inn på google `gcloud auth login`

Secrets kan også hentes selv fra cluster med
`kubectl -n teamfamilie get secret azuread-familie-klage-frontend-lokal -o json | jq '.data | map_values(@base64d)'`
`kubectl -n teamfamilie get secret azuread-familie-klage-lokal -o json | jq '.data | map_values(@base64d)'`

Dersom det skal kjøres mot backend lokalt må følgende være satt:
```
ENV=local
EF_SAK_SCOPE=api://dev-gcp.teamfamilie.familie-ef-sak-lokal/.default
```
Dersom det skal kjøres mot preprod må følgende være satt:
```
ENV=lokalt-mot-preprod
EF_SAK_SCOPE=api://dev-gcp.teamfamilie.familie-ef-sak/.default
```

For å bygge prodversjon kjør `yarn build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

---------

# Mens du koder

I Team Familie har vi et intern (felles frontend bibliotek)[https://github.com/navikt/familie-felles-frontend] for komponenter som kan brukes på tvers av appene våre. Lager man noe som senere kan gjenbrukes, er det fint om disse trekkes ut hit.

Ta gjerne en titt på Team Familie sin (readme)[https://github.com/navikt/familie] med best practices når det kommer til frontendutvikling, uu og bruken av styled-components!

---


# Bygg og deploy
Appen bygges og deployes til GCP med github actions.

---

# Henvendelser

## Eksterne
Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-familie.

## Kode generert av GitHub Copilot
Dette repoet bruker GitHub Copilot til å generere kode.