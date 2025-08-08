import { ISide, SideNavn } from './sider';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilRekkefølge,
} from '../../../App/typer/fagsak';

export const utledFaneErLåst = (
    side: ISide,
    behandling: Behandling,
    formkravErOppfylt: boolean
): boolean => {
    if (side.navn === SideNavn.VURDERING) {
        return !formkravErOppfylt;
    }
    if (side.navn === SideNavn.BREV && behandling.resultat === BehandlingResultat.HENLAGT) {
        return true;
    }
    return side.rekkefølge > behandlingStegTilRekkefølge[behandling.steg];
};
