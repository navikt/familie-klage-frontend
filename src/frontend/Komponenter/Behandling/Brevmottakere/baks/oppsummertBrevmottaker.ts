import CountryData from '@navikt/land-verktoy';
import { Brevmottakere, hentAlleBrevmottakereSomListe } from '../brevmottakere';
import { mottakerRolleVisningsnavn } from '../mottakerRolle';
import {
    erBrevmottakerOrganisasjon,
    erBrevmottakerPersonMedIdent,
    erBrevmottakerPersonUtenIdent,
} from '../brevmottaker';

export type OppsummertBrevmottaker = {
    id: string;
    visningstekst: string;
    rekkefølge: number;
};

const countryInstance = CountryData.getCountryInstance('nb');

export function utledOppsumertBrevmottakere(
    brevmottakere: Brevmottakere
): OppsummertBrevmottaker[] {
    const oppsummertBrevmottakere = hentAlleBrevmottakereSomListe(brevmottakere)
        .map((brevmottaker) => {
            if (erBrevmottakerPersonMedIdent(brevmottaker)) {
                return {
                    id: brevmottaker.personIdent,
                    visningstekst: brevmottaker.navn,
                    rekkefølge: brevmottaker.mottakerRolle === 'BRUKER' ? 0 : 2,
                };
            } else if (erBrevmottakerPersonUtenIdent(brevmottaker)) {
                const land = countryInstance.findByValue(brevmottaker.landkode).label;
                let visningstekst = `${brevmottaker.navn} (${mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]}): ${brevmottaker.adresselinje1}`;
                if (brevmottaker.postnummer) {
                    visningstekst = visningstekst + `, ${brevmottaker.postnummer}`;
                }
                if (brevmottaker.poststed) {
                    visningstekst = visningstekst + `, ${brevmottaker.poststed}`;
                }
                visningstekst = visningstekst + `, ${land}`;
                return { id: brevmottaker.id, visningstekst, rekkefølge: 2 };
            } else if (erBrevmottakerOrganisasjon(brevmottaker)) {
                const organisasjonsnavn = brevmottaker.organisasjonsnavn;
                const mottakerrolle = brevmottaker.mottakerRolle
                    ? ` (${mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]})`
                    : '';
                return {
                    id: brevmottaker.organisasjonsnummer,
                    visningstekst: `${organisasjonsnavn}${mottakerrolle}`,
                    rekkefølge: brevmottaker.mottakerRolle === 'INSTITUSJON' ? 1 : 3,
                };
            } else {
                throw Error('Støtter ikke type for brevmottaker');
            }
        })
        .sort((a, b) => a.rekkefølge - b.rekkefølge);

    return [...oppsummertBrevmottakere];
}
