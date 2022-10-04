import constate from 'constate';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../typer/routing';
import { useRerunnableEffect } from '../hooks/felles/useRerunnableEffect';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { RessursStatus } from '../typer/ressurs';
import { erBehandlingRedigerbar } from '../typer/behandlingstatus';
import { IVurdering } from '../../Komponenter/Behandling/Vurdering/vurderingValg';
import { useHentFormkravVilkår } from '../hooks/useHentFormkravVilkår';
import { alleVilkårOppfylt } from '../../Komponenter/Behandling/Formkrav/utils';
import { harVerdi } from '../utils/utils';
import { useHentFagsak } from '../hooks/useHentFagsak';

const [BehandlingProvider, useBehandling] = constate(() => {
    const behandlingId = useParams<IBehandlingParams>().behandlingId as string;

    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentFagsak, fagsakResponse } = useHentFagsak();
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
    const [vilkårOppfyltOgBesvart, settVilkårOppfyltOgBesvart] = useState<boolean>(false);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);
    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            hentFagsak(behandling.data.fagsakId);
        }
    }, [behandling, hentFagsak]);
    useEffect(() => {
        settBehandlingErRedigerbar(
            behandling.status === RessursStatus.SUKSESS && erBehandlingRedigerbar(behandling.data)
        );
        hentVilkårsvurderinger(behandlingId);
    }, [behandling, behandlingId, hentVilkårsvurderinger]);
    useEffect(() => {
        settVilkårOppfyltOgBesvart(
            vilkårsvurderinger.status === RessursStatus.SUKSESS &&
                alleVilkårOppfylt(vilkårsvurderinger.data) &&
                harVerdi(vilkårsvurderinger.data.saksbehandlerBegrunnelse)
        );
    }, [vilkårsvurderinger]);

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);
    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);

    const [vilkårTom, settVilkårTom] = useState<boolean>(false);

    const [vurderingEndret, settVurderingEndret] = useState(false);

    const initiellVurdering: IVurdering = { behandlingId: behandlingId };
    const [vurderingData, settVurderingData] = useState<IVurdering>(initiellVurdering);

    const [visAdvarselSendBrev, settVisAdvarselSendBrev] = useState(false);

    return {
        behandling,
        behandlingErRedigerbar,
        personopplysningerResponse,
        behandlingHistorikk,
        hentBehandling,
        hentBehandlingshistorikk,
        visBrevmottakereModal,
        settVisBrevmottakereModal,
        visHenleggModal,
        settVisHenleggModal,
        åpenHøyremeny,
        settÅpenHøyremeny,
        vilkårTom,
        settVilkårTom,
        vurderingEndret,
        settVurderingEndret,
        vurderingData,
        settVurderingData,
        visAdvarselSendBrev,
        settVisAdvarselSendBrev,
        vilkårOppfyltOgBesvart,
        fagsakResponse,
    };
});

export { BehandlingProvider, useBehandling };
