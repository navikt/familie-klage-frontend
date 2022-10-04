import { Stønadstype } from './behandlingstema';
import { BehandlingStatus } from './behandlingstatus';
import { Klageresultat } from './klageresultat';

export enum Fagsystem {
    EF = 'EF',
    BA = 'BA',
    KS = 'KS',
}

export enum StegType {
    FORMKRAV = 'FORMKRAV',
    VURDERING = 'VURDERING',
    BREV = 'BREV',
    OVERFØRING_TIL_KABAL = 'OVERFØRING_TIL_KABAL',
    KABAL_VENTER_SVAR = 'KABAL_VENTER_SVAR',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}

export const behandlingStegTilRekkefølge: Record<StegType, number> = {
    FORMKRAV: 1,
    VURDERING: 2,
    BREV: 3,
    OVERFØRING_TIL_KABAL: 4,
    KABAL_VENTER_SVAR: 4,
    BEHANDLING_FERDIGSTILT: 4,
};

export const behandlingStegTilTekst: Record<StegType, string> = {
    FORMKRAV: 'Formkrav',
    VURDERING: 'Vurdering',
    BREV: 'Brev',
    OVERFØRING_TIL_KABAL: 'Overført til kabal',
    KABAL_VENTER_SVAR: 'Venter på svar fra kabal',
    BEHANDLING_FERDIGSTILT: 'Fullført',
};

export const behandlingStegFullførtTilTekst: Record<StegType, string> = {
    FORMKRAV: 'Formkrav er oppdatert',
    VURDERING: 'Vurdering er oppdatert',
    BREV: 'Brev er oppdatert',
    OVERFØRING_TIL_KABAL: 'Overført til kabal',
    KABAL_VENTER_SVAR: 'Mottatt svar fra kabal',
    BEHANDLING_FERDIGSTILT: 'Klagen er ferdigstilt',
};

export interface Behandling {
    id: string;
    fagsakId: string;
    steg: StegType;
    status: BehandlingStatus;
    sistEndret: string;
    opprettet: string;
    resultat: BehandlingResultat;
    vedtakDato?: string;
    stønadstype: Stønadstype;
    klageresultat: Klageresultat[];
}

export enum BehandlingResultat {
    MEDHOLD = 'MEDHOLD',
    IKKE_MEDHOLD = 'IKKE_MEDHOLD',
    IKKE_MEDHOLD_FORMKRAV_AVVIST = 'IKKE_MEDHOLD_FORMKRAV_AVVIST',
    IKKE_SATT = 'IKKE_SATT',
}

export const behandlingResultatTilTekst: Record<BehandlingResultat, string> = {
    MEDHOLD: 'Medhold',
    IKKE_MEDHOLD: 'Ikke medhold',
    IKKE_MEDHOLD_FORMKRAV_AVVIST: 'Ikke medhold formkrav avvist',
    IKKE_SATT: 'Ikke satt',
};
