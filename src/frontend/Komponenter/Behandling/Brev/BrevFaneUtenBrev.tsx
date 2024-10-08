import React, { useState } from 'react';
import { Alert, Button, VStack } from '@navikt/ds-react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled(VStack)`
    margin: 1rem;
`;

const BekreftKnapp = styled(Button)`
    width: fit-content;
`;

interface Props {
    behandlingId: string;
}

export const BrevFaneUtenBrev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { hentBehandling, hentBehandlingshistorikk, behandlingErRedigerbar } = useBehandling();
    const navigate = useNavigate();

    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    const ferdigstillBehandling = () => {
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

    const alertStripeTekst = behandlingErRedigerbar
        ? 'Klagebehandlingen er opprettet med årsak henvendelse fra kabal og skal derfor\n' +
          '                ferdigstilles uten utsendelse av brev.'
        : 'Klagebehandlingen ble opprettet med årsak henvendelse fra kabal. Det ble derfor ikke utsendt brev til bruker.';

    return (
        <Container gap="4">
            <Alert variant="info">{alertStripeTekst}</Alert>
            {behandlingErRedigerbar && (
                <BekreftKnapp
                    variant="primary"
                    size="medium"
                    onClick={() => {
                        settVisModal(true);
                    }}
                >
                    Ferdigstill behandling
                </BekreftKnapp>
            )}
            <ModalWrapper
                tittel={'Bekreft ferdigstillelse av behandling'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => ferdigstillBehandling(),
                        tekst: 'Ferdigstill',
                        disabled: senderInn,
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                    marginTop: 4,
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && <Alert variant={'error'}>Utsending feilet.{feilmelding}</Alert>}
            </ModalWrapper>
        </Container>
    );
};
