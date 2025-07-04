export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    // Operational
    skalKunneVelgePåklagetVedtakFraInfotrygd = 'familie.klage.infotrygd-vedtak',

    // Release-toggles
    leggTilBrevmottakerBaks = 'familie-klage.legg-til-brevmottaker-baks',
    kanMellomlagreVurdering = 'familie-klage.kan-mellomlagre-vurdering',
    brukNyHenleggBehandlingModal = 'familie-klage.bruk-ny-henlegg-behandling-modal',
}
