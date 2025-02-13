export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    skalKunneVelgePåklagetVedtakFraInfotrygd = 'familie.klage.infotrygd-vedtak',

    // Release-toggles
    visSettPåVent = 'familie.klage.sett-pa-vent',
    visBrevmottakerBaks = 'familie-klage.vis-brevmottaker-baks',
    leggTilBrevmottakerBaks = 'familie-klage.legg-til-brevmottaker-baks',
}
