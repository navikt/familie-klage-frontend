export interface IVurdering {
    vedtak: VedtakValg;
    årsak?: ÅrsakValg;
    hjemmel?: HjemmelValg;
    beskrivelse: string;
    fullførtDato?: string;
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
    TODO1 = 'TODO1',
    TODO2 = 'TODO2',
}

export const årsakValgTilTekst: Record<ÅrsakValg, string> = {
    VELG: 'Velg',
    SAKSBEHANDLINGSFEIL: 'Saksbehandlingsfeil',
    TODO1: 'ToDo1',
    TODO2: 'ToDo2',
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
