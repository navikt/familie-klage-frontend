import { Behandling, BehandlingResultat, StegType } from '../../App/typer/fagsak';
import { utledTekstForEksternutfall } from './Resultat/utils';
import { IVurdering, vedtakValgTilTekst } from './Vurdering/vurderingValg';

export const utledStegutfallForIkkeFerdigstiltBehandling = (
    steg: StegType,
    formKravOppfylt: boolean,
    vurdering: IVurdering
) => {
    switch (steg) {
        case StegType.FORMKRAV:
            return formKravOppfylt ? 'Oppfylt' : 'Ikke oppfylt';
        case StegType.VURDERING:
            return vurdering.vedtak ? vedtakValgTilTekst[vurdering.vedtak] : '';
        default:
            return '';
    }
};

export const utledStegutfallForFerdigstiltBehandling = (behandling: Behandling, steg: StegType) => {
    switch (steg) {
        case StegType.FORMKRAV:
            return behandling.resultat === BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST
                ? 'Ikke oppfylt'
                : 'Oppfylt';
        case StegType.VURDERING:
            return behandling.resultat === BehandlingResultat.MEDHOLD
                ? 'Omgjør vedtak'
                : 'Oppretthold vedtak';
        case StegType.BEHANDLING_FERDIGSTILT:
            return utledTekstForEksternutfall(behandling);
        default:
            return '';
    }
};
