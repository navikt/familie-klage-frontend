import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';

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

export const utledNavnVedDødsbo = (navn: string, landkode: string) => {
    return landkode === EøsLandkode.NO ? `${navn} v/dødsbo` : `Estate of ${navn}`;
};

export const utledNavn = (
    utfyltNavn: string,
    navn: string,
    landkode: string,
    mottakertype: Mottakertype
) => {
    switch (mottakertype) {
        case Mottakertype.DØDSBO:
            return utledNavnVedDødsbo(navn, landkode);
        case Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE:
            return navn;
        default:
            return utfyltNavn;
    }
};

export const finnGyldigeMottakertyper = (brevmottakere: Brevmottaker[]) => {
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
};
