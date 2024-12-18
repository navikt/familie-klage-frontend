import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import CountryData from '@navikt/land-verktoy';

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

export enum Mottakertype {
    BRUKER_MED_UTENLANDSK_ADRESSE = 'BRUKER_MED_UTENLANDSK_ADRESSE',
    FULLMEKTIG = 'FULLMEKTIG',
    VERGE = 'VERGE',
    DØDSBO = 'DØDSBO',
}

export const mottakerVisningsnavn: Record<Mottakertype, string> = {
    BRUKER_MED_UTENLANDSK_ADRESSE: 'Bruker med utenlandsk adresse',
    FULLMEKTIG: 'Fullmektig',
    VERGE: 'Verge',
    DØDSBO: 'Dødsbo',
};

export function utledNavnVedDødsbo(navn: string, landkode: string) {
    return landkode === EøsLandkode.NO ? `${navn} v/dødsbo` : `Estate of ${navn}`;
}

export function utledNavn(
    navnFraFelt: string,
    navnFraPersonopplysninger: string,
    landkode: string,
    mottakertype: Mottakertype | string
) {
    switch (mottakertype) {
        case Mottakertype.DØDSBO:
            return utledNavnVedDødsbo(navnFraPersonopplysninger, landkode);
        case Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE:
            return navnFraPersonopplysninger;
        default:
            return navnFraFelt;
    }
}

export function utledGyldigeMottakertyper(brevmottakere: Brevmottaker[]) {
    const valgteBrevmottakertyper = brevmottakere.map((brevmottaker) => brevmottaker.mottakertype);
    if (valgteBrevmottakertyper.includes(Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE)) {
        return [Mottakertype.VERGE, Mottakertype.FULLMEKTIG];
    }

    if (
        valgteBrevmottakertyper.length > 0 &&
        !valgteBrevmottakertyper.includes(Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE)
    ) {
        return [Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE];
    }

    return Object.values(Mottakertype).filter(
        (mottakertype) => !valgteBrevmottakertyper.includes(mottakertype)
    );
}

export function utledHeading(antallMottakere: number, erLesevisning: boolean) {
    if (erLesevisning) {
        return antallMottakere === 1 ? 'Brevmottaker' : 'Brevmottakere';
    }
    if (antallMottakere === 0) {
        return 'Legg til brevmottaker';
    }
    return antallMottakere === 1 ? 'Legg til eller fjern brevmottaker' : 'Brevmottakere';
}

export function utledNavnPåMottakere(brevMottakere: Brevmottaker[]) {
    return [
        ...brevMottakere.map((person) => {
            const land = CountryData.getCountryInstance('nb').findByValue(person.landkode).label;
            return (
                `${person.navn} (${mottakerVisningsnavn[person.mottakertype]}): ${person.adresselinje1}, ` +
                (person.landkode === 'NO'
                    ? `${person.postnummer}, ${person.poststed}, ${land}`
                    : `${land}`)
            );
        }),
    ];
}
