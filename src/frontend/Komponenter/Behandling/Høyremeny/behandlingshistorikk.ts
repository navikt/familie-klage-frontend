import { StegType } from '../../../App/typer/fagsak';

export interface IBehandlingshistorikk {
    id: string;
    behandlingId: string;
    steg: StegType;
    opprettetAv: string;
    endretTid: string;
}
