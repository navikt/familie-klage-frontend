export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    // Operational
    skalKunneVelgePåklagetVedtakFraInfotrygd = 'familie.klage.infotrygd-vedtak',

    // Release-toggles
    kanMellomlagreVurdering = 'familie-klage.kan-mellomlagre-vurdering',
}
