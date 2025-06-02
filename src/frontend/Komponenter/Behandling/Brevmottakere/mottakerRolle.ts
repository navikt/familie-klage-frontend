import { BlankEøsLandkode, erEøsLandkode, EøsLandkode } from '../../../Felles/Landvelger/landkode';
import { utledPreutfyltBrevmottakerPersonUtenIdentNavn } from './brevmottaker';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';

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

export function erMottakerRolle(verdi: string): verdi is MottakerRolle {
    return Object.values(MottakerRolle).includes(verdi as MottakerRolle);
}

export function skalPreutfylleNavnForMottakerRolle(
    mottakerRolle: MottakerRolle | BlankMottakerRolle
) {
    if (!erMottakerRolle(mottakerRolle)) {
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

export function finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle(
    nyMottakerRolle: MottakerRolle,
    forrigeMottakerRolle: MottakerRolle | BlankMottakerRolle,
    landkode: EøsLandkode | BlankEøsLandkode,
    personopplysninger: IPersonopplysninger
): string | undefined {
    const skalNavnPreutfylles = skalPreutfylleNavnForMottakerRolle(nyMottakerRolle);
    if (skalNavnPreutfylles) {
        return utledPreutfyltBrevmottakerPersonUtenIdentNavn(
            personopplysninger.navn,
            erEøsLandkode(landkode) ? landkode : EøsLandkode.NO,
            nyMottakerRolle
        );
    }
    const varNavnPreutfylt = skalPreutfylleNavnForMottakerRolle(forrigeMottakerRolle);
    if (varNavnPreutfylt) {
        return '';
    }
    return undefined;
}

export function utledGyldigeMottakerRollerBasertPåAlleredeValgteMottakerRoller(
    valgteMottakerRoller: MottakerRolle[]
): MottakerRolle[] {
    const relevanteValgteMottakerRoller = valgteMottakerRoller.filter(
        (vmr) => vmr !== MottakerRolle.BRUKER
    );

    if (relevanteValgteMottakerRoller.length === 2) {
        return [];
    }

    if (relevanteValgteMottakerRoller.includes(MottakerRolle.DØDSBO)) {
        return [];
    }

    if (relevanteValgteMottakerRoller.includes(MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE)) {
        return [MottakerRolle.VERGE, MottakerRolle.FULLMAKT];
    }

    if (
        relevanteValgteMottakerRoller.length > 0 &&
        !relevanteValgteMottakerRoller.includes(MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE)
    ) {
        return [MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE];
    }

    return Object.values(MottakerRolle)
        .filter((mottakerRolle) => mottakerRolle !== MottakerRolle.BRUKER)
        .filter((mottakerRolle) => !relevanteValgteMottakerRoller.includes(mottakerRolle));
}
