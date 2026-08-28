import type { Behandling } from '../../../App/typer/fagsak';
import { BehandlingResultat, behandlingStegTilRekkefølge } from '../../../App/typer/fagsak';
import type { ISide } from './sider';
import { SideNavn } from './sider';

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
