export interface IFormvilkårKomponent {
    behandlingId: string;
    settFormkravGyldig: (value: boolean) => void;
    låst: boolean;
    settLåst: (value: boolean) => void;
}

export interface IVilkårNullstill {
    behandlingId: string;
    klagePart: VilkårStatus;
    klageKonkret: VilkårStatus;
    klagefristOverholdt: VilkårStatus;
    klageSignert: VilkårStatus;
    saksbehandlerBegrunnelse: string;
}

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

export interface IRadioKnapperLeseModus {
    radioKnapper: IRadioKnapper[];
    redigerHandling: (value: boolean) => void;
    saksbehandlerBegrunnelse: string;
    endretTid: string;
    behandlingId: string;
}

export const datoFormatering = (dato: Date) => {
    return dato.getDay() + '.' + dato.getMonth() + '.' + dato.getFullYear();
};

export interface IFormVilkår {
    behandlingId: string;
    fagsakId: string;
    klagePart: VilkårStatus;
    klageKonkret: VilkårStatus;
    klagefristOverholdt: VilkårStatus;
    klageSignert: VilkårStatus;
    saksbehandlerBegrunnelse: string;
    endretTid: string;
}

export interface IFormKlage {
    behandlingId: string;
    fagsakId: string;
    vedtaksDato: string;
    klageMottatt: string;
    klageAarsak: string;
    klageBeskrivelse: string;
}
