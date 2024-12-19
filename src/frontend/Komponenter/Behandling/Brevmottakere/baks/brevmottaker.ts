import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import CountryData from '@navikt/land-verktoy';
import { Mottakertype, mottakertypeVisningsnavn } from './mottakertype';

export type Brevmottaker = {
    id: string;
    mottakertype: Mottakertype;
    navn: string;
    landkode: string;
    adresselinje1: string;
    adresselinje2?: string | null;
    postnummer?: string | null;
    poststed?: string | null;
};

// TODO : Kan denne erstattes med metoden under?
export function utledBrevmottakernavnVedDødsbo(navn: string, landkode: string): string {
    return landkode === EøsLandkode.NO ? `${navn} v/dødsbo` : `Estate of ${navn}`;
}

// TODO : Navn blir ikke tilbakestilt, skal det det?
export function utledBrevmottakernavn(
    navnFraFelt: string,
    navnFraPersonopplysninger: string,
    landkode: string,
    mottakertype: Mottakertype | string
): string {
    switch (mottakertype) {
        case Mottakertype.DØDSBO:
            return utledBrevmottakernavnVedDødsbo(navnFraPersonopplysninger, landkode);
        case Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE:
            return navnFraPersonopplysninger;
        default:
            return navnFraFelt;
    }
}

export function utledOppsumertBrevmottakereSomTekst(brevmottakere: Brevmottaker[]): string[] {
    const oppsumertBrevmottakereSomTekst = brevmottakere.map((brevmottaker) => {
        const land = CountryData.getCountryInstance('nb').findByValue(brevmottaker.landkode).label;
        let tekst = `${brevmottaker.navn} (${mottakertypeVisningsnavn[brevmottaker.mottakertype]}): ${brevmottaker.adresselinje1}`;
        if (brevmottaker.postnummer) {
            tekst = tekst + `, ${brevmottaker.postnummer}`;
        }
        if (brevmottaker.poststed) {
            tekst = tekst + `, ${brevmottaker.poststed}`;
        }
        tekst = tekst + `, ${land}`;
        return tekst;
    });
    return [...oppsumertBrevmottakereSomTekst];
}

export function finnesBrevmottakerMedMottakertype(
    brevmottakere: Brevmottaker[],
    mottakertype: Mottakertype
): boolean {
    return brevmottakere.some((brevmottaker) => mottakertype === brevmottaker.mottakertype);
}
