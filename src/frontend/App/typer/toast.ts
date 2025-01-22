export enum EToast {
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    BEHANDLING_HENLAGT = 'BEHANDLING_HENLAGT',
    TILBAKEKREVING_OPPRETTET = 'TILBAKEKREVING_OPPRETTET',
    BREVMOTTAKERE_SATT = 'BREVMOTTAKERE_SATT',
    BEHANDLING_SATT_PÅ_VENT = 'BEHANDLING_SATT_PÅ_VENT',
    BEHANDLING_TATT_AV_VENT = 'BEHANDLING_TATT_AV_VENT',
}

export const toastTilTekst: Record<EToast, string> = {
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    BEHANDLING_HENLAGT: 'Behandlingen er henlagt',
    TILBAKEKREVING_OPPRETTET:
        'Tilbakekreving blir opprettet. NB! Det kan ta litt tid før du kan se den i behandlingsoversikten.',
    BREVMOTTAKERE_SATT: 'Brevmottakere er satt',
    BEHANDLING_SATT_PÅ_VENT: 'Oppgaven er oppdatert og behandlingen er satt på vent',
    BEHANDLING_TATT_AV_VENT: 'Behandlingen er tatt av vent. Du er satt som ansvarlig saksbehandler',
};
