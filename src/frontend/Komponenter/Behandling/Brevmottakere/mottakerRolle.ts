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

export function skalNavnVærePreutfyltForMottakerRolle(mottakerRolle: MottakerRolle): boolean {
    return (
        mottakerRolle === MottakerRolle.DØDSBO ||
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE
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
