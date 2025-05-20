export enum HenlagtÅrsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
}

export function erHenlagtÅrsakTrukketTilbake(henlagtÅrsak: HenlagtÅrsak | null) {
    return henlagtÅrsak === HenlagtÅrsak.TRUKKET_TILBAKE;
}
