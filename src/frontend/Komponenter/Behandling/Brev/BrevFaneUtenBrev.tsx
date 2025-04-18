import React, { useState } from 'react';
import { Alert, Button, VStack } from '@navikt/ds-react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useFerdigstillBehandling } from './useFerdigstillBehandling';

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
    const { behandlingErRedigerbar } = useBehandling();
    const { ferdigstill, senderInn } = useFerdigstillBehandling(
        behandlingId,
        () => lukkModal(),
        (feilmelding) => settFeilmelding(feilmelding)
    );

    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    const alertStripeTekst = behandlingErRedigerbar
        ? 'Klagebehandlingen er opprettet med årsak "Henvendelse fra KA (uten brev)" og skal derfor ferdigstilles uten utsendelse av brev.'
        : 'Klagebehandlingen ble opprettet med årsak "Henvendelse fra KA (uten brev)". Det ble derfor ikke utsendt brev til bruker.';

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
                        onClick: () => ferdigstill(),
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
