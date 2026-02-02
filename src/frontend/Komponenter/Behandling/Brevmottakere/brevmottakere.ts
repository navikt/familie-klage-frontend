import {
    Brevmottaker,
    BrevmottakerOrganisasjon,
    BrevmottakerPerson,
    BrevmottakerPersonUtenIdent,
    erBrevmottakerPersonUtenIdent,
} from './brevmottaker';

export interface Brevmottakere {
    personer: BrevmottakerPerson[];
    organisasjoner: BrevmottakerOrganisasjon[];
}

export const hentBrevmottakerPersonUtenIdenter = (
    brevmottakere: Brevmottakere
): BrevmottakerPersonUtenIdent[] =>
    brevmottakere.personer.filter((brevmottaker) => erBrevmottakerPersonUtenIdent(brevmottaker));

export const hentAlleBrevmottakereSomListe = (brevmottakere: Brevmottakere): Brevmottaker[] => [
    ...brevmottakere.personer,
    ...brevmottakere.organisasjoner,
];
