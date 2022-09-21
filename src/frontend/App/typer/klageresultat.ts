export interface Klageresultat {
    type: BehandlingEventType;
    utfall?: Utfall;
    mottattEllerAvsluttetTidspunkt: string;
    journalpostReferanser: string[];
}

export enum BehandlingEventType {
    KLAGEBEHANDLING_AVSLUTTET = 'KLAGEBEHANDLING_AVSLUTTET',
    ANKEBEHANDLING_OPPRETTET = 'ANKEBEHANDLING_OPPRETTET',
    ANKEBEHANDLING_AVSLUTTET = 'ANKEBEHANDLING_AVSLUTTET',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET = 'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET',
}

export const behandlingEventTypeTilTekst: Record<BehandlingEventType, string> = {
    KLAGEBEHANDLING_AVSLUTTET: 'Klagebehandling avsluttet',
    ANKEBEHANDLING_OPPRETTET: 'Ankebehandling opprettet',
    ANKEBEHANDLING_AVSLUTTET: 'Ankebehandling avsluttet',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET: 'Anke i trygderettenbehandling opprettet',
};

export enum Utfall {
    TRUKKET = 'TRUKKET',
    RETUR = 'RETUR',
    OPPHEVET = 'OPPHEVET',
    MEDHOLD = 'MEDHOLD',
    DELVIS_MEDHOLD = 'DELVIS_MEDHOLD',
    STADFESTELSE = 'STADFESTELSE',
    UGUNST = 'UGUNST',
    AVVIST = 'AVVIST',
}

export const utfallTilTekst: Record<Utfall, string> = {
    TRUKKET: 'Trukket',
    RETUR: 'Retur',
    OPPHEVET: 'Opphevet',
    MEDHOLD: 'Medhold',
    DELVIS_MEDHOLD: 'Delvis medhold',
    STADFESTELSE: 'Stadfestelse',
    UGUNST: 'Ugunst (Ugyldig)',
    AVVIST: 'Avvist',
};
