import { Behandling, StegType } from './fagsak';
import { AnsvarligSaksbehandler, AnsvarligSaksbehandlerRolle } from './saksbehandler';

export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    VENTER: 'Venter',
    FERDIGSTILT: 'Ferdigstilt',
};

export const erBehandlingRedigerbar = (behandling: Behandling): boolean =>
    [StegType.FORMKRAV, StegType.VURDERING, StegType.BREV].includes(behandling.steg);

export const innloggetSaksbehandlerKanRedigereBehandling = (
    ansvarligSaksbehandler: AnsvarligSaksbehandler
) => {
    return (
        ansvarligSaksbehandler.rolle === AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER ||
        ansvarligSaksbehandler.rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE
    );
};
