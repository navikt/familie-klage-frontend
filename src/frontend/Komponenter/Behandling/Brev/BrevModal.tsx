import React, { SetStateAction } from 'react';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import { Alert, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import { useBehandling } from '../../../App/context/BehandlingContext';

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;
    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

const FeilContainer = styled.div`
    padding-top: 1rem;
`;

interface BrevModal {
    ferdigstillBrev: () => void;
    settFeil: React.Dispatch<SetStateAction<string>>;
    feil: string;
}

const BrevModal: React.FC<BrevModal> = ({ ferdigstillBrev, settFeil, feil }) => {
    const { visAdvarselSendBrev, settVisAdvarselSendBrev } = useBehandling();

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Er du sikker på at du ønsker å sende brev?',
                lukkKnapp: false,
                visModal: visAdvarselSendBrev,
                onClose: () => {
                    settVisAdvarselSendBrev(false);
                    settFeil('');
                },
                className: 'cake',
            }}
        >
            <SentrerKnapper>
                <Button variant="tertiary" onClick={ferdigstillBrev}>
                    Send brev
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        settVisAdvarselSendBrev(false);
                    }}
                >
                    Gå tilbake for å redigere
                </Button>
            </SentrerKnapper>

            {feil && (
                <FeilContainer>
                    <Alert variant={'error'}>{feil}</Alert>
                </FeilContainer>
            )}
        </UIModalWrapper>
    );
};
export default BrevModal;
