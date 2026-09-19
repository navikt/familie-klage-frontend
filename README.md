# familie-klage-frontend

Frontend for behandling av klager i Team Familie. Appen brukes av saksbehandlere på tvers av
enslig forsørger (EF), barnetrygd (BA) og kontantstøtte (KS), og snakker med backend
[familie-klage](https://github.com/navikt/familie-klage).

# Kom i gang med utvikling

* Logg deg på naisdevice og kjør `nais login -y`. Installer [nais-cli](https://cli.nais.io) og
  [jq](https://formulae.brew.sh/formula/jq).
* Installer [NVM](https://github.com/nvm-sh/nvm) og kjør `nvm use`
* Aktiver riktig pnpm-versjon med `corepack enable` (henter versjonen fra `packageManager` i package.json)
* Installer avhengigheter med `pnpm install`
* Start dev-server med `pnpm start:dev`
* Åpne `http://localhost:8020` i nettleseren din

Hente avhengigheter krever at du har et Personal Access Token i GitHub med SSO til Nav-IT. For å opprette det må du gjøre følgende:
1. Lag/forny access token med read-rettigheter på pakker i GitHub (under developer settings)
2. Logg inn på npm med `npm login --scope=@navikt --registry=https://npm.pkg.github.com` og benytt brukernavn, epost og tokenet du nettopp genererte

For å bygge prodversjon kjør `pnpm build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

---

## Miljøvariabler

Miljøet appen kjører i styres av `ENV`-variabelen, og settes av pnpm-scriptene. Du skal normalt
ikke sette `ENV` manuelt.

| Script                           | `ENV`                | Går mot                                   |
|----------------------------------|----------------------|-------------------------------------------|
| `pnpm start:lokal`               | `local`              | familie-klage lokalt på `localhost:8094`  |
| `pnpm start:lokalt-mot-preprod`  | `lokalt-mot-preprod` | familie-klage i preprod                   |
| `pnpm start:dev`                 | `lokalt-mot-preprod` | alias for `pnpm start:lokalt-mot-preprod` |

Scope mot familie-klage utledes fra `ENV` i [src/backend/config.ts](src/backend/config.ts), slik at
du kan bytte mellom lokal og preprod uten å redigere `.env`. Vil du overstyre det for én kjøring,
sett variabelen på kommandolinja — den vinner over både `.env` og den utledede verdien:

```
FAMILIE_KLAGE_SCOPE=api://... pnpm start:lokal
```

I preprod og prod injiseres verdien av Nais.

### Secrets

Secrets for lokal kjøring hentes av [hent-og-lagre-miljøvariabler.sh](hent-og-lagre-milj%C3%B8variabler.sh),
som skriver dem til `.env`. Denne filen skal ikke sjekkes inn, og den overskrives i sin helhet av
scriptet — egne verdier du legger inn der forsvinner. Scriptet kjøres automatisk av `pnpm start:lokal`
og `pnpm start:lokalt-mot-preprod`, men hopper over hentingen dersom `.env` ble oppdatert for under
en time siden. Det unngår unødvendig logging av secret-uthenting, og at du blir logget ut hver gang
appen restartes.

Scriptet bruker [nais-cli](https://cli.nais.io) og krever at du er pålogget naisdevice og har kjørt
`nais login -y`. Uthenting av secret-verdier logges, og scriptet oppgir en begrunnelse (`--reason`)
automatisk.

Vil du hente secreten manuelt:
```
nais secret get azuread-familie-klage-frontend-lokal -e dev-gcp -t teamfamilie --with-values --reason "Lokal utvikling av familie-klage-frontend"
```
Merk at `nais secret get` uten `--with-values` ikke finner plattform-secrets som denne.

> Har du en `.env` fra før som setter `ENV` og `FAMILIE_KLAGE_SCOPE`? Slett fila — den genereres på
> nytt ved neste oppstart. En gammel `FAMILIE_KLAGE_SCOPE` overstyrer scopet som utledes fra `ENV`,
> og da vil `pnpm start:lokal` gå mot lokal backend med preprod-scope.

---

## Teste en klagesak lokalt

I virkeligheten opprettes en klagebehandling av fagsystemet (ef-sak, ba-sak eller ks-sak), og
saksbehandler kommer hit via en lenke. Lokalt har vi derfor en testside som oppretter en
dummy-behandling for deg.

1. Start backend: kjør `ApplicationLocal` i [familie-klage](https://github.com/navikt/familie-klage).
   Den starter på port 8094 med mockede integrasjoner og en database i Docker.
2. Start frontend med `pnpm start:lokal`.
3. Åpne `http://localhost:8020`. Du blir sendt videre til `/test`.
4. Fyll inn en ident fra testdata, velg fagsystem, og deretter stønadstype. Stønadstypene
   begrenses av fagsystemet du valgte (BA → barnetrygd, KS → kontantstøtte, EF → overgangsstønad,
   barnetilsyn og skolepenger).
5. Trykk «Lag behandling». Du blir sendt til formkrav-steget for den nye behandlingen, og kan
   klikke deg gjennom hele klageflyten.

Vil du heller teste mot data i preprod, kjør `pnpm start:lokalt-mot-preprod`. Testsiden er kun
tilgjengelig når backend rapporterer `local` som miljø, så den vises ikke i preprod eller prod.

Endepunktet testsiden bruker er `POST /api/test/opprett` i familie-klage, og det er deaktivert i
prod.

---

## Kodekvalitet

Vi bruker [Biome](https://biomejs.dev) til både formatering og linting, med samme oppsett som de
andre frontend-repoene i Team Familie.

| Kommando           | Gjør                                            |
|--------------------|-------------------------------------------------|
| `pnpm validate`    | Typesjekk + Biome. Dette kjøres også i PR-bygget |
| `pnpm check`       | Biome (format + lint + import-sortering)         |
| `pnpm check:fix`   | Samme, men retter det som kan rettes automatisk  |
| `pnpm typecheck`   | `tsc --noEmit` for backend og frontend           |
| `pnpm test`        | Vitest for backend og frontend                   |

En husky pre-commit hook kjører `lint-staged`. Merk at kommandoen er `biome check .` — den sjekker
hele repoet, ikke bare de staged filene. Globen avgjør dermed bare _om_ hooken kjører, ikke hva som
sjekkes. Dette er likt som i ba-sak. `biome check` avslutter med 0 på warnings, så hooken blokkerer
kun ved faktiske feil.

Merk at Biome som standard bare viser de 20 første diagnosene. Vil du se alle warnings, kjør
`pnpm exec biome check . --max-diagnostics=200`.

---

# Mens du koder

I Team Familie har vi et internt [felles frontend-bibliotek](https://github.com/navikt/familie-felles-frontend) for komponenter som kan brukes på tvers av appene våre. Lager man noe som senere kan gjenbrukes, er det fint om disse trekkes ut hit.

Ta gjerne en titt på Team Familie sin [readme](https://github.com/navikt/familie) med best practices når det kommer til frontendutvikling og universell utforming!

---

# Bygg og deploy

Appen bygges og deployes til GCP med GitHub Actions. Push til `main` bygger, deployer til dev og
deretter til prod. Pull requests kjører `pnpm build`, `pnpm validate` og `pnpm test`.

---

# Henvendelser

## Eksterne
Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For Nav-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-familie.

## Kode generert av GitHub Copilot
Dette repoet bruker GitHub Copilot til å generere kode.
