import { IFormVilkår, Redigeringsmodus, VilkårStatus } from './typer';

export const utledRedigeringsmodus = (
    feilmelding: boolean,
    behandlingErRedigerbar: boolean,
    formkravVurdering: IFormVilkår
): Redigeringsmodus => {
    if (!behandlingErRedigerbar) {
        return Redigeringsmodus.VISNING;
    }
    if (feilmelding) {
        return Redigeringsmodus.REDIGERING;
    }
    if (ikkePåstartet(formkravVurdering)) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
};

const ikkePåstartet = (formkravVurdering: IFormVilkår): boolean => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = formkravVurdering;
    return (
        klagePart === VilkårStatus.IKKE_SATT &&
        klageKonkret === VilkårStatus.IKKE_SATT &&
        klagefristOverholdt === VilkårStatus.IKKE_SATT &&
        klageSignert === VilkårStatus.IKKE_SATT
    );
};
