import { Stønadstype } from './stønadstype';
import { BehandlingStatus } from './behandlingstatus';
import { PåklagetVedtak } from '../../Komponenter/Behandling/Formkrav/typer';

export enum Fagsystem {
    EF = 'EF',
    BA = 'BA',
    KS = 'KS',
}

export enum StegType {
    OPPRETTET = 'OPPRETTET',
    FORMKRAV = 'FORMKRAV',
    VURDERING = 'VURDERING',
    BREV = 'BREV',
    OVERFØRING_TIL_KABAL = 'OVERFØRING_TIL_KABAL',
    KABAL_VENTER_SVAR = 'KABAL_VENTER_SVAR',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}

export const behandlingStegTilRekkefølge: Record<StegType, number> = {
    OPPRETTET: 0,
    FORMKRAV: 1,
    VURDERING: 2,
    BREV: 3,
    OVERFØRING_TIL_KABAL: 4,
    KABAL_VENTER_SVAR: 4,
    BEHANDLING_FERDIGSTILT: 4,
};

export const behandlingStegTilTekst: Record<StegType, string> = {
    OPPRETTET: 'Opprettet',
    FORMKRAV: 'Formkrav',
    VURDERING: 'Vurdering',
    BREV: 'Brev',
    OVERFØRING_TIL_KABAL: 'Overført til NAV klageinstans',
    KABAL_VENTER_SVAR: 'Venter på svar fra NAV klageinstans',
    BEHANDLING_FERDIGSTILT: 'Fullført',
};

export const behandlingStegFullførtTilTekst: Record<StegType, string> = {
    OPPRETTET: 'Behandling er opprettet',
    FORMKRAV: 'Formkrav er oppdatert',
    VURDERING: 'Vurdering er oppdatert',
    BREV: 'Brev er oppdatert',
    OVERFØRING_TIL_KABAL: 'Overført til NAV klageinstans',
    KABAL_VENTER_SVAR: 'Mottatt svar fra NAV klageinstans',
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
    klageinstansResultat: KlageinstansResultat[];
    påklagetVedtak: PåklagetVedtak;
    eksternFagsystemFagsakId: string;
    fagsystem: Fagsystem;
    klageMottatt: string;
    fagsystemRevurdering?: FagsystemRevurdering;
    årsak: Klagebehandlingsårsak;
    behandlendeEnhet: string;
}

export enum Klagebehandlingsårsak {
    ORDINÆR = 'ORDINÆR',
    HENVENDELSE_FRA_KABAL = 'HENVENDELSE_FRA_KABAL',
}

export const klagebehandlingsårsakTilTekst: Record<Klagebehandlingsårsak, string> = {
    ORDINÆR: 'Ordinær',
    HENVENDELSE_FRA_KABAL: 'Henvendelse fra KA (uten brev)',
};

export enum PåklagetVedtakstype {
    VEDTAK = 'VEDTAK',
    INFOTRYGD_TILBAKEKREVING = 'INFOTRYGD_TILBAKEKREVING',
    UTEN_VEDTAK = 'UTEN_VEDTAK',
    IKKE_VALGT = 'IKKE_VALGT',
    UTESTENGELSE = 'UTESTENGELSE',
    INFOTRYGD_ORDINÆRT_VEDTAK = 'INFOTRYGD_ORDINÆRT_VEDTAK',
    AVVIST_KLAGE = 'AVVIST_KLAGE',
}

export const påklagetVedtakstypeTilTekst: Record<PåklagetVedtakstype, string> = {
    IKKE_VALGT: 'Ikke valgt',
    INFOTRYGD_TILBAKEKREVING: 'Tilbakekreving i Infotrygd',
    UTEN_VEDTAK: 'Har ikke klaget på et vedtak',
    VEDTAK: 'Vedtak',
    UTESTENGELSE: 'Utestengelse',
    INFOTRYGD_ORDINÆRT_VEDTAK: 'Ordinært stønadsvedtak i Infotrygd',
    AVVIST_KLAGE: 'Avvist klage',
};

export enum BehandlingResultat {
    MEDHOLD = 'MEDHOLD',
    IKKE_MEDHOLD = 'IKKE_MEDHOLD',
    IKKE_MEDHOLD_FORMKRAV_AVVIST = 'IKKE_MEDHOLD_FORMKRAV_AVVIST',
    IKKE_SATT = 'IKKE_SATT',
    HENLAGT = 'HENLAGT',
}

export const behandlingResultatTilTekst: Record<BehandlingResultat, string> = {
    MEDHOLD: 'Medhold',
    IKKE_MEDHOLD: 'Oversendt til KA',
    IKKE_MEDHOLD_FORMKRAV_AVVIST: 'Ikke medhold formkrav avvist',
    IKKE_SATT: 'Ikke satt',
    HENLAGT: 'Henlagt',
};

export interface KlageinstansResultat {
    type: KlageinstansEventType;
    utfall?: KlageinstansUtfall;
    mottattEllerAvsluttetTidspunkt: string;
    journalpostReferanser: string[];
    årsakFeilregistrert?: string;
}

export enum KlageinstansEventType {
    KLAGEBEHANDLING_AVSLUTTET = 'KLAGEBEHANDLING_AVSLUTTET',
    ANKEBEHANDLING_OPPRETTET = 'ANKEBEHANDLING_OPPRETTET',
    ANKEBEHANDLING_AVSLUTTET = 'ANKEBEHANDLING_AVSLUTTET',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET = 'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET',
    BEHANDLING_FEILREGISTRERT = 'BEHANDLING_FEILREGISTRERT',
}

export const klagehendelseTypeTilTekst: Record<KlageinstansEventType, string> = {
    KLAGEBEHANDLING_AVSLUTTET: 'Klagebehandling avsluttet',
    ANKEBEHANDLING_OPPRETTET: 'Ankebehandling opprettet',
    ANKEBEHANDLING_AVSLUTTET: 'Ankebehandling avsluttet',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET: 'Anke i trygderettenbehandling opprettet',
    BEHANDLING_FEILREGISTRERT: 'Behandling feilregistrert',
};

export enum KlageinstansUtfall {
    TRUKKET = 'TRUKKET',
    RETUR = 'RETUR',
    OPPHEVET = 'OPPHEVET',
    MEDHOLD = 'MEDHOLD',
    DELVIS_MEDHOLD = 'DELVIS_MEDHOLD',
    STADFESTELSE = 'STADFESTELSE',
    UGUNST = 'UGUNST',
    AVVIST = 'AVVIST',
}

export const utfallTilTekst: Record<KlageinstansUtfall, string> = {
    TRUKKET: 'Trukket KA',
    RETUR: 'Retur KA',
    OPPHEVET: 'Opphevet KA',
    MEDHOLD: 'Medhold KA',
    DELVIS_MEDHOLD: 'Delvis medhold KA',
    STADFESTELSE: 'Stadfestelse KA',
    UGUNST: 'Ugunst (Ugyldig) KA',
    AVVIST: 'Avvist KA',
};

export type FagsystemRevurdering =
    | {
          opprettetBehandling: true;
          opprettet: { eksternBehandlingId: string; opprettetTid: string };
      }
    | {
          opprettetBehandling: false;
          ikkeOpprettet: { årsak: RevurderingIkkeOpprettetÅrsak; detaljer: string };
      };

export enum RevurderingIkkeOpprettetÅrsak {
    ÅPEN_BEHANDLING = 'ÅPEN_BEHANDLING',
    INGEN_BEHANDLING = 'INGEN_BEHANDLING',
    FEIL = 'FEIL',
}

export const revurderingIkkeOpprettetÅrsak: Record<RevurderingIkkeOpprettetÅrsak, string> = {
    ÅPEN_BEHANDLING: 'Åpen behandling',
    INGEN_BEHANDLING: 'Ingen behandling',
    FEIL: 'Uventet feil',
};

export enum HistorikkHendelse {
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
    TATT_AV_VENT = 'TATT_AV_VENT',
    BEHANDLENDE_ENHET_ENDRET = 'BEHANDLENDE_ENHET_ENDRET',
}

export const hendelseHistorikkTilTekst: Record<HistorikkHendelse, string> = {
    SATT_PÅ_VENT: 'Satt på vent',
    TATT_AV_VENT: 'Tatt av vent',
    BEHANDLENDE_ENHET_ENDRET: 'Behandlende enhet endret',
};
