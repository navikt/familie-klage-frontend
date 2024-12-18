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

export function utledBrevmottakernavnVedDødsbo(navn: string, landkode: string): string {
    return landkode === EøsLandkode.NO ? `${navn} v/dødsbo` : `Estate of ${navn}`;
}

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

export function utledOppsumeringsnavnPåBrevmottakere(brevmottakere: Brevmottaker[]): string[] {
    return [
        ...brevmottakere.map((person) => {
            const land = CountryData.getCountryInstance('nb').findByValue(person.landkode).label;
            return (
                `${person.navn} (${mottakertypeVisningsnavn[person.mottakertype]}): ${person.adresselinje1}, ` +
                (person.landkode === 'NO'
                    ? `${person.postnummer}, ${person.poststed}, ${land}`
                    : `${land}`)
            );
        }),
    ];
}

export function finnesBrevmottakerMedMottakertype(
    brevmottakere: Brevmottaker[],
    mottakertype: Mottakertype
): boolean {
    return brevmottakere.some((brevmottaker) => mottakertype === brevmottaker.mottakertype);
}
