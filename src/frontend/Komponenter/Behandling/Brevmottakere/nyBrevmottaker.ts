import { MottakerRolle } from './mottakerRolle';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';
import { Brevmottakere, hentAlleBrevmottakereSomListe } from './brevmottakere';
import {
    BrevmottakerOrganisasjon,
    BrevmottakerPersonMedIdent,
    erBrevmottakerOrganisasjon,
    erBrevmottakerPersonMedIdent,
    erBrevmottakerPersonUtenIdent,
} from './brevmottaker';

export interface NyBrevmottaker {
    type: NyBrevmottakerType;
    mottakerRolle?: MottakerRolle;
}

export interface NyBrevmottakerPerson extends NyBrevmottaker {
    mottakerRolle: MottakerRolle;
    navn: string;
}

export interface NyBrevmottakerPersonUtenIdent extends NyBrevmottakerPerson {
    type: NyBrevmottakerType.PERSON_UTEN_IDENT;
    adresselinje1: string;
    adresselinje2?: string;
    postnummer?: string;
    poststed?: string;
    landkode: string;
}

export interface NyBrevmottakerPersonMedIdent extends NyBrevmottakerPerson {
    type: NyBrevmottakerType.PERSON_MED_IDENT;
    personIdent: string;
}

export interface NyBrevmottakerOrganisasjon extends NyBrevmottaker {
    type: NyBrevmottakerType.ORGANISASJON;
    organisasjonsnummer: string;
    organisasjonsnavn: string;
    navnHosOrganisasjon: string;
}

export function mapTilMottakerRolle(brevmottakere: NyBrevmottaker[]) {
    return brevmottakere
        .map((brevmottaker) => brevmottaker.mottakerRolle)
        .filter((mottakerRolle) => mottakerRolle !== undefined);
}

export function harEnDødsboNyBrevmottaker(nyeBrevmottakere: NyBrevmottaker[]) {
    return nyeBrevmottakere
        .filter(erNyBrevmottakerPerson)
        .some((brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.DØDSBO);
}

export function harEnBrukerNyBrevmottaker(nyeBrevmottakere: NyBrevmottaker[]) {
    return nyeBrevmottakere
        .filter(erNyBrevmottakerPerson)
        .some((brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.BRUKER);
}

export function erNyBrevmottakerPerson(
    nyBrevmottaker: NyBrevmottaker
): nyBrevmottaker is NyBrevmottakerPerson {
    return (
        nyBrevmottaker.type === NyBrevmottakerType.PERSON_MED_IDENT ||
        nyBrevmottaker.type === NyBrevmottakerType.PERSON_UTEN_IDENT
    );
}

export function erNyBrevmottakerPersonMedIdent(
    nyBrevmottaker: NyBrevmottaker
): nyBrevmottaker is NyBrevmottakerPersonMedIdent {
    return nyBrevmottaker.type === NyBrevmottakerType.PERSON_MED_IDENT;
}

export function erNyBrevmottakerPersonUtenIdent(
    nyBrevmottaker: NyBrevmottaker
): nyBrevmottaker is NyBrevmottakerPersonUtenIdent {
    return nyBrevmottaker.type === NyBrevmottakerType.PERSON_UTEN_IDENT;
}

export function erNyBrevmottakerOrganisasjon(
    nyBrevmottaker: NyBrevmottaker
): nyBrevmottaker is NyBrevmottakerOrganisasjon {
    return nyBrevmottaker.type === NyBrevmottakerType.ORGANISASJON;
}

export function lagNyeBrevmottakere(brevmottakere: Brevmottakere): NyBrevmottaker[] {
    return hentAlleBrevmottakereSomListe(brevmottakere).map((mottaker) => {
        if (erBrevmottakerPersonMedIdent(mottaker)) {
            return lagNyBrevmottakerPersonMedIdent(mottaker);
        } else if (erBrevmottakerPersonUtenIdent(mottaker)) {
            return lagNyBrevmottakerPersonUtenIdent(mottaker);
        } else if (erBrevmottakerOrganisasjon(mottaker)) {
            return lagNyBrevmottakerOrganisasjon(mottaker);
        } else {
            throw Error('Feil oppstod ved oppretting av nye brevmottakere.');
        }
    });
}

export function lagNyBrevmottakerOrganisasjon(
    brevmottakerOrganisasjon: BrevmottakerOrganisasjon
): NyBrevmottakerOrganisasjon {
    return {
        type: NyBrevmottakerType.ORGANISASJON,
        organisasjonsnummer: brevmottakerOrganisasjon.organisasjonsnummer,
        organisasjonsnavn: brevmottakerOrganisasjon.organisasjonsnavn,
        navnHosOrganisasjon: brevmottakerOrganisasjon.navnHosOrganisasjon,
        mottakerRolle: brevmottakerOrganisasjon.mottakerRolle,
    };
}

export function lagNyBrevmottakerPersonMedIdent(
    brevmottakerPersonMedIdent: BrevmottakerPersonMedIdent
): NyBrevmottakerPersonMedIdent {
    return {
        type: NyBrevmottakerType.PERSON_MED_IDENT,
        personIdent: brevmottakerPersonMedIdent.personIdent,
        mottakerRolle: brevmottakerPersonMedIdent.mottakerRolle,
        navn: brevmottakerPersonMedIdent.navn,
    };
}

export function lagNyBrevmottakerPersonUtenIdent(person: {
    mottakerRolle: MottakerRolle | '';
    navn: string;
    adresselinje1: string;
    adresselinje2?: string;
    postnummer?: string;
    poststed?: string;
    landkode: string;
}): NyBrevmottakerPersonUtenIdent {
    if (person.mottakerRolle === '') {
        throw Error('Ugyldig tilstand. Mottaker rolle er påkrevd.');
    }
    const erNorgeValgt = person.landkode === EøsLandkode.NO;
    return {
        type: NyBrevmottakerType.PERSON_UTEN_IDENT,
        mottakerRolle: person.mottakerRolle,
        navn: person.navn,
        landkode: person.landkode,
        adresselinje1: person.adresselinje1,
        adresselinje2: person.adresselinje2,
        postnummer: erNorgeValgt ? person.postnummer : undefined,
        poststed: erNorgeValgt ? person.poststed : undefined,
    };
}

export enum NyBrevmottakerType {
    PERSON_MED_IDENT = 'PERSON_MED_IDENT',
    PERSON_UTEN_IDENT = 'PERSON_UTEN_IDENT',
    ORGANISASJON = 'ORGANISASJON',
}
