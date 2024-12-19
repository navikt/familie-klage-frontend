import CountryData from '@navikt/land-verktoy';
import { mottakertypeVisningsnavn } from './mottakertype';
import { Brevmottaker } from './brevmottaker';

export type OppsumertBrevmottaker = {
    id: string;
    visningstekst: string;
};

const countryInstance = CountryData.getCountryInstance('nb');

export function utledOppsumertBrevmottakere(
    brevmottakere: Brevmottaker[]
): OppsumertBrevmottaker[] {
    const oppsumertBrevmottakere = brevmottakere.map((brevmottaker) => {
        const land = countryInstance.findByValue(brevmottaker.landkode).label;
        let visningstekst = `${brevmottaker.navn} (${mottakertypeVisningsnavn[brevmottaker.mottakertype]}): ${brevmottaker.adresselinje1}`;
        if (brevmottaker.postnummer) {
            visningstekst = visningstekst + `, ${brevmottaker.postnummer}`;
        }
        if (brevmottaker.poststed) {
            visningstekst = visningstekst + `, ${brevmottaker.poststed}`;
        }
        visningstekst = visningstekst + `, ${land}`;
        return { id: brevmottaker.id, visningstekst };
    });
    return [...oppsumertBrevmottakere];
}
