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

export type OpprettBrevmottakerDto = Omit<Brevmottaker, 'id'>;

export function utledBrevmottakernavnVedDødsbo(navn: string, landkode: string) {
    return landkode === EøsLandkode.NO ? `${navn} v/dødsbo` : `Estate of ${navn}`;
}

export function utledBrevmottakernavn(
    navnFraFelt: string,
    navnFraPersonopplysninger: string,
    landkode: string,
    mottakertype: Mottakertype | string
) {
    switch (mottakertype) {
        case Mottakertype.DØDSBO:
            return utledBrevmottakernavnVedDødsbo(navnFraPersonopplysninger, landkode);
        case Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE:
            return navnFraPersonopplysninger;
        default:
            return navnFraFelt;
    }
}

export function utledNavnPåBrevmottakere(brevMottakere: Brevmottaker[]) {
    return [
        ...brevMottakere.map((person) => {
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
