import CountryData from '@navikt/land-verktoy';
import { Brevmottakere, hentAlleBrevmottakereSomListe } from '../brevmottakere';
import { mottakerRolleVisningsnavn } from '../mottakerRolle';
import {
    erBrevmottakerOrganisasjon,
    erBrevmottakerPersonMedIdent,
    erBrevmottakerPersonUtenIdent,
} from '../brevmottaker';
import { formaterOrgNummer } from '../../../../App/typer/institusjon';

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
            const mottakerRolle = brevmottaker.mottakerRolle
                ? ` (${mottakerRolleVisningsnavn[brevmottaker.mottakerRolle].replace(/ /g, '\u00A0')})`
                : '';
            if (erBrevmottakerPersonMedIdent(brevmottaker)) {
                return {
                    id: brevmottaker.personIdent,
                    visningstekst: brevmottaker.navn,
                    rekkefølge: brevmottaker.mottakerRolle === 'BRUKER' ? 0 : 2,
                };
            } else if (erBrevmottakerPersonUtenIdent(brevmottaker)) {
                const land = countryInstance.findByValue(brevmottaker.landkode).label;
                let visningstekst = `${brevmottaker.navn}${mottakerRolle}: `;
                let adresse = brevmottaker.adresselinje1;
                if (brevmottaker.postnummer) {
                    adresse += `, ${brevmottaker.postnummer}`;
                }
                if (brevmottaker.poststed) {
                    adresse += `, ${brevmottaker.poststed}`;
                }
                adresse += `, ${land}`;
                visningstekst += adresse.replace(/ /g, '\u00A0');
                return { id: brevmottaker.id, visningstekst, rekkefølge: 2 };
            } else if (erBrevmottakerOrganisasjon(brevmottaker)) {
                const organisasjonsnavn = brevmottaker.organisasjonsnavn;
                const organisasjonsnummer = formaterOrgNummer(brevmottaker.organisasjonsnummer);
                const navnHosOrganisasjon = brevmottaker.navnHosOrganisasjon
                    ? ' ' + `c/o ${brevmottaker.navnHosOrganisasjon}`.replace(/ /g, '\u00A0')
                    : '';
                return {
                    id: brevmottaker.organisasjonsnummer,
                    visningstekst: `${organisasjonsnavn}${mottakerRolle}${navnHosOrganisasjon}: ${organisasjonsnummer}`,
                    rekkefølge: brevmottaker.mottakerRolle === 'INSTITUSJON' ? 1 : 3,
                };
            } else {
                throw Error('Støtter ikke type for brevmottaker');
            }
        })
        .sort((a, b) => a.rekkefølge - b.rekkefølge);

    return [...oppsummertBrevmottakere];
}
