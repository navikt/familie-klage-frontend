export interface IOppgave {
    oppgaveId: number;
    tildeltEnhetsnr?: string;
    tilordnetRessurs?: string;
    mappeId?: number;
    fristFerdigstillelse?: string;
    prioritet?: Prioritet;
    beskrivelse: string;
}

export type Prioritet = 'HOY' | 'NORM' | 'LAV';

export const prioritetTilTekst: Record<Prioritet, string> = {
    HOY: 'Høy',
    NORM: 'Normal',
    LAV: 'Lav',
};
