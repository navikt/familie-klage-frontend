// React
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';

// CSS
import styled from 'styled-components';

// Komponenter
import { Alert, Button, Textarea } from '@navikt/ds-react';
import { FormkravOppsummering } from './FormkravOppsummering';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { HjemmelVelger } from './HjemmelVelger';
import {
    hjemmelTilTekst,
    IVurdering,
    VedtakValg,
    vedtakValgTilTekst,
    årsakValgTilTekst,
} from './vurderingValg';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IFormkravVilkår, VilkårStatus } from '../Formkrav/typer';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { formkravOppfylt } from '../../../App/utils/formkrav';
import { VurderingLesemodus } from './VurderingLesemodus';

const VurderingBeskrivelseStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
    width: 18rem;
`;

const VurderingKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 4rem;
`;

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    // Formkravoppsummering
    const [oppfylt, settOppfylt] = useState(0);
    const [muligOppfylt, settMuligOppfylt] = useState(0);
    const [begrunnelse, settBegrunnelse] = useState('');
    const [formkravGodkjent, settFormkravGodkjent] = useState<boolean>();
    const [feilmelding, settFeilmelding] = useState('');
    const navigate = useNavigate();

    const {
        vurderingData,
        settVurderingData,
        vurderingEndret,
        settVurderingEndret,
        settVurderingSideGyldig,
        hentBehandling,
        visAdvarselSendBrev,
        settVisAdvarselSendBrev,
        behandlingErRedigerbar,
    } = useBehandling();
    // Endringer
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    // Hent data fra formkrav
    useEffect(() => {
        axiosRequest<IFormkravVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then((res: Ressurs<IFormkravVilkår>) => {
            if (res.status === RessursStatus.SUKSESS) {
                if (res.data.saksbehandlerBegrunnelse.length !== 0)
                    settBegrunnelse(res.data.saksbehandlerBegrunnelse);

                const vilkårListe = [
                    res.data.klagePart,
                    res.data.klageKonkret,
                    res.data.klagefristOverholdt,
                    res.data.klageSignert,
                ];
                settOppfylt(vilkårListe.filter((item: VilkårStatus) => item === 'OPPFYLT').length);
                settMuligOppfylt(vilkårListe.length);
                settFormkravGodkjent(formkravOppfylt(res.data));
            }
        });
    }, [axiosRequest, behandlingId, settFormkravGodkjent]);

    // Hent eksisterende vurderingsdata
    useEffect(() => {
        axiosRequest<IVurdering, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}`,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS && res.data != null) {
                settVurderingData({
                    behandlingId: res.data.behandlingId,
                    vedtak: res.data.vedtak,
                    arsak: res.data.arsak,
                    hjemmel: res.data.hjemmel,
                    beskrivelse: res.data.beskrivelse,
                });
            } else settVurderingEndret(true);
        });
    }, [axiosRequest, behandlingId, settVurderingData, settVurderingEndret]);

    useEffect(() => {
        if (!formkravGodkjent) {
            settFeilmelding('Formkrav er ikke oppfylt.');
        } else if (begrunnelse.length === 0) {
            settFeilmelding('Formkrav mangler en begrunnelse.');
        } else {
            settFeilmelding('Det har skjedd en feil');
        }
    }, [oppfylt, muligOppfylt, begrunnelse.length, formkravGodkjent]);

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const opprettVurdering = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: vurderingData,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
                settVurderingSideGyldig(true);
                settVisAdvarselSendBrev(false);
            } else {
                settVisAdvarselSendBrev(true);
            }
            settSenderInn(false);
            settVurderingEndret(false);
            hentBehandling.rerun();
        });
    };

    return (
        <div>
            <FormkravOppsummering
                oppfylt={oppfylt}
                muligOppfylt={muligOppfylt}
                begrunnelse={begrunnelse}
                feilmelding={feilmelding}
                formkravGodkjent={formkravGodkjent}
            />
            {!behandlingErRedigerbar && formkravGodkjent && <VurderingLesemodus />}
            {formkravGodkjent && behandlingErRedigerbar ? (
                <>
                    <Vedtak
                        settVedtak={settVurderingData}
                        vedtakValgt={vurderingData.vedtak}
                        vedtakValgmuligheter={vedtakValgTilTekst}
                        endring={settIkkePersistertKomponent}
                    />
                    {vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <Årsak
                            settÅrsak={settVurderingData}
                            årsakValgt={vurderingData.arsak}
                            årsakValgmuligheter={årsakValgTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ? (
                        <HjemmelVelger
                            settHjemmel={settVurderingData}
                            hjemmelValgt={vurderingData.hjemmel}
                            hjemmelValgmuligheter={hjemmelTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                    vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <VurderingBeskrivelseStyled>
                            <Textarea
                                label="Vurdering"
                                value={vurderingData.beskrivelse}
                                onChange={(e) => {
                                    settIkkePersistertKomponent(e.target.value);
                                    settVurderingData((tidligereTilstand) => ({
                                        ...tidligereTilstand,
                                        beskrivelse: e.target.value,
                                    }));
                                    settVurderingEndret(true);
                                }}
                                size="medium"
                            />
                        </VurderingBeskrivelseStyled>
                    ) : (
                        ''
                    )}
                    <VurderingKnapper>
                        {(vurderingEndret || visAdvarselSendBrev) && (
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {
                                    opprettVurdering();
                                }}
                                disabled={
                                    !(
                                        vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                                        vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK
                                    ) ||
                                    vurderingData.beskrivelse.length == 0 ||
                                    (!vurderingData.arsak && !vurderingData.hjemmel)
                                }
                            >
                                Lagre vurdering
                            </Button>
                        )}
                        {!vurderingEndret && (
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() =>
                                    navigate(`/behandling/${hentBehandlingIdFraUrl()}/brev`)
                                }
                            >
                                Fortsett
                            </Button>
                        )}
                    </VurderingKnapper>
                    {!vurderingEndret ? (
                        <>
                            {!visAdvarselSendBrev ? (
                                <AlertStyled variant="success" size="medium">
                                    Du har lagret vurderingen.
                                </AlertStyled>
                            ) : (
                                <AlertStyled variant="error" size="medium">
                                    Noe gikk galt. Prøv å lagre igjen.
                                </AlertStyled>
                            )}
                        </>
                    ) : (
                        ''
                    )}
                </>
            ) : (
                ''
            )}
        </div>
    );
};
