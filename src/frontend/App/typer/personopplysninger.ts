import { erEtterDagensDato } from '../utils/dato';

export interface IPersonopplysninger {
    personIdent: string;
    navn: string;
    kjønn: Kjønn;
    adressebeskyttelse?: Adressebeskyttelse;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    dødsdato?: string;
    fødselsdato?: string;
    egenAnsatt: boolean;
    fullmakt: IFullmakt[];
    navEnhet: string;
    vergemål: IVergemål[];
}

export function erPersonopplysningerTilknyttetFullmakt(
    personopplysninger: IPersonopplysninger
): boolean {
    return personopplysninger.fullmakt.some(
        (fullmakt) => fullmakt.gyldigTilOgMed === null || erEtterDagensDato(fullmakt.gyldigTilOgMed)
    );
}

export function harPersonopplysningerVergemål(personopplysninger: IPersonopplysninger): boolean {
    return personopplysninger.vergemål.length > 0;
}

export enum Kjønn {
    KVINNE = 'KVINNE',
    MANN = 'MANN',
    UKJENT = 'UKJENT',
}

export interface IFullmakt {
    gyldigFraOgMed: string;
    gyldigTilOgMed: string;
    motpartsPersonident: string;
    navn?: string;
    områder: string[];
}

export interface IVergemål {
    embete?: string;
    type?: string;
    motpartsPersonident?: string;
    navn?: string;
    omfang?: string;
}

export enum Adressebeskyttelse {
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export enum Folkeregisterpersonstatus {
    BOSATT = 'BOSATT',
    UTFLYTTET = 'UTFLYTTET',
    FORSVUNNET = 'FORSVUNNET',
    DØD = 'DØD',
    OPPHØRT = 'OPPHØRT',
    FØDSELSREGISTRERT = 'FØDSELSREGISTRERT',
    MIDLERTIDIG = 'MIDLERTIDIG',
    INAKTIV = 'INAKTIV',
    UKJENT = 'UKJENT',
}
