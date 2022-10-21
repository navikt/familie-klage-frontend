import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
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
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { IFormkravVilkår } from '../Formkrav/typer';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VurderingLesemodus } from './VurderingLesemodus';
import { alleVilkårOppfylt } from '../Formkrav/utils';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

const FritekstFelt = styled(Textarea)`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
    width: 25rem;
`;

const AlertStripeModal = styled(Alert)`
    margin-top: 1rem;
`;

const VurderingKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 4rem;
`;

interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

const erAlleFelterUtfylt = (vurderingData: IVurdering): boolean => {
    return !!(
        vurderingData.vedtak &&
        vurderingData.beskrivelse &&
        vurderingData.beskrivelse.length > 0 &&
        (vurderingData.arsak || vurderingData.hjemmel)
    );
};
export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());
    const [vurdering, settVurdering] = useState<Ressurs<IVurdering>>(byggTomRessurs());
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [melding, settMelding] = useState<IMelding>();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [visModal, settVisModal] = useState<boolean>(false);

    const navigate = useNavigate();

    const {
        vurderingData,
        settVurderingData,
        vurderingEndret,
        settVurderingEndret,
        hentBehandlingshistorikk,
        hentBehandling,
        behandlingErRedigerbar,
    } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    useEffect(() => {
        axiosRequest<IFormkravVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then(settFormkrav);
    }, [axiosRequest, behandlingId, settFormkrav]);

    useEffect(() => {
        if (vurdering.status === RessursStatus.SUKSESS && vurdering.data != null) {
            settVurderingData(vurdering.data);
        } else settVurderingEndret(true);
    }, [vurdering, settVurderingEndret, settVurderingData]);

    useEffect(() => {
        axiosRequest<IVurdering, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}`,
        }).then(settVurdering);
    }, [axiosRequest, behandlingId, settVurderingData, settVurderingEndret]);

    const opprettVurdering = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        settMelding(undefined);
        axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: vurderingData,
        }).then((res: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
                settMelding({
                    tekst: 'Vurderingen er lagret',
                    type: 'success',
                });
            } else {
                settMelding({
                    tekst: res.frontendFeilmelding || 'Noe gikk galt ved innsending',
                    type: 'error',
                });
            }
            settSenderInn(false);
            settVurderingEndret(false);
            hentBehandling.rerun();
            hentBehandlingshistorikk.rerun();
        });
    };

    const ferdigstillBehandlingOgNavigerTilResultat = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/ferdigstill`,
        }).then((res: RessursSuksess<null> | RessursFeilet) => {
            settSenderInn(false);
            if (res.status === RessursStatus.SUKSESS) {
                lukkModal();
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                navigate(`/behandling/${hentBehandlingIdFraUrl()}/resultat`);
            } else {
                settFeilmelding(
                    res.frontendFeilmelding
                        ? res.frontendFeilmelding
                        : 'Noe gikk galt ved ferdigstilling'
                );
            }
        });
    };

    const skalOmgjøre = !vurderingEndret && vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK;

    function navigerTilBrev() {
        navigate(`/behandling/${hentBehandlingIdFraUrl()}/brev`);
    }

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    return (
        <DataViewer response={{ formkrav, vurdering }}>
            {({ formkrav }) => {
                return (
                    <>
                        <FormkravOppsummering
                            formkrav={formkrav}
                            alleVilkårOppfylt={alleVilkårOppfylt(formkrav)}
                        />
                        {behandlingErRedigerbar && !alleVilkårOppfylt(formkrav) && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && alleVilkårOppfylt(formkrav) && (
                            <VurderingLesemodus />
                        )}
                        {alleVilkårOppfylt(formkrav) && behandlingErRedigerbar && (
                            <>
                                <Vedtak
                                    settVedtak={settVurderingData}
                                    vedtakValgt={vurderingData.vedtak}
                                    vedtakValgmuligheter={vedtakValgTilTekst}
                                    endring={settIkkePersistertKomponent}
                                />
                                {vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK && (
                                    <Årsak
                                        settÅrsak={settVurderingData}
                                        årsakValgt={vurderingData.arsak}
                                        årsakValgmuligheter={årsakValgTilTekst}
                                        endring={settIkkePersistertKomponent}
                                    />
                                )}
                                {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                                    <HjemmelVelger
                                        settHjemmel={settVurderingData}
                                        hjemmelValgt={vurderingData.hjemmel}
                                        hjemmelValgmuligheter={hjemmelTilTekst}
                                        endring={settIkkePersistertKomponent}
                                    />
                                )}
                                <FritekstFelt
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
                                <VurderingKnapper>
                                    {vurderingEndret && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={opprettVurdering}
                                            disabled={!erAlleFelterUtfylt(vurderingData)}
                                        >
                                            Lagre vurdering
                                        </Button>
                                    )}
                                    {!vurderingEndret && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={() =>
                                                skalOmgjøre ? settVisModal(true) : navigerTilBrev()
                                            }
                                        >
                                            {skalOmgjøre ? 'Ferdigstill' : 'Fortsett'}
                                        </Button>
                                    )}
                                </VurderingKnapper>
                                {melding && (
                                    <AlertStyled variant={melding.type} size="medium">
                                        {melding.tekst}
                                    </AlertStyled>
                                )}
                                <ModalWrapper
                                    tittel={'Bekreft ferdigstillelse av klagebehandling'}
                                    visModal={visModal}
                                    onClose={() => lukkModal()}
                                    aksjonsknapper={{
                                        hovedKnapp: {
                                            onClick: () =>
                                                ferdigstillBehandlingOgNavigerTilResultat(),
                                            tekst: 'Ferdigstill',
                                            disabled: senderInn,
                                        },
                                        lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                                        marginTop: 4,
                                    }}
                                    ariaLabel={'Bekreft ustending av frittstående brev'}
                                >
                                    {feilmelding && (
                                        <AlertStripeModal variant={'error'}>
                                            {feilmelding}
                                        </AlertStripeModal>
                                    )}
                                </ModalWrapper>
                            </>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
