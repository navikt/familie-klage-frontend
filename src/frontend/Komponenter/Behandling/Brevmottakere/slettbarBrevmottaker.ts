import {
    Brevmottaker,
    erBrevmottakerOrganisasjon,
    erBrevmottakerPersonMedIdent,
    erBrevmottakerPersonUtenIdent,
} from './brevmottaker';

export interface SlettbarBrevmottaker {
    type: SlettbarBrevmottakerType;
}

export interface SlettbarBrevmottakerPersonMedIdent extends SlettbarBrevmottaker {
    type: SlettbarBrevmottakerType.PERSON_MED_IDENT;
    personIdent: string;
}

export interface SlettbarBrevmottakerPersonUtenIdent extends SlettbarBrevmottaker {
    type: SlettbarBrevmottakerType.PERSON_UTEN_IDENT;
    id: string;
}

export interface SlettbarBrevmottakerOrganisasjon extends SlettbarBrevmottaker {
    type: SlettbarBrevmottakerType.ORGANISASJON;
    organisasjonsnummer: string;
}

export enum SlettbarBrevmottakerType {
    PERSON_MED_IDENT = 'PERSON_MED_IDENT',
    PERSON_UTEN_IDENT = 'PERSON_UTEN_IDENT',
    ORGANISASJON = 'ORGANISASJON',
}

export function lagSlettbarBrevmottaker(brevmottaker: Brevmottaker): SlettbarBrevmottaker {
    if (erBrevmottakerPersonUtenIdent(brevmottaker)) {
        return lagSlettbarBrevmottakerPersonUtenIdent(brevmottaker.id);
    } else if (erBrevmottakerPersonMedIdent(brevmottaker)) {
        return lagSlettbarBrevmottakerPersonMedIdent(brevmottaker.personIdent);
    } else if (erBrevmottakerOrganisasjon(brevmottaker)) {
        return lagSlettbarBrevmottakerOrganisasjon(brevmottaker.organisasjonsnummer);
    } else {
        throw new Error('Ukjent brevmottaker type');
    }
}

export function lagSlettbarBrevmottakerPersonUtenIdent(
    id: string
): SlettbarBrevmottakerPersonUtenIdent {
    return {
        type: SlettbarBrevmottakerType.PERSON_UTEN_IDENT,
        id: id,
    };
}

export function lagSlettbarBrevmottakerPersonMedIdent(
    personIdent: string
): SlettbarBrevmottakerPersonMedIdent {
    return {
        type: SlettbarBrevmottakerType.PERSON_MED_IDENT,
        personIdent: personIdent,
    };
}

export function lagSlettbarBrevmottakerOrganisasjon(
    organisasjonsnummer: string
): SlettbarBrevmottakerOrganisasjon {
    return {
        type: SlettbarBrevmottakerType.ORGANISASJON,
        organisasjonsnummer: organisasjonsnummer,
    };
}
