import { Behandling, StegType } from './fagsak';
import { AnsvarligSaksbehandler, AnsvarligSaksbehandlerRolle } from './saksbehandler';

export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
    FATTER_VEDTAK = 'FATTER_VEDTAK',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    VENTER: 'Venter',
    FERDIGSTILT: 'Ferdigstilt',
    FATTER_VEDTAK: 'Fatter vedtak',
    SATT_PÅ_VENT: 'Satt på vent',
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

export const utredesEllerFatterVedtak = (behandling: Behandling): boolean =>
    [BehandlingStatus.UTREDES, BehandlingStatus.FATTER_VEDTAK].includes(behandling.status);
