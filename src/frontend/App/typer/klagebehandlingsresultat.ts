import type { BehandlingStatus } from './behandlingstatus';
import type { BehandlingResultat } from './fagsak';

export interface Klagebehandlingsresultat {
    id: string;
    fagsakId: string;
    fagsakPersonId: string;
    status: BehandlingStatus;
    opprettet: string;
    mottattDato: string;
    resultat: BehandlingResultat;
    vedtaksdato: string | undefined;
}
