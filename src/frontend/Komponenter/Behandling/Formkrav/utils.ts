import { IFormVilkår, IRadioKnapper, Redigeringsmodus, VilkårStatus } from './typer';

export const utledRedigeringsmodus = (
    behandlingErRedigerbar: boolean,
    vurderinger: IFormVilkår
): Redigeringsmodus => {
    if (!behandlingErRedigerbar) {
        return Redigeringsmodus.VISNING;
    }
    if (alleVurderingerErStatus(vurderinger, VilkårStatus.IKKE_SATT)) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
};

export const alleVurderingerErStatus = (
    formkravVurdering: IFormVilkår,
    status: VilkårStatus
): boolean => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = formkravVurdering;
    return (
        klagePart === status &&
        klageKonkret === status &&
        klagefristOverholdt === status &&
        klageSignert === status
    );
};

export const utledRadioKnapper = (vurderinger: IFormVilkår): IRadioKnapper[] => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = vurderinger;
    return [
        {
            spørsmål: 'Er klager part i saken?',
            svar: klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket?',
            svar: klageKonkret,
            navn: 'klageKonkret',
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: klagefristOverholdt,
            navn: 'klagefristOverholdt',
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: klageSignert,
            navn: 'klageSignert',
        },
    ];
};
