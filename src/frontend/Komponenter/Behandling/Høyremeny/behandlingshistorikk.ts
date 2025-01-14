import { StegType } from '../../../App/typer/fagsak';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';

export interface IBehandlingshistorikk {
    behandlingId: string;
    steg: StegType;
    behandlingStatus?: BehandlingStatus;
    opprettetAv: string;
    endretTid: string;
}
