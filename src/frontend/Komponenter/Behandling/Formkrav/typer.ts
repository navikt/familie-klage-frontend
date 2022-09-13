export enum VilkårStatus {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
    IKKE_SATT = 'IKKE_SATT',
}

export const vilkårStatusTilTekst: Record<VilkårStatus, string> = {
    OPPFYLT: 'Oppfylt',
    IKKE_OPPFYLT: 'Ikke oppfylt',
    SKAL_IKKE_VURDERES: 'Skal ikke vurderes',
    IKKE_SATT: 'Ikke satt',
};

export interface IRadioKnapper {
    spørsmål: string;
    svar: VilkårStatus;
    navn: string;
}

export interface IFormkravVilkår {
    behandlingId: string;
    fagsakId: string;
    klagePart: VilkårStatus;
    klageKonkret: VilkårStatus;
    klagefristOverholdt: VilkårStatus;
    klageSignert: VilkårStatus;
    saksbehandlerBegrunnelse: string;
    endretTid: string;
}

export interface IKlageInfo {
    behandlingId: string;
    fagsakId: string;
    vedtaksDato: string;
    klageMottatt: string;
    klageAarsak: string;
    klageBeskrivelse: string;
}

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}
