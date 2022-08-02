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
    HjemmelValg,
    IVurdering,
    VedtakValg,
    ÅrsakValg,
} from '../../Komponenter/Behandling/Vurdering/vurderingValg';
import { useHentSteg } from '../hooks/useHentSteg';

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

    useEffect(() => {
        if (behandling.status === 'SUKSESS') {
            settFormkravSteg(true);
            if (behandling.data.steg !== 'FORMKRAV') {
                settVurderingSteg(true);
                if (behandling.data.steg !== 'VURDERING') {
                    settBrevSteg(true);
                    if (behandling.data.steg !== 'BREV') {
                        settResultatSteg(true);
                    }
                }
            }
        }
    });

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);
    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);

    const [formkravLåst, settFormkravLåst] = useState<boolean>(false);

    const [formkravBesvart, settFormkravBesvart] = useState<boolean>(false);
    const [formkravGyldig, settFormkravGyldig] = useState<boolean>(false);

    const [vurderingSideGyldig, settVurderingSideGyldig] = useState<boolean>(false);
    const [brevSideGyldig, settBrevSideGyldig] = useState<boolean>(false);
    const [resultatSideGyldig, settResultatSideGyldig] = useState<boolean>(false);
    const {
        brevSteg,
        settBrevSteg,
        resultatSteg,
        settResultatSteg,
        vurderingSteg,
        settVurderingSteg,
        formkravSteg,
        settFormkravSteg,
    } = useHentSteg(behandlingId);

    const [vilkårTom, settVilkårTom] = useState<boolean>(false);

    const [vurderingEndret, settVurderingEndret] = useState(true);

    const vurderingObject: IVurdering = {
        behandlingId: behandlingId,
        vedtak: VedtakValg.VELG,
        arsak: ÅrsakValg.VELG,
        hjemmel: HjemmelValg.VELG,
        beskrivelse: '',
    };
    const [vurderingData, settVurderingData] = useState<IVurdering>(vurderingObject);

    const [visAdvarselSendBrev, settVisAdvarselSendBrev] = useState(false);

    const [visAdvarselFormkrav, settVisAdvarselFormkrav] = useState(false);

    return {
        behandling,
        behandlingErRedigerbar,
        settBehandlingErRedigerbar,
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
        formkravLåst,
        settFormkravLåst,
        formkravBesvart,
        settFormkravBesvart,
        vilkårTom,
        settVilkårTom,
        formkravGyldig,
        settFormkravGyldig,
        vurderingSideGyldig,
        settVurderingSideGyldig,
        brevSideGyldig,
        settBrevSideGyldig,
        resultatSideGyldig,
        settResultatSideGyldig,
        brevSteg,
        settBrevSteg,
        resultatSteg,
        settResultatSteg,
        vurderingSteg,
        settVurderingSteg,
        formkravSteg,
        settFormkravSteg,
        vurderingEndret,
        settVurderingEndret,
        vurderingData,
        settVurderingData,
        visAdvarselSendBrev,
        settVisAdvarselSendBrev,
        visAdvarselFormkrav,
        settVisAdvarselFormkrav,
    };
});

export { BehandlingProvider, useBehandling };
