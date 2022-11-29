import { PåklagetVedtakstype } from '../../../App/typer/fagsak';

export enum VilkårStatus {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_SATT = 'IKKE_SATT',
}

export const vilkårStatusTilTekst: Record<VilkårStatus, string> = {
    OPPFYLT: 'Oppfylt',
    IKKE_OPPFYLT: 'Ikke oppfylt',
    IKKE_SATT: 'Ikke satt',
};

export interface IFormalkrav {
    spørsmål: string;
    svar: VilkårStatus;
    navn: string;
    type: EFormalKravType;
}

export enum EFormalKravType {
    KLAGER_ER_PART = 'KLAGER_ER_PART',
    KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK = 'KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK',
    KLAGEFRIST_OVERHOLDT = 'KLAGEFRIST_OVERHOLDT',
    KLAGE_SIGNERT = 'KLAGE_SIGNERT',
}

export interface IFormkravVilkår {
    behandlingId: string;
    klagePart: VilkårStatus;
    klageKonkret: VilkårStatus;
    klagefristOverholdt: VilkårStatus;
    klageSignert: VilkårStatus;
    saksbehandlerBegrunnelse?: string;
    brevtekst?: string;
    påklagetVedtak: PåklagetVedtak;
    endretTid: string;
}

export interface PåklagetVedtak {
    eksternFagsystemBehandlingId?: string;
    påklagetVedtakstype: PåklagetVedtakstype;
}

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}

export enum FagsystemType {
    ORDNIÆR = 'ORDNIÆR',
    TILBAKEKREVING = 'TILBAKEKREVING',
}
