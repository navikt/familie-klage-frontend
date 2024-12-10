export interface IOppgave {
    tilordnetRessurs?: string;
    mappeId?: number;
    fristFerdigstillelse?: string;
    prioritet?: Prioritet;
}

export type Prioritet = 'HOY' | 'NORM' | 'LAV';

export const prioritetTilTekst: Record<Prioritet, string> = {
    HOY: 'Høy',
    NORM: 'Normal',
    LAV: 'Lav',
};
