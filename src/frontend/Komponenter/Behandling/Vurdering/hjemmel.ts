enum FolketrygdHjemmel {
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
    FT_TJUETO_TOLV = 'FT_TJUETO_TOLV',
    FT_TJUETO_TRETTEN = 'FT_TJUETO_TRETTEN',
    FT_TJUETO_FEMTEN = 'FT_TJUETO_FEMTEN',
}

enum BarnetrygdlovenHjemmel {
    BT_TO = 'BT_TO',
    BT_FIRE = 'BT_FIRE',
    BT_FEM = 'BT_FEM',
    BT_NI = 'BT_NI',
    BT_TI = 'BT_TI',
    BT_ELLEVE = 'BT_ELLEVE',
    BT_TOLV = 'BT_TOLV',
    BT_TRETTEN = 'BT_TRETTEN',
    BT_FJORTEN = 'BT_FJORTEN',
    BT_FEMTEN = 'BT_FEMTEN',
    BT_SYTTEN = 'BT_SYTTEN',
    BT_ATTEN = 'BT_ATTEN',
}

enum KontantstøttelovenHjemmel {
    KS_EN_A = 'KS_EN_A',
    KS_TO = 'KS_TO',
    KS_TRE = 'KS_TRE',
    KS_TRE_A = 'KS_TRE_A',
    KS_FIRE = 'KS_FIRE',
    KS_SEKS = 'KS_SEKS',
    KS_SYV = 'KS_SYV',
    KS_ÅTTE = 'KS_ÅTTE',
    KS_NI = 'KS_NI',
    KS_TI = 'KS_TI',
    KS_ELLEVE = 'KS_ELLEVE',
    KS_TOLV = 'KS_TOLV',
    KS_TRETTEN = 'KS_TRETTEN',
    KS_FJORTEN = 'KS_FJORTEN',
    KS_SEKSTEN = 'KS_SEKSTEN',
    KS_SYTTEN = 'KS_SYTTEN',
    KS_NITTEN = 'KS_NITTEN',
    KS_TJUETO = 'KS_TJUETO',
}

enum ForvaltningslovenHjemmel {
    FV_TJUEÅTTE = 'FV_TJUEÅTTE',
    FV_TJUENI = 'FV_TJUENI',
    FV_TRETTI = 'FV_TRETTI',
    FV_TRETTIEN = 'FV_TRETTIEN',
    FV_TRETTITO = 'FV_TRETTITO',
    FV_TRETTITRE = 'FV_TRETTITRE',
    FV_TRETTIFIRE = 'FV_TRETTIFIRE',
    FV_TRETTIFEM = 'FV_TRETTIFEM',
    FV_TRETTISEKS = 'FV_TRETTISEKS',
}

enum UtlandsavtalerHjemmel {
    UTLAND_EØS = 'UTLAND_EØS',
    UTLAND_NORDISK = 'UTLAND_NORDISK',
    UTLAND_TRYGDEAVTALER = 'UTLAND_TRYGDEAVTALER',
}

export type Hjemmel =
    | FolketrygdHjemmel
    | BarnetrygdlovenHjemmel
    | KontantstøttelovenHjemmel
    | UtlandsavtalerHjemmel;

const barnetrygdlovenVisningstekster: Record<BarnetrygdlovenHjemmel, string> = {
    BT_TO: '§ 2 Hvem som har rett til barnetrygd',
    BT_FIRE: '§ 4 Bosatt i riket, lovlig opphold mm.',
    BT_FEM: '§ 5 Medlemskap i folketrygden under utenlandsopphold',
    BT_NI: '§ 9 Utvidet barnetrygd',
    BT_TI: '§ 10 Barnetrygdens størrelse',
    BT_ELLEVE: '§ 11 Stønadsperiode',
    BT_TOLV: '§ 12 Utbetaling',
    BT_TRETTEN: '§ 13 Tilbakekreving',
    BT_FJORTEN: '§ 14 Krav om barnetrygd',
    BT_FEMTEN: '§ 15 Hvem avgjør søknad om barnetrygd. Klage og anke',
    BT_SYTTEN: '§ 17 Stønadsmottakers opplysningsplikt',
    BT_ATTEN: '§ 18 Uriktige opplysninger',
};

const kontantstøttelovenVisningstekster: Record<KontantstøttelovenHjemmel, string> = {
    KS_EN_A: '§ 1a Forholdet til bestemmelser om internasjonal trygdekoordinering',
    KS_TO: '§ 2 Vilkår knyttet til barnet',
    KS_TRE: '§ 3 Vilkår knyttet til støttemottaker',
    KS_TRE_A: '§ 3a Arbeidstakere på kontinentalsokkelen',
    KS_FIRE:
        '§ 4 Barn av tilsatt ved utenlandsk representasjon eller annen administrativ tjenestegren',
    KS_SEKS: '§ 6 Barn i fosterhjem eller institusjon',
    KS_SYV: '§ 7 Kontantstøttens størrelse',
    KS_ÅTTE: '§ 8 Stønadsperiode',
    KS_NI: '§ 9 Utbetaling av kontantstøtte - delt bosted',
    KS_TI: '§ 10 Utbetaling til adopterte barn',
    KS_ELLEVE: '§ 11 Tilbakekreving',
    KS_TOLV: '§ 12 Støttemottakerens opplysningsplikt',
    KS_TRETTEN: '§ 13 Avslag på søknad, stans i utbetalingen',
    KS_FJORTEN: '§ 14 Søknad om kontantstøtte',
    KS_SEKSTEN: '§ 16 Opplysningsplikt',
    KS_SYTTEN: '§ 17 Saksbehandling',
    KS_NITTEN: '§ 19 Forholdet mellom Arbeids- og velferdsetaten og kommunene',
    KS_TJUETO: '§ 22 Folkerettslige forpliktelser om trygdekoordinering',
};

const forvaltningslovenVisningstekster: Record<ForvaltningslovenHjemmel, string> = {
    FV_TJUEÅTTE: '§ 28 Vedtak som kan påklages, klageinstans',
    FV_TJUENI: '§ 29 Klagefrist',
    FV_TRETTI: '§ 30 Når klagen må være fremsatt',
    FV_TRETTIEN: '§ 31 Oversitting av klagefristen',
    FV_TRETTITO: '§ 32 Klagens adressat, form og innhold',
    FV_TRETTITRE: '§ 33 Saksforberedelsen i klagesak',
    FV_TRETTIFIRE: '§ 34 Klageinstansens kompetanse',
    FV_TRETTIFEM: '§ 35 Omgjøring av vedtak uten klage',
    FV_TRETTISEKS: '§ 36 Sakskostnader',
};

const utlandsavtalerHjemmelVisningstekster: Record<UtlandsavtalerHjemmel, string> = {
    UTLAND_EØS: 'EØS-regelverket',
    UTLAND_NORDISK: 'Nordisk konvensjon',
    UTLAND_TRYGDEAVTALER: 'Trygdeavtaler',
};

export const folketrygdHjemmelTilVisningstekst: Record<FolketrygdHjemmel, string> = {
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
    FT_TJUETO_TOLV:
        '§ 22-12 Tidspunkt for utbetaling når rett til en ytelse oppstår eller opphører',
    FT_TJUETO_TRETTEN:
        '§ 22-13 Frister for framsetting av krav, virkningstidspunkt og etterbetaling',
    FT_TJUETO_FEMTEN: '§ 22-15 Tilbakekreving',
};

export const baHjemlerTilVisningstekst: Record<
    BarnetrygdlovenHjemmel | UtlandsavtalerHjemmel | ForvaltningslovenHjemmel.FV_TRETTIFEM,
    string
> = {
    ...barnetrygdlovenVisningstekster,
    ...utlandsavtalerHjemmelVisningstekster,
    FV_TRETTIFEM: forvaltningslovenVisningstekster.FV_TRETTIFEM,
};

export const ksHjemlerTilVisningstekst: Record<
    KontantstøttelovenHjemmel | UtlandsavtalerHjemmel | ForvaltningslovenHjemmel,
    string
> = {
    ...kontantstøttelovenVisningstekster,
    ...forvaltningslovenVisningstekster,
    ...utlandsavtalerHjemmelVisningstekster,
};

export const alleHjemlerTilVisningstekst: Record<Hjemmel, string> = {
    ...folketrygdHjemmelTilVisningstekst,
    ...barnetrygdlovenVisningstekster,
    ...kontantstøttelovenVisningstekster,
    ...utlandsavtalerHjemmelVisningstekster,
};
