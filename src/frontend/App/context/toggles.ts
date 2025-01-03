export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    skalKunneVelgePåklagetVedtakFraInfotrygd = 'familie.klage.infotrygd-vedtak',

    // Release-toggles
    visSettPåVent = 'familie.klage.sett-pa-vent',
}
