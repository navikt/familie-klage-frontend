import { BrevmottakerPersonUtenIdent } from './baks/brevmottakerPersonUtenIdent';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';

export enum MottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
    FULLMAKT = 'FULLMAKT',
    BRUKER_MED_UTENLANDSK_ADRESSE = 'BRUKER_MED_UTENLANDSK_ADRESSE',
    DØDSBO = 'DØDSBO',
}

export const mottakerRolleVisningsnavn: Record<MottakerRolle, string> = {
    BRUKER: 'Bruker',
    VERGE: 'Verge',
    FULLMAKT: 'Fullmektig',
    BRUKER_MED_UTENLANDSK_ADRESSE: 'Bruker med utenlandsk adresse',
    DØDSBO: 'Dødsbo',
};

export function utledGyldigeMottakerRolle(
    brevmottakere: BrevmottakerPersonUtenIdent[]
): MottakerRolle[] {
    const valgteBrevmottakerRoller = brevmottakere.map(
        (brevmottaker) => brevmottaker.mottakerRolle
    );
    if (valgteBrevmottakerRoller.includes(MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE)) {
        return [MottakerRolle.VERGE, MottakerRolle.FULLMAKT];
    }

    if (valgteBrevmottakerRoller.includes(MottakerRolle.DØDSBO)) {
        return [];
    }

    if (
        valgteBrevmottakerRoller.length > 0 &&
        !valgteBrevmottakerRoller.includes(MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE)
    ) {
        return [MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE];
    }

    return Object.values(MottakerRolle)
        .filter((mottakerRolle) => mottakerRolle !== MottakerRolle.BRUKER)
        .filter((mottakerRolle) => !valgteBrevmottakerRoller.includes(mottakerRolle));
}

export function skalNavnVærePreutfyltForMottakerRolle(mottakerRolle: MottakerRolle): boolean {
    return (
        mottakerRolle === MottakerRolle.DØDSBO ||
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE
    );
}

export function erGyldigMottakerRolleForLandkode(
    mottakerRolle: MottakerRolle,
    landkode: EøsLandkode | ''
): boolean {
    const landkodeErNO = landkode === EøsLandkode.NO;
    const erBrukerMedUtenlandskAdresse =
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE;
    return !(landkodeErNO && erBrukerMedUtenlandskAdresse);
}
