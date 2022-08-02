import { Behandling, StegType } from './fagsak';

export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    FERDIGSTILT = 'FERDIGSTILT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    FERDIGSTILT: 'Ferdigstilt',
};

export const erBehandlingRedigerbar = (behandling: Behandling): boolean =>
    [StegType.FORMKRAV, StegType.VURDERING, StegType.BREV].includes(behandling.steg);
