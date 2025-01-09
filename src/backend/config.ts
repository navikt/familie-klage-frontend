// Konfigurer appen før backend prøver å sette opp konfigurasjon

import { appConfig, IApi, ISessionKonfigurasjon } from '@navikt/familie-backend';

type Rolle = 'veileder' | 'saksbehandler' | 'beslutter' | 'kode6' | 'kode7' | 'egenAnsatt';
type EksternlenkeKey =
    | 'efSakUrl'
    | 'baSakUrl'
    | 'ksSakUrl'
    | 'aInntekt'
    | 'gosys'
    | 'modia'
    | 'tilbakekrevingUrl';

type Roller = {
    [key in Rolle]: string;
};

type Eksternlenker = {
    [key in EksternlenkeKey]: string;
};

interface IEnvironment {
    buildPath: string;
    miljø: string;
    klageProxyUrl: string;
    roller: Roller;
    eksternlenker: Eksternlenker;
}

const rollerDev: Roller = {
    veileder: '19dcbfde-4cdb-4c64-a1ea-ac9802b03339',
    beslutter: '01166863-22f1-4e16-9785-d7a05a22df74',
    saksbehandler: 'ee5e0b5e-454c-4612-b931-1fe363df7c2c',
    kode6: '5ef775f2-61f8-4283-bf3d-8d03f428aa14', // 0000-GA-Strengt_Fortrolig_Adresse
    kode7: 'ea930b6b-9397-44d9-b9e6-f4cf527a632a', // 0000-GA-Fortrolig_Adresse
    egenAnsatt: 'dbe4ad45-320b-4e9a-aaa1-73cca4ee124d', // 0000-GA-Egne_ansatte
};

const rollerProd: Roller = {
    veileder: '31778fd8-3b71-4867-8db6-a81235fbe001',
    saksbehandler: '6406aba2-b930-41d3-a85b-dd13731bc974',
    beslutter: '5fcc0e1d-a4c2-49f0-93dc-27c9fea41e54',
    kode6: 'ad7b87a6-9180-467c-affc-20a566b0fec0', // 0000-GA-Strengt_Fortrolig_Adresse
    kode7: '9ec6487d-f37a-4aad-a027-cd221c1ac32b', // 0000-GA-Fortrolig_Adresse
    egenAnsatt: 'e750ceb5-b70b-4d94-b4fa-9d22467b786b', // 0000-GA-Egne_ansatte
};

const lenkerDev: Eksternlenker = {
    efSakUrl: 'https://ensligmorellerfar.ansatt.dev.nav.no/ekstern',
    baSakUrl: 'https://barnetrygd.ansatt.dev.nav.no',
    ksSakUrl: 'https://kontantstotte.ansatt.dev.nav.no',
    aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
    gosys: 'https://gosys-q1.dev.intern.nav.no/gosys',
    modia: 'https://app-q1.adeo.no/modiapersonoversikt',
    tilbakekrevingUrl: 'https://familie-tilbake-frontend.ansatt.dev.nav.no/fagsystem',
};

const lenkerProd: Eksternlenker = {
    efSakUrl: 'https://ensligmorellerfar.intern.nav.no/ekstern',
    baSakUrl: 'https://barnetrygd.intern.nav.no',
    ksSakUrl: 'https://kontantstotte.intern.nav.no',
    aInntekt: 'https://arbeid-og-inntekt.nais.adeo.no',
    gosys: 'https://gosys.intern.nav.no/gosys',
    modia: 'https://app.adeo.no/modiapersonoversikt',
    tilbakekrevingUrl: 'https://familietilbakekreving.intern.nav.no/fagsystem',
};

const lenkerLocal: Eksternlenker = {
    efSakUrl: 'http://localhost:8000/ekstern',
    baSakUrl: 'http://localhost:8000',
    ksSakUrl: 'http://localhost:8000',
    aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
    gosys: 'https://gosys-q1.dev.intern.nav.no/gosys',
    modia: 'https://app-q1.adeo.no/modiapersonoversikt',
    tilbakekrevingUrl: 'http://localhost:8000',
};

const Environment = (): IEnvironment => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: 'frontend_development',
            miljø: 'local',
            klageProxyUrl: 'http://localhost:8094',
            roller: rollerDev,
            eksternlenker: lenkerLocal,
        };
    } else if (process.env.ENV === 'e2e') {
        return {
            buildPath: 'frontend_production',
            miljø: 'e2e',
            klageProxyUrl: 'http://familie-klage:8093',
            roller: rollerDev,
            eksternlenker: lenkerLocal,
            //Har ikke satt opp redis
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: 'frontend_production',
            miljø: 'preprod',
            klageProxyUrl: 'http://familie-klage',
            roller: rollerDev,
            eksternlenker: lenkerDev,
        };
    } else if (process.env.ENV === 'lokalt-mot-preprod') {
        return {
            buildPath: 'frontend_development',
            miljø: 'local',
            klageProxyUrl: 'https://familie-klage-backend.intern.dev.nav.no',
            roller: rollerDev,
            eksternlenker: lenkerDev,
        };
    }

    return {
        buildPath: 'frontend_production',
        miljø: 'production',
        klageProxyUrl: 'http://familie-klage',
        roller: rollerProd,
        eksternlenker: lenkerProd,
    };
};
const env = Environment();

export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: [`${process.env.COOKIE_KEY1}`, `${process.env.COOKIE_KEY2}`],
    navn: 'familie-klage-v2',
    redisFullUrl: process.env.REDIS_URI_SESSIONS,
    redisBrukernavn: process.env.REDIS_USERNAME_SESSIONS,
    redisPassord: process.env.REDIS_PASSWORD_SESSIONS,
    secureCookie: !(
        process.env.ENV === 'local' ||
        process.env.ENV === 'e2e' ||
        process.env.ENV === 'lokalt-mot-preprod'
    ),
    sessionMaxAgeSekunder: 12 * 60 * 60,
};

if (!process.env.FAMILIE_KLAGE_SCOPE) {
    throw new Error('Scope mot familie-klage er ikke konfigurert');
}

export const oboConfig: IApi = {
    clientId: appConfig.clientId,
    scopes: [process.env.FAMILIE_KLAGE_SCOPE],
};

export const buildPath = env.buildPath;
export const klageProxyUrl = env.klageProxyUrl;
export const miljø = env.miljø;
export const roller = env.roller;
export const eksternlenker = env.eksternlenker;
