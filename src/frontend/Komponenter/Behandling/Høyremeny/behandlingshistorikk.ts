import { HistorikkHendelse, StegType } from '../../../App/typer/fagsak';

export interface IBehandlingshistorikk {
    behandlingId: string;
    steg: StegType;
    historikkHendelse?: HistorikkHendelse;
    beskrivelse?: string;
    opprettetAv: string;
    endretTid: string;
}

export type HøyremenyHendelse = StegType | HistorikkHendelse;
