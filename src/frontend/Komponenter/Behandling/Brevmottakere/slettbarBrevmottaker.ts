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
    id: string;
}

export enum SlettbarBrevmottakerType {
    PERSON_MED_IDENT = 'PERSON_MED_IDENT',
    PERSON_UTEN_IDENT = 'PERSON_UTEN_IDENT',
    ORGANISASJON = 'ORGANISASJON',
}

export function legSlettbarBrevmottakerPersonUtenIdent(
    id: string
): SlettbarBrevmottakerPersonUtenIdent {
    return {
        type: SlettbarBrevmottakerType.PERSON_UTEN_IDENT,
        id: id,
    };
}
