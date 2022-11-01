import { IFormkravVilkår, Redigeringsmodus, VilkårStatus } from './typer';
import { PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { harVerdi } from '../../../App/utils/utils';
import { utledRadioKnapper } from './utils';

export const alleVurderingerErStatus = (
    formkravVurdering: IFormkravVilkår,
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

export const påKlagetVedtakValgt = (vurderinger: IFormkravVilkår) => {
    return vurderinger.påklagetVedtak.påklagetVedtakstype !== PåklagetVedtakstype.IKKE_VALGT;
};

export const alleVilkårOppfylt = (vurderinger: IFormkravVilkår) => {
    return alleVurderingerErStatus(vurderinger, VilkårStatus.OPPFYLT);
};

export const alleVilkårTattStillingTil = (vurderinger: IFormkravVilkår) => {
    return utledIkkeUtfylteVilkår(vurderinger).length === 0;
};

export const begrunnelseUtfylt = (vurderinger: IFormkravVilkår) => {
    return harVerdi(vurderinger.saksbehandlerBegrunnelse);
};

export const brevtekstUtfylt = (vurderinger: IFormkravVilkår) => {
    return harVerdi(vurderinger.brevtekst);
};

export const utledRedigeringsmodus = (
    behandlingErRedigerbar: boolean,
    vurderinger: IFormkravVilkår
): Redigeringsmodus => {
    if (!behandlingErRedigerbar) {
        return Redigeringsmodus.VISNING;
    }
    if (alleVurderingerErStatus(vurderinger, VilkårStatus.IKKE_SATT)) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
};

export const utledIkkeUtfylteVilkår = (vilkår: IFormkravVilkår) => {
    return utledRadioKnapper(vilkår).filter((valg) => valg.svar === VilkårStatus.IKKE_SATT);
};
