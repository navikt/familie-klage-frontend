import {
    Brevmottaker,
    BrevmottakerOrganisasjon,
    BrevmottakerPerson,
    BrevmottakerPersonUtenIdent,
    erBrevmottakerPersonUtenIdent,
} from './brevmottaker';
import { MottakerRolle } from './mottakerRolle';

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

export const erInstitusjonBrevmottaker = (brevmottakere: Brevmottakere): boolean =>
    brevmottakere.organisasjoner.some(
        (brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.INSTITUSJON
    );
