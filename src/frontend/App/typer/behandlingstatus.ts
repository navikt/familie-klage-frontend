import { Behandling } from './fagsak';

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
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES].includes(behandling.status);

export const erBehandlingUnderArbeid = (behandling: Behandling): boolean =>
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES].includes(behandling.status);
