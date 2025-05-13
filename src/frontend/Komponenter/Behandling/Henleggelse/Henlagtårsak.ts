export enum Henlagtårsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
}

export function erHenlagtÅrsakTrukketTilbake(henlagtÅrsak: Henlagtårsak | null) {
    return henlagtÅrsak === Henlagtårsak.TRUKKET_TILBAKE;
}
