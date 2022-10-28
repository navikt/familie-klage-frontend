import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { IVurdering, VedtakValg } from '../Vurdering/vurderingValg';
import PdfVisning from './PdfVisning';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import SystemetLaster from '../../../Felles/SystemetLaster/SystemetLaster';

const Container = styled.div`
    background-color: var(--navds-semantic-color-canvas-background);
    padding: 2rem 2rem 0 2rem;
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-gap: 1rem;
    justify-content: space-between;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

const AlertContainer = styled.div`
    padding: 2rem;
    max-width: 40rem;
`;

const StyledKnapp = styled(Button)`
    margin-top: 2rem;
`;

type Utfall = 'IKKE_SATT' | 'LAG_BREV' | 'OMGJØR_VEDTAK';

interface IBrev {
    behandlingId: string;
}
export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const { hentBehandling, hentBehandlingshistorikk, behandlingErRedigerbar } = useBehandling();
    const navigate = useNavigate();

    const { axiosRequest } = useApp();
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const [utfall, settUtfall] = useState<Utfall>('IKKE_SATT');

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering | undefined, null>({
                method: 'GET',
                url: `/familie-klage/api/vurdering/${behandlingId}`,
            }).then((response: RessursSuksess<IVurdering | undefined> | RessursFeilet) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (response.data?.vedtak === VedtakValg.OMGJØR_VEDTAK) {
                        settUtfall('OMGJØR_VEDTAK');
                    } else {
                        settUtfall('LAG_BREV');
                    }
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );
    useEffect(() => {
        hentVurdering(behandlingId);
    }, [behandlingId, hentVurdering]);

    const hentBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}/pdf`,
        }).then(settBrevRessurs);
    }, [axiosRequest, behandlingId]);

    const genererBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-klage/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (utfall === 'LAG_BREV') {
            if (behandlingErRedigerbar) {
                genererBrev();
            } else {
                hentBrev();
            }
        }
    }, [behandlingErRedigerbar, genererBrev, hentBrev, utfall]);

    const ferdigstill = () => {
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
                navigate(`/behandling/${behandlingId}/resultat`);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    if (utfall === 'LAG_BREV') {
        return (
            <>
                <Container>
                    <div>
                        {behandlingErRedigerbar && brevRessurs.status === RessursStatus.SUKSESS && (
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {
                                    settVisModal(true);
                                }}
                            >
                                Ferdigstill behandling og send brev
                            </Button>
                        )}
                    </div>
                    <PdfVisning pdfFilInnhold={brevRessurs} />
                </Container>
                <ModalWrapper
                    tittel={'Bekreft utsending av brev'}
                    visModal={visModal}
                    onClose={() => lukkModal()}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: () => ferdigstill(),
                            tekst: 'Send brev',
                            disabled: senderInn,
                        },
                        lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                        marginTop: 4,
                    }}
                    ariaLabel={'Bekreft ustending av frittstående brev'}
                >
                    {feilmelding && (
                        <AlertStripe variant={'error'}>Utsending feilet.{feilmelding}</AlertStripe>
                    )}
                </ModalWrapper>
            </>
        );
    } else if (utfall === 'OMGJØR_VEDTAK') {
        return (
            <>
                {behandlingErRedigerbar && (
                    <AlertContainer>
                        <Alert variant={'info'}>
                            Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Du
                            kan nå ferdigstille klagebehandlingen og opprette en revurdering for å
                            fatte nytt vedtak.
                        </Alert>
                        <StyledKnapp onClick={() => settVisModal(true)}>Ferdigstill</StyledKnapp>
                    </AlertContainer>
                )}
                {!behandlingErRedigerbar && (
                    <AlertContainer>
                        <Alert variant={'info'}>
                            Brev finnes ikke fordi klagen er tatt til følge.
                        </Alert>
                    </AlertContainer>
                )}
                <ModalWrapper
                    tittel={'Bekreft ferdigstillelse av klagebehandling'}
                    visModal={visModal}
                    onClose={() => lukkModal()}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: ferdigstill,
                            tekst: 'Ferdigstill',
                            disabled: senderInn,
                        },
                        lukkKnapp: { onClick: lukkModal, tekst: 'Avbryt' },
                        marginTop: 4,
                    }}
                >
                    {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                </ModalWrapper>
            </>
        );
    } else {
        return <div>{feilmelding || <SystemetLaster />}</div>;
    }
};
