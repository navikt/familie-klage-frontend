export interface IVurdering {
    behandlingId: string;
    vedtak: VedtakValg;
    arsak?: ÅrsakValg;
    hjemmel?: HjemmelValg;
    beskrivelse: string;
}

// VEDTAK
export enum VedtakValg {
    VELG = 'VELG',
    OMGJØR_VEDTAK = 'OMGJØR_VEDTAK',
    OPPRETTHOLD_VEDTAK = 'OPPRETTHOLD_VEDTAK',
}

export const vedtakValgTilTekst: Record<VedtakValg, string> = {
    VELG: 'Velg',
    OMGJØR_VEDTAK: 'Omgjør vedtak',
    OPPRETTHOLD_VEDTAK: 'Oppretthold vedtak',
};

// ÅRSAK
export enum ÅrsakValg {
    VELG = 'VELG',
    SAKSBEHANDLINGSFEIL = 'SAKSBEHANDLINGSFEIL',
    TRYKKET_FEIL = 'TRYKKET_FEIL',
    LESTE_IKKE_GJENNOM = 'LESTE_IKKE_GJENNOM',
    ENDRET_REGELVERK = 'ENDRET_REGELVERK',
}

export const årsakValgTilTekst: Record<ÅrsakValg, string> = {
    VELG: 'Velg',
    SAKSBEHANDLINGSFEIL: 'Saksbehandlingsfeil',
    TRYKKET_FEIL: 'Trykket på feil knapp',
    LESTE_IKKE_GJENNOM: 'Leste ikke gjennom hele klagen',
    ENDRET_REGELVERK: 'Endret regelverk siden behandlingen ble gjort',
};

// HJEMMEL
export enum HjemmelValg {
    VELG = 'VELG',
    FEMTEN_TO = 'FEMTEN_TO',
    FEMTEN_TRE = 'FEMTEN_TRE',
    FEMTEN_FIRE = 'FEMTEN_FIRE',
}

export const hjemmelValgTilTekst: Record<HjemmelValg, string> = {
    VELG: 'Velg',
    FEMTEN_TO: '15-2',
    FEMTEN_TRE: '15-3',
    FEMTEN_FIRE: '15-4',
};
