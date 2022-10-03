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
    ].reverse();

    const venterPåSvarFraKabal = visning[visning.length - 1].steg === StegType.OVERFØRING_TIL_KABAL;
    if (venterPåSvarFraKabal) {
        return [
            ...visning,
            lagHistorikkInnslag(StegType.KABAL_VENTER_SVAR),
            lagHistorikkInnslag(StegType.BEHANDLING_FERDIGSTILT),
        ];
    }
    return visning;
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

const lagHistorikkInnslag = (steg: StegType): IBehandlingshistorikk => ({
    behandlingId: '',
    steg: steg,
    opprettetAv: '',
    endretTid: '',
});
