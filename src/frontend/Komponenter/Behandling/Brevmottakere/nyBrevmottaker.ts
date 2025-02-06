import { MottakerRolle } from './mottakerRolle';
import { BrevmottakerFormValues } from './baks/modal/form/BrevmottakerForm';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';

export interface NyBrevmottaker {
    type: NyBrevmottakerType;
}

export interface NyBrevmottakerPersonUtenIdent extends NyBrevmottaker {
    type: NyBrevmottakerType.PERSON_UTEN_IDENT;
    mottakerRolle: MottakerRolle;
    navn: string;
    adresselinje1: string;
    adresselinje2?: string;
    postnummer?: string;
    poststed?: string;
    landkode: string;
}

export interface NyBrevmottakerPersonMedIdent extends NyBrevmottaker {
    type: NyBrevmottakerType.PERSON_MED_IDENT;
    personIdent: string;
    mottakerRolle: MottakerRolle;
    navn: string;
}

export interface NyBrevmottakerOrganisasjon extends NyBrevmottaker {
    type: NyBrevmottakerType.ORGANISASJON;
    organisasjonsnummer: string;
    organisasjonsnavn: string;
    navnHosOrganisasjon: string;
}

export function lagNyBrevmottakerPersonUtenIdent(
    brevmottakerFormValues: BrevmottakerFormValues
): NyBrevmottakerPersonUtenIdent {
    if (brevmottakerFormValues.mottakerRolle === '') {
        throw Error('Ugyldig tilstand. Mottaker rolle er påkrevd.');
    }
    const erNorgeValgt = brevmottakerFormValues.landkode === EøsLandkode.NO;
    return {
        type: NyBrevmottakerType.PERSON_UTEN_IDENT,
        mottakerRolle: brevmottakerFormValues.mottakerRolle,
        navn: brevmottakerFormValues.navn,
        landkode: brevmottakerFormValues.landkode,
        adresselinje1: brevmottakerFormValues.adresselinje1,
        adresselinje2: brevmottakerFormValues.adresselinje2,
        postnummer: erNorgeValgt ? brevmottakerFormValues.postnummer : undefined,
        poststed: erNorgeValgt ? brevmottakerFormValues.poststed : undefined,
    };
}

export enum NyBrevmottakerType {
    PERSON_MED_IDENT = 'PERSON_MED_IDENT',
    PERSON_UTEN_IDENT = 'PERSON_UTEN_IDENT',
    ORGANISASJON = 'ORGANISASJON',
}
