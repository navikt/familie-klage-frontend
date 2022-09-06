export interface IVurdering {
    behandlingId: string;
    vedtak: VedtakValg;
    arsak?: ÅrsakOmgjøring;
    hjemmel?: Hjemmel;
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
export enum ÅrsakOmgjøring {
    VELG = 'VELG',
    FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
    KØET_BEHANDLING = 'KØET_BEHANDLING',
    ANNET = 'ANNET',
}

export const årsakValgTilTekst: Record<ÅrsakOmgjøring, string> = {
    VELG: 'Velg',
    FEIL_I_LOVANDVENDELSE: 'Feil lovanvendelse',
    FEIL_REGELVERKSFORSTÅELSE: 'Feil regelverksforståelse',
    FEIL_ELLER_ENDRET_FAKTA: 'Feil eller endret fakta',
    FEIL_PROSESSUELL: 'Prosessuell feil',
    KØET_BEHANDLING: 'Søker eller den andre forelderen har en åpen behandling',
    ANNET: 'Annet',
};

export enum Hjemmel {
    VELG = 'VELG',
    FEMTEN_TO = 'FEMTEN_TO',
    FEMTEN_TRE = 'FEMTEN_TRE',
    FEMTEN_FIRE = 'FEMTEN_FIRE',
    FEMTEN_FEM = 'FEMTEN_FEM',
    FEMTEN_SEKS = 'FEMTEN_SEKS',
    FEMTEN_ÅTTE = 'FEMTEN_ÅTTE',
    FEMTEN_NI = 'FEMTEN_NI',
    FEMTEN_TI = 'FEMTEN_TI',
    FEMTEN_ELLEVE = 'FEMTEN_ELLEVE',
    FEMTEN_TOLV = 'FEMTEN_TOLV',
    FEMTEN_TRETTEN = 'FEMTEN_TRETTEN',
    TO = 'TO',
    FIRE = 'FIRE',
    FEM = 'FEM',
    NI = 'NI',
    TRETTEN = 'TRETTEN',
    EØS = 'EØS',
}

export const hjemmelTilTekst: Record<Hjemmel, string> = {
    VELG: 'Velg',
    FEMTEN_TO: '§ 15-2',
    FEMTEN_TRE: '§ 15-3',
    FEMTEN_FIRE: '§ 15-4',
    FEMTEN_FEM: '§ 15-5',
    FEMTEN_SEKS: '§ 15-6',
    FEMTEN_ÅTTE: '§ 15-8',
    FEMTEN_NI: '§ 15-9',
    FEMTEN_TI: '§ 15-10',
    FEMTEN_ELLEVE: '§ 15-11',
    FEMTEN_TOLV: '§ 15-12',
    FEMTEN_TRETTEN: '§ 15-13',
    TO: '§ 2',
    FIRE: '§ 4',
    FEM: '§ 5',
    NI: '§ 9',
    TRETTEN: '§ 13',
    EØS: 'EØS',
};
