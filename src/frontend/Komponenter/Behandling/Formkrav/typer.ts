import { PåklagetVedtak } from '../../../App/typer/fagsak';

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

export interface IRadioKnapper {
    spørsmål: string;
    svar: VilkårStatus;
    navn: string;
}

export interface IFormkravVilkår {
    behandlingId: string;
    klagePart: VilkårStatus;
    klageKonkret: VilkårStatus;
    klagefristOverholdt: VilkårStatus;
    klageSignert: VilkårStatus;
    saksbehandlerBegrunnelse: string;
    påklagetVedtak: PåklagetVedtak;
    endretTid: string;
}

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}
