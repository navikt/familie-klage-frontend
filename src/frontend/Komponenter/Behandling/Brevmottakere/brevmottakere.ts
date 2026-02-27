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

export const hentAlleBrevmottakerPersonUtenIdent = (
    brevmottakere: Brevmottakere
): BrevmottakerPersonUtenIdent[] => brevmottakere.personer.filter(erBrevmottakerPersonUtenIdent);

export const hentManueltOpprettedeBrevmottakere = (brevmottakere: Brevmottakere): Brevmottaker[] =>
    hentAlleBrevmottakereSomListe(brevmottakere).filter(
        (brevmottaker) =>
            !brevmottaker.mottakerRolle ||
            ![MottakerRolle.BRUKER, MottakerRolle.INSTITUSJON].includes(brevmottaker.mottakerRolle)
    );

export const hentAlleBrevmottakereSomListe = (brevmottakere: Brevmottakere): Brevmottaker[] => [
    ...brevmottakere.personer,
    ...brevmottakere.organisasjoner,
];

export const erInstitusjonBrevmottaker = (brevmottakere: Brevmottakere): boolean =>
    brevmottakere.organisasjoner.some(
        (brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.INSTITUSJON
    );
