import {
    Behandling,
    BehandlingResultat,
    Fagsystem,
    Klagebehandlingsårsak,
    StegType,
} from '../App/typer/fagsak';
import { BehandlingStatus } from '../App/typer/behandlingstatus';
import { Stønadstype } from '../App/typer/stønadstype';
import { PåklagetVedtakTestdata } from './påklagetVedtakTestdata';

export function lagBehandling(behandling?: Partial<Behandling>): Behandling {
    return {
        id: '54f95e94-9215-474b-9882-f6e992a9d3cc',
        fagsakId: '432d7bb9-be04-4554-8e73-ba95343d28ad',
        steg: StegType.OPPRETTET,
        status: BehandlingStatus.OPPRETTET,
        sistEndret: '2025-05-02T10:30:00.000',
        opprettet: '2025-05-02T10:30:00.000',
        resultat: BehandlingResultat.IKKE_SATT,
        vedtakDato: undefined,
        stønadstype: Stønadstype.BARNETRYGD,
        klageinstansResultat: [],
        påklagetVedtak: PåklagetVedtakTestdata.lagPåklagetVedtak(),
        eksternFagsystemFagsakId: '123456789',
        fagsystem: Fagsystem.BA,
        klageMottatt: '2025-05-02T10:00:00.000',
        fagsystemRevurdering: undefined,
        årsak: Klagebehandlingsårsak.ORDINÆR,
        behandlendeEnhet: '4833',
        ...behandling,
    };
}

export * as BehandlingTestdata from './behandlingTestdata';
