export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    // Operational
    skalKunneVelgePåklagetVedtakFraInfotrygd = 'familie.klage.infotrygd-vedtak',

    // Release-toggles
    visBrevmottakerBaks = 'familie-klage.vis-brevmottaker-baks',
    leggTilBrevmottakerBaks = 'familie-klage.legg-til-brevmottaker-baks',
    kanMellomlagreVurdering = 'familie-klage.kan-mellomlagre-vurdering',
}
