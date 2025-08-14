import constate from 'constate';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../typer/routing';
import { useRerunnableEffect } from '../hooks/useRerunnableEffect';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { RessursStatus } from '../typer/ressurs';
import { BehandlingStatus } from '../typer/behandlingstatus';
import { IVurdering } from '../../Komponenter/Behandling/Vurdering/vurderingValg';
import { useHentFormkravVilkår } from '../hooks/useHentFormkravVilkår';
import {
    alleVilkårOppfylt,
    påklagetVedtakErValgt,
} from '../../Komponenter/Behandling/Formkrav/validerFormkravUtils';
import { useHentAnsvarligSaksbehandler } from '../hooks/useHentAnsvarligSaksbehandler';
import { Behandling, StegType } from '../typer/fagsak';

const [BehandlingProvider, useBehandling] = constate(() => {
    const behandlingId = useParams<IBehandlingParams>().behandlingId as string;

    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
    const [formkravOppfylt, settFormkravOppfylt] = useState<boolean>(false);
    const { hentAnsvarligSaksbehandlerCallback, ansvarligSaksbehandler } =
        useHentAnsvarligSaksbehandler(behandlingId);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentAnsvarligSaksbehandler = useRerunnableEffect(hentAnsvarligSaksbehandlerCallback, [
        behandlingId,
    ]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId, hentPersonopplysninger]);

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            settVisSettPåVent(behandling.data.status === BehandlingStatus.SATT_PÅ_VENT);
        }
    }, [behandling]);

    useEffect(() => {
        settBehandlingErRedigerbar(
            behandling.status === RessursStatus.SUKSESS && erBehandlingRedigerbar(behandling.data)
        );
        hentVilkårsvurderinger(behandlingId);
    }, [ansvarligSaksbehandler, behandling, behandlingId, hentVilkårsvurderinger]);

    useEffect(() => {
        settFormkravOppfylt(
            vilkårsvurderinger.status === RessursStatus.SUKSESS &&
                påklagetVedtakErValgt(vilkårsvurderinger.data) &&
                alleVilkårOppfylt(vilkårsvurderinger.data)
        );
    }, [vilkårsvurderinger]);

    const erBehandlingRedigerbar = (behandling: Behandling): boolean =>
        behandling.status !== BehandlingStatus.SATT_PÅ_VENT &&
        [StegType.FORMKRAV, StegType.VURDERING, StegType.BREV].includes(behandling.steg);

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);
    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [visSettPåVent, settVisSettPåVent] = useState(false);
    const [visEndreBehandlendeEnhet, settVisEndreBehandlendeEnhet] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);
    const [vurderingEndret, settVurderingEndret] = useState(false);

    const initiellVurdering: IVurdering = { behandlingId: behandlingId };
    const [oppdatertVurdering, settOppdatertVurdering] = useState<IVurdering>(initiellVurdering);

    return {
        ansvarligSaksbehandler,
        hentAnsvarligSaksbehandler,
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
        visSettPåVent,
        settVisSettPåVent,
        settÅpenHøyremeny,
        vurderingEndret,
        settVurderingEndret,
        oppdatertVurdering,
        settOppdatertVurdering,
        formkravOppfylt,
        visEndreBehandlendeEnhet,
        settVisEndreBehandlendeEnhet,
    };
});

export { BehandlingProvider, useBehandling };
