export interface Klageresultat {
    type: BehandlingEventType;
    utfall?: Utfall;
    mottattEllerAvsluttetTidspunkt: string;
    journalpostReferanser: string[];
}

export enum BehandlingEventType {
    KLAGEBEHANDLING_AVSLUTTET = 'Klagebehandling avsluttet',
    ANKEBEHANDLING_OPPRETTET = 'Ankebehandling opprettet',
    ANKEBEHANDLING_AVSLUTTET = 'Ankebehandling opprettet',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET = 'Anke i trygderettenbehandling opprettet',
}

export enum Utfall {
    TRUKKET = 'Trukket',
    RETUR = 'Retur',
    OPPHEVET = 'Opphevet',
    MEDHOLD = 'Medhold',
    DELVIS_MEDHOLD = 'Delvis medhold',
    STADFESTELSE = 'Stadfestelse',
    UGUNST = 'Ugunst (Ugyldig)',
    AVVIST = 'Avvist',
}
