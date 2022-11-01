import {
    Behandling,
    BehandlingResultat,
    behandlingResultatTilTekst,
    StegType,
} from '../../App/typer/fagsak';
import { IVurdering, vedtakValgTilTekst } from './Vurdering/vurderingValg';
import { utledTekstForEksternutfall } from './Resultat/utils';

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
            return behandling.resultat === BehandlingResultat.IKKE_MEDHOLD
                ? utledTekstForEksternutfall(behandling) || ''
                : behandlingResultatTilTekst[behandling.resultat];
        default:
            return '';
    }
};
