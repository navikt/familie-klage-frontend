import { HistorikkHendelse, StegType } from '../../../App/typer/fagsak';

export interface IBehandlingshistorikk {
    behandlingId: string;
    steg: StegType;
    historikkHendelse?: HistorikkHendelse;
    opprettetAv: string;
    endretTid: string;
}
