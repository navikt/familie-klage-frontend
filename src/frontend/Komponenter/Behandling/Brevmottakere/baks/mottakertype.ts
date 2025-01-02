import { Brevmottaker } from './brevmottaker';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';

export enum Mottakertype {
    BRUKER_MED_UTENLANDSK_ADRESSE = 'BRUKER_MED_UTENLANDSK_ADRESSE',
    FULLMEKTIG = 'FULLMEKTIG',
    VERGE = 'VERGE',
    DØDSBO = 'DØDSBO',
}

export const mottakertypeVisningsnavn: Record<Mottakertype, string> = {
    BRUKER_MED_UTENLANDSK_ADRESSE: 'Bruker med utenlandsk adresse',
    FULLMEKTIG: 'Fullmektig',
    VERGE: 'Verge',
    DØDSBO: 'Dødsbo',
};

export function utledGyldigeMottakertyper(brevmottakere: Brevmottaker[]): Mottakertype[] {
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

export function erGyldigMottakertypeForLandkode(
    mottakertype: Mottakertype,
    landkode: EøsLandkode | ''
): boolean {
    const landkodeErNO = landkode === EøsLandkode.NO;
    const erBrukerMedUtenlandskAdresse =
        mottakertype === Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE;
    return !(landkodeErNO && erBrukerMedUtenlandskAdresse);
}
