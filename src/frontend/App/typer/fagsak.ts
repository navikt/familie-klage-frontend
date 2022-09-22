import { Stønadstype } from './behandlingstema';
import { BehandlingStatus } from './behandlingstatus';

export interface Fagsak {
    id: string;
    eksternId: number;
    fagsakPersonId: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: Behandling[];
    erLøpende: boolean;
    erMigrert: boolean;
    fagsystem: Fagsystem;
}

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

export const behandlingStegInformasjonTilTekst: Record<StegType, string> = {
    FORMKRAV: 'Formkrav avgjør om klagen er gyldig eller ikke',
    VURDERING: 'Vurdering er saksbehandlers vurdering av klagen',
    BREV: 'Brev blir skrevet og gjort klart til sending',
    OVERFØRING_TIL_KABAL: 'Behandlingen er overført til kabal',
    KABAL_VENTER_SVAR: 'Behandlingen har mottatt svar fra kabal',
    BEHANDLING_FERDIGSTILT: 'Behandling er ferdig og klageresultat er oppdatert',
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
}

export interface IEndringerRegistergrunnlag {
    [key: string]: string[];
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
