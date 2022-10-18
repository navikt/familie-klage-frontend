import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { ensure } from '../../../App/utils/utils';
import {
    Behandling,
    BehandlingResultat,
    behandlingResultatTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import { KlagehendelseType, utfallTilTekst } from '../../../App/typer/klageresultat';

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
                ? 'Ikke oppfylt'
                : 'Oppfylt';
        case StegType.VURDERING:
            return behandling.resultat === BehandlingResultat.MEDHOLD ? 'Omgjør' : 'Oppretthold';
        case StegType.BEHANDLING_FERDIGSTILT:
            return utledTekstForEksternutfall(behandling);
    }
};

export const utledTekstForEksternutfall = (behandling: Behandling) => {
    const klageResultatMedUtfall = behandling.klageresultat.filter(
        (resultat) =>
            resultat.utfall && resultat.type == KlagehendelseType.KLAGEBEHANDLING_AVSLUTTET
    );
    if (klageResultatMedUtfall.length > 0) {
        const utfall = klageResultatMedUtfall[0];
        if (utfall.utfall) {
            return utfallTilTekst[utfall.utfall];
        }
    }
};

export const utledTekstForBehandlingsresultat = (behandling: Behandling) => {
    const eksternUtfallTekst = utledTekstForEksternutfall(behandling);
    return eksternUtfallTekst
        ? eksternUtfallTekst
        : behandlingResultatTilTekst[behandling.resultat];
};

const lagHistorikkInnslag = (steg: StegType): IBehandlingshistorikk => ({
    behandlingId: '',
    steg: steg,
    opprettetAv: '',
    endretTid: '',
});
