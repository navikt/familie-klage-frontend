import CountryData from '@navikt/land-verktoy';
import { Brevmottakere } from '../brevmottakere';
import { mottakerRolleVisningsnavn } from '../mottakerRolle';
import { erBrevmottakerPersonUtenIdent } from './brevmottakerPersonUtenIdent';
import { erBrevmottakerPersonMedIdent } from '../brevmottakerPersonMedIdent';

export type OppsumertBrevmottaker = {
    id: string;
    visningstekst: string;
};

const countryInstance = CountryData.getCountryInstance('nb');

export function utledOppsumertBrevmottakere(brevmottakere: Brevmottakere): OppsumertBrevmottaker[] {
    const oppsumertBrevmottakere = brevmottakere.personer.map((brevmottakerPerson) => {
        if (erBrevmottakerPersonMedIdent(brevmottakerPerson)) {
            return { id: brevmottakerPerson.personIdent, visningstekst: brevmottakerPerson.navn };
        } else if (erBrevmottakerPersonUtenIdent(brevmottakerPerson)) {
            const land = countryInstance.findByValue(brevmottakerPerson.landkode).label;
            let visningstekst = `${brevmottakerPerson.navn} (${mottakerRolleVisningsnavn[brevmottakerPerson.mottakerRolle]}): ${brevmottakerPerson.adresselinje1}`;
            if (brevmottakerPerson.postnummer) {
                visningstekst = visningstekst + `, ${brevmottakerPerson.postnummer}`;
            }
            if (brevmottakerPerson.poststed) {
                visningstekst = visningstekst + `, ${brevmottakerPerson.poststed}`;
            }
            visningstekst = visningstekst + `, ${land}`;
            return { id: brevmottakerPerson.id, visningstekst };
        } else {
            throw Error('Støtter ikke type for brevmottaker');
        }
    });
    return [...oppsumertBrevmottakere];
}
