import { MottakerRolle } from './mottakerRolle';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';
import { Brevmottakere } from './brevmottakere';
import {
    BrevmottakerOrganisasjon,
    BrevmottakerPersonMedIdent,
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

export function mapTilMottakerRolle(brevmottakere: NyBrevmottakerPerson[]) {
    return brevmottakere.map((brevmottaker) => brevmottaker.mottakerRolle);
}

export function harEnDødsboNyBrevmottaker(nyeBrevmottakere: NyBrevmottaker[]) {
    return nyeBrevmottakere
        .filter((brevmottaker) => erNyBrevmottakerPerson(brevmottaker))
        .some((brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.DØDSBO);
}

export function harEnBrukerNyBrevmottaker(nyeBrevmottakere: NyBrevmottaker[]) {
    return nyeBrevmottakere
        .filter((brevmottaker) => erNyBrevmottakerPerson(brevmottaker))
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

export function lagNyeBrevmottakere(brevmottakere: Brevmottakere): NyBrevmottaker[] {
    return [
        ...brevmottakere.personer.map((person) => {
            if (erBrevmottakerPersonMedIdent(person)) {
                return lagNyBrevmottakerPersonMedIdent(person);
            } else if (erBrevmottakerPersonUtenIdent(person)) {
                return lagNyBrevmottakerPersonUtenIdent(person);
            } else {
                // Dette burde aldri skje da en person må enten ha en ident eller ikke
                throw Error('Feil oppstod ved oppretting av nye brevmottakere.');
            }
        }),
        ...brevmottakere.organisasjoner.map((organisasjon) => {
            return lagNyBrevmottakerOrganisasjon(organisasjon);
        }),
    ];
}

export function lagNyBrevmottakerOrganisasjon(
    brevmottakerOrganisasjon: BrevmottakerOrganisasjon
): NyBrevmottakerOrganisasjon {
    return {
        type: NyBrevmottakerType.ORGANISASJON,
        organisasjonsnummer: brevmottakerOrganisasjon.organisasjonsnummer,
        organisasjonsnavn: brevmottakerOrganisasjon.organisasjonsnavn,
        navnHosOrganisasjon: brevmottakerOrganisasjon.navnHosOrganisasjon,
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
