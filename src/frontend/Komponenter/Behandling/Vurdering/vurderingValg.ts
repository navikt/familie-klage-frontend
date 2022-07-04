export interface IVurdering {
    oppfyltFormkrav: number;
    muligFormkrav: number;
    begrunnelse: string;
    vedtakValg: VedtakValg;
    årsak?: ÅrsakValg;
    hjemmel?: HjemmelValg;
    beskrivelse: string;
    fullførtDato?: string;
}

// VEDTAK
export enum VedtakValg {
    OMGJØR_VEDTAK = 'OMGJØR_VEDTAK',
    OPPRETTHOLD_VEDTAK = 'OPPRETTHOLD_VEDTAK',
}

export const vedtakValgTilTekst: Record<VedtakValg, string> = {
    OMGJØR_VEDTAK: 'Omgjør vedtak',
    OPPRETTHOLD_VEDTAK: 'Oppretthold vedtak',
};

// ÅRSAK
export enum ÅrsakValg {
    SAKSBEHANDLINGSFEIL = 'SAKSBEHANDLINGSFEIL',
    TODO1 = 'TODO1',
    TODO2 = 'TODO2',
}

export const årsakValgTilTekst: Record<ÅrsakValg, string> = {
    SAKSBEHANDLINGSFEIL: 'Saksbehandlingsfeil',
    TODO1: 'ToDo1',
    TODO2: 'ToDo2',
};

// HJEMMEL
export enum HjemmelValg {
    FEMTEN_TO = 'FEMTEN_TO',
    FEMTEN_TRE = 'FEMTEN_TRE',
    FEMTEN_FIRE = 'FEMTEN_FIRE',
}

export const hjemmelValgTilTekst: Record<HjemmelValg, string> = {
    FEMTEN_TO: '15-2',
    FEMTEN_TRE: '15-3',
    FEMTEN_FIRE: '15-4',
};
