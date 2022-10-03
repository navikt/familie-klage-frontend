import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { ensure } from '../../../App/utils/utils';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilTekst,
    StegType,
} from '../../../App/typer/fagsak';

export const fjernDuplikatStegFraHistorikk = (steg: IBehandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                ensure(historikkListe.find((steg) => historikk.steg == steg.steg))
            )
        ),
    ];
    return visning.reverse();
};

export const utledTekstForTidslinje = (behandling: Behandling, steg: StegType) => {
    switch (steg) {
        case StegType.FORMKRAV:
            return behandling.resultat === BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST
                ? 'Formkrav - ikke oppfylt'
                : 'Formkrav - oppfylt';
        case StegType.VURDERING:
            return behandling.resultat === BehandlingResultat.MEDHOLD
                ? 'Vurdering - omgjør'
                : 'Vurdering - oppretthold';
        default:
            return behandlingStegTilTekst[steg];
    }
};
