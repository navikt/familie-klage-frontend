import { EøsLandkode } from '../../../Felles/Landvelger/landkode';

export type BlankMottakerRolle = '';

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

export function skalPreutfylleNavnForMottakerRolle(
    mottakerRolle: MottakerRolle | BlankMottakerRolle
) {
    const erMottakerRolle = Object.values(MottakerRolle).includes(mottakerRolle as MottakerRolle);
    if (!erMottakerRolle) {
        return false;
    }
    return (
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE ||
        mottakerRolle === MottakerRolle.DØDSBO
    );
}

export function erGyldigMottakerRolleForLandkode(
    mottakerRolle: MottakerRolle,
    landkode: EøsLandkode
): boolean {
    const landkodeErNO = landkode === EøsLandkode.NO;
    const erBrukerMedUtenlandskAdresse =
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE;
    return !(landkodeErNO && erBrukerMedUtenlandskAdresse);
}
