import {
    FormkravTilstand,
    IFormkravVilkår,
    IRadioKnapper,
    Redigeringsmodus,
    VilkårStatus,
} from './typer';
import { Behandling, PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { harVerdi } from '../../../App/utils/utils';

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

export const alleVilkårOppfylt = (vurderinger: IFormkravVilkår) => {
    return (
        påKlagetVedtakValgt(vurderinger) &&
        alleVurderingerErStatus(vurderinger, VilkårStatus.OPPFYLT)
    );
};

export const påKlagetVedtakValgt = (vurderinger: IFormkravVilkår) => {
    return vurderinger.påklagetVedtak.påklagetVedtakstype !== PåklagetVedtakstype.IKKE_VALGT;
};

export const begrunnelseUtfylt = (vurderinger: IFormkravVilkår) => {
    return harVerdi(vurderinger.saksbehandlerBegrunnelse);
};

export const utledFormkravTilstand = (vuderinger: IFormkravVilkår, behandling: Behandling) => {
    return FormkravTilstand.IKKE_PÅSTARTET;
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

export const utledRadioKnapper = (vurderinger: IFormkravVilkår): IRadioKnapper[] => {
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

export const utledIkkeUtfylteVilkår = (vilkår: IFormkravVilkår) => {
    return utledRadioKnapper(vilkår).filter((valg) => valg.svar === VilkårStatus.IKKE_SATT);
};
