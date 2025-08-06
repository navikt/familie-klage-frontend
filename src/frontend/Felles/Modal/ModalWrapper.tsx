import styled from 'styled-components';
import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

const ModalContainer = styled(Modal)`
    min-width: 30rem;
    max-width: 70rem;
`;

const Innhold = styled.div`
    margin-right: 2rem;
    margin-left: 2rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 4rem;
    margin-right: 2rem;
    margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-left: 1rem;
`;

interface ModalWrapper {
    tittel: string;
    visModal: boolean;
    onClose?: () => void;
    aksjonsknapper?: { hovedKnapp: Aksjonsknapp; lukkKnapp: Aksjonsknapp };
    ariaLabel?: string;
    children?: React.ReactNode;
}

interface Aksjonsknapp {
    onClick: () => void;
    tekst: string;
    disabled?: boolean;
}

export const ModalWrapper: React.FC<ModalWrapper> = ({
    tittel,
    visModal,
    onClose,
    aksjonsknapper,
    ariaLabel,
    children,
}) => {
    return (
        visModal && (
            <ModalContainer
                open={visModal}
                onClose={onClose ? () => onClose() : () => null}
                aria-label={ariaLabel ? ariaLabel : tittel}
                header={{ heading: tittel, closeButton: !!onClose }}
            >
                <Modal.Body>
                    <Innhold>{children}</Innhold>
                    {aksjonsknapper && (
                        <ButtonContainer>
                            <ModalKnapp
                                variant="tertiary"
                                onClick={aksjonsknapper.lukkKnapp.onClick}
                                disabled={aksjonsknapper.lukkKnapp.disabled}
                            >
                                {aksjonsknapper.lukkKnapp.tekst}
                            </ModalKnapp>
                            <ModalKnapp
                                variant="primary"
                                onClick={aksjonsknapper.hovedKnapp.onClick}
                                disabled={aksjonsknapper.hovedKnapp.disabled}
                            >
                                {aksjonsknapper.hovedKnapp.tekst}
                            </ModalKnapp>
                        </ButtonContainer>
                    )}
                </Modal.Body>
            </ModalContainer>
        )
    );
};
