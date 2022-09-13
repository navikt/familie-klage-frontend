import constate from 'constate';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../typer/routing';
import { useRerunnableEffect } from '../hooks/felles/useRerunnableEffect';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { useHentTotrinnskontroll } from '../hooks/useHentTotrinnStatus';
import { useHentRegler } from '../hooks/useHentRegler';
import { RessursStatus } from '../typer/ressurs';
import { erBehandlingRedigerbar } from '../typer/behandlingstatus';
import {
    Hjemmel,
    IVurdering,
    VedtakValg,
    ÅrsakOmgjøring,
} from '../../Komponenter/Behandling/Vurdering/vurderingValg';

const [BehandlingProvider, useBehandling] = constate(() => {
    const behandlingId = useParams<IBehandlingParams>().behandlingId as string;

    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { hentTotrinnskontrollCallback, totrinnskontroll } =
        useHentTotrinnskontroll(behandlingId);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    const { hentRegler, regler } = useHentRegler();
    // eslint-disable-next-line
    useEffect(() => hentRegler(), [behandlingId]);

    const hentTotrinnskontroll = useRerunnableEffect(hentTotrinnskontrollCallback, [behandlingId]);
    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);
    useEffect(
        () =>
            settBehandlingErRedigerbar(
                behandling.status === RessursStatus.SUKSESS &&
                    erBehandlingRedigerbar(behandling.data)
            ),
        [behandling]
    );

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);
    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);

    const [vurderingSideGyldig, settVurderingSideGyldig] = useState<boolean>(false);
    const [brevSideGyldig, settBrevSideGyldig] = useState<boolean>(false);
    const [resultatSideGyldig, settResultatSideGyldig] = useState<boolean>(false);
    const [formkravSteg, settFormkravSteg] = useState<boolean>(true);
    const [vurderingSteg, settVurderingSteg] = useState<boolean>(false);
    const [brevSteg, settBrevSteg] = useState<boolean>(false);
    const [resultatSteg, settResultatSteg] = useState<boolean>(false);

    useEffect(() => {
        if (behandling.status === 'SUKSESS') {
            settFormkravSteg(true);
            if (behandling.data.steg !== 'FORMKRAV') {
                settVurderingSteg(true);
                if (behandling.data.steg !== 'VURDERING') {
                    settBrevSteg(true);
                    if (behandling.data.steg !== 'BREV') {
                        settResultatSteg(true);
                    } else {
                        settResultatSteg(false);
                    }
                } else {
                    settBrevSteg(false);
                }
            } else {
                settVurderingSteg(false);
            }
        }
    }, [behandling, settBrevSteg, settFormkravSteg, settResultatSteg, settVurderingSteg]);

    const [vilkårTom, settVilkårTom] = useState<boolean>(false);

    const [vurderingEndret, settVurderingEndret] = useState(false);

    const vurderingObject: IVurdering = {
        behandlingId: behandlingId,
        vedtak: VedtakValg.VELG,
        arsak: ÅrsakOmgjøring.VELG,
        hjemmel: Hjemmel.VELG,
        beskrivelse: '',
    };
    const [vurderingData, settVurderingData] = useState<IVurdering>(vurderingObject);

    const [visAdvarselSendBrev, settVisAdvarselSendBrev] = useState(false);

    return {
        behandling,
        behandlingErRedigerbar,
        totrinnskontroll,
        personopplysningerResponse,
        behandlingHistorikk,
        hentBehandling,
        hentTotrinnskontroll,
        hentBehandlingshistorikk,
        regler,
        visBrevmottakereModal,
        settVisBrevmottakereModal,
        visHenleggModal,
        settVisHenleggModal,
        åpenHøyremeny,
        settÅpenHøyremeny,
        vilkårTom,
        settVilkårTom,
        vurderingSideGyldig,
        settVurderingSideGyldig,
        brevSideGyldig,
        settBrevSideGyldig,
        resultatSideGyldig,
        settResultatSideGyldig,
        brevSteg,
        resultatSteg,
        vurderingSteg,
        formkravSteg,
        vurderingEndret,
        settVurderingEndret,
        vurderingData,
        settVurderingData,
        visAdvarselSendBrev,
        settVisAdvarselSendBrev,
    };
});

export { BehandlingProvider, useBehandling };
