import React, { useState } from 'react';
import { Alert, VStack } from '@navikt/ds-react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useFerdigstillBehandling } from './useFerdigstillBehandling';
import { Button } from '../../../Felles/Knapper/Button';

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
        <VStack gap="4" margin="4">
            <Alert variant="info">{alertStripeTekst}</Alert>
            {behandlingErRedigerbar && (
                <Button
                    variant="primary"
                    size="medium"
                    onClick={() => {
                        settVisModal(true);
                    }}
                >
                    Ferdigstill behandling
                </Button>
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
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && <Alert variant={'error'}>Utsending feilet.{feilmelding}</Alert>}
            </ModalWrapper>
        </VStack>
    );
};
