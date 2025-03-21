import { BehandlingStatus } from './behandlingstatus';
import { BehandlingResultat } from './fagsak';

export interface KlagebehandlingsResultat {
    id: string;
    fagsakId: string;
    fagsakPersonId: string;
    status: BehandlingStatus;
    opprettet: string;
    mottattDato: string;
    resultat: BehandlingResultat;
    vedtaksdato: string | undefined;
}
