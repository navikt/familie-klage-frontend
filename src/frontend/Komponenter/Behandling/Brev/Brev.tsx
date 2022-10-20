import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import PdfVisning from './PdfVisning';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button } from '@navikt/ds-react';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import BrevRedigerer from './BrevRedigerer';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

const Container = styled.div`
    background-color: var(--navds-semantic-color-canvas-background);
    padding: 2rem 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5rem;
    justify-content: center;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const {
        personopplysningerResponse,
        behandling,
        hentBehandling,
        hentBehandlingshistorikk,
        behandlingErRedigerbar,
    } = useBehandling();

    const navigate = useNavigate();
    const { axiosRequest } = useApp();

    const [senderInnBrev, settSenderInnBrev] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    useEffect(() => {
        if (!behandlingErRedigerbar) {
            axiosRequest<string, null>({
                method: 'GET',
                url: `/familie-klage/api/brev/${behandlingId}/pdf`,
            }).then(settBrevRessurs);
        }
    }, [axiosRequest, behandlingId, behandlingErRedigerbar, settBrevRessurs]);

    const ferdigstillBrev = () => {
        if (senderInnBrev) {
            return;
        }
        settSenderInnBrev(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/ferdigstill`,
        }).then((res: RessursSuksess<null> | RessursFeilet) => {
            settSenderInnBrev(false);
            if (res.status === RessursStatus.SUKSESS) {
                lukkModal();
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                navigate(`/behandling/${hentBehandlingIdFraUrl()}/resultat`);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    return (
        <DataViewer response={{ personopplysningerResponse, behandling }}>
            <Container>
                {behandlingErRedigerbar && (
                    <div>
                        <BrevRedigerer
                            behandlingId={behandlingId}
                            oppdaterBrevressurs={settBrevRessurs}
                        />
                        <Button
                            variant="primary"
                            size="medium"
                            onClick={() => {
                                settVisModal(true);
                            }}
                        >
                            Ferdigstill
                        </Button>
                    </div>
                )}
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </Container>
            <ModalWrapper
                tittel={'Bekreft utsending av brev'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => ferdigstillBrev(),
                        tekst: 'Send brev',
                        disabled: senderInnBrev,
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                    marginTop: 4,
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && (
                    <AlertStripe variant={'error'}>Utsending feilet. {feilmelding}</AlertStripe>
                )}
            </ModalWrapper>
        </DataViewer>
    );
};
