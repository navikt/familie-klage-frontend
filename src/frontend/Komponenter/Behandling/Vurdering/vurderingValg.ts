export interface IVurdering {
    behandlingId: string;
    vedtak?: VedtakValg;
    årsak?: ÅrsakOmgjøring;
    begrunnelseOmgjøring?: string;
    hjemmel?: Hjemmel;
    innstillingKlageinstans?: string;
    interntNotat?: string;
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
export enum ÅrsakOmgjøring {
    FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
    ANNET = 'ANNET',
}

export const årsakValgTilTekst: Record<ÅrsakOmgjøring, string> = {
    FEIL_I_LOVANDVENDELSE: 'Feil lovanvendelse',
    FEIL_REGELVERKSFORSTÅELSE: 'Feil regelverksforståelse',
    FEIL_ELLER_ENDRET_FAKTA: 'Feil eller endret fakta',
    FEIL_PROSESSUELL: 'Prosessuell feil',
    ANNET: 'Annet',
};

export enum Hjemmel {
    FT_FEMTEN_TO = 'FT_FEMTEN_TO',
    FT_FEMTEN_TRE = 'FT_FEMTEN_TRE',
    FT_FEMTEN_FIRE = 'FT_FEMTEN_FIRE',
    FT_FEMTEN_FEM = 'FT_FEMTEN_FEM',
    FT_FEMTEN_SEKS = 'FT_FEMTEN_SEKS',
    FT_FEMTEN_ÅTTE = 'FT_FEMTEN_ÅTTE',
    FT_FEMTEN_NI = 'FT_FEMTEN_NI',
    FT_FEMTEN_TI = 'FT_FEMTEN_TI',
    FT_FEMTEN_ELLEVE = 'FT_FEMTEN_ELLEVE',
    FT_FEMTEN_TOLV = 'FT_FEMTEN_TOLV',
    FT_FEMTEN_TRETTEN = 'FT_FEMTEN_TRETTEN',
    FT_TJUETO_FEMTEN = 'FT_TJUETO_FEMTEN',
    BT_TO = 'BT_TO',
    BT_FIRE = 'BT_FIRE',
    BT_FEM = 'BT_FEM',
    BT_NI = 'BT_NI',
    BT_TRETTEN = 'BT_TRETTEN',
    FT_EØS = 'FT_EØS',
    FT_EØS_FOR = 'FT_EØS_FOR',
}

export const hjemmelTilTekst: Record<Hjemmel, string> = {
    FT_FEMTEN_TO: '§ 15-2 Forutgående medlemskap',
    FT_FEMTEN_TRE: '§ 15-3 Opphold i Norge',
    FT_FEMTEN_FIRE: '§ 15-4 Enslig mor eller far',
    FT_FEMTEN_FEM: '§ 15-5 Overgangsstønad',
    FT_FEMTEN_SEKS: '§ 15-6 Plikt til yrkesrettet aktivitet',
    FT_FEMTEN_ÅTTE: '§ 15-8 Stønadsperiode',
    FT_FEMTEN_NI: '§ 15-9 Avkorting mot inntekt',
    FT_FEMTEN_TI: '§ 15-10 Stønad til barnetilsyn',
    FT_FEMTEN_ELLEVE: '§ 15-11 Stønad til skolepenger',
    FT_FEMTEN_TOLV: '§ 15-12 Sanksjon',
    FT_FEMTEN_TRETTEN: '§ 15-13 Forholdet til andre folketrygdytelser',
    FT_TJUETO_FEMTEN: '§ 22-15 Tilbakekreving',
    BT_TO: '§ 2',
    BT_FIRE: '§ 4',
    BT_FEM: '§ 5',
    BT_NI: '§ 9',
    BT_TRETTEN: '§ 13',
    FT_EØS: 'EØS-avtalen',
    FT_EØS_FOR: 'EØS art. 6',
};
