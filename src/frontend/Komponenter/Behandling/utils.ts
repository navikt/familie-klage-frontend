import { Behandling, BehandlingResultat, StegType } from '../../App/typer/fagsak';
import { utledTekstForEksternutfall } from './Resultat/utils';

export const utledStegutfall = (behandling: Behandling, steg: StegType) => {
    switch (steg) {
        case StegType.FORMKRAV:
            return behandling.resultat === BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST
                ? 'Ikke oppfylt'
                : 'Oppfylt';
        case StegType.VURDERING:
            return behandling.resultat === BehandlingResultat.MEDHOLD ? 'Omgjør' : 'Oppretthold';
        case StegType.BEHANDLING_FERDIGSTILT:
            return utledTekstForEksternutfall(behandling);
    }
};
