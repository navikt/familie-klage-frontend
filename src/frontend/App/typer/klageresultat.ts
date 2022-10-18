export interface Klageresultat {
    type: KlagehendelseType;
    utfall?: Utfall;
    mottattEllerAvsluttetTidspunkt: string;
    journalpostReferanser: string[];
}

export enum KlagehendelseType {
    KLAGEBEHANDLING_AVSLUTTET = 'KLAGEBEHANDLING_AVSLUTTET',
    ANKEBEHANDLING_OPPRETTET = 'ANKEBEHANDLING_OPPRETTET',
    ANKEBEHANDLING_AVSLUTTET = 'ANKEBEHANDLING_AVSLUTTET',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET = 'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET',
}

export const klagehendelseTypeTilTekst: Record<KlagehendelseType, string> = {
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
    TRUKKET: 'Trukket KA',
    RETUR: 'Retur KA',
    OPPHEVET: 'Opphevet KA',
    MEDHOLD: 'Medhold KA',
    DELVIS_MEDHOLD: 'Delvis medhold KA',
    STADFESTELSE: 'Stadfestelse KA',
    UGUNST: 'Ugunst (Ugyldig) KA',
    AVVIST: 'Avvist KA',
};
