import styles from './ModalWrapper.module.css';
import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

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
}) =>
    visModal && (
        <Modal
            className={styles.container}
            open={visModal}
            onClose={onClose ? () => onClose() : () => null}
            aria-label={ariaLabel ? ariaLabel : tittel}
            header={{ heading: tittel, closeButton: !!onClose }}
        >
            <Modal.Body>
                <div className={styles.innhold}>{children}</div>
                {aksjonsknapper && (
                    <div className={styles.buttonContainer}>
                        <Button
                            variant="tertiary"
                            onClick={aksjonsknapper.lukkKnapp.onClick}
                            disabled={aksjonsknapper.lukkKnapp.disabled}
                        >
                            {aksjonsknapper.lukkKnapp.tekst}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={aksjonsknapper.hovedKnapp.onClick}
                            disabled={aksjonsknapper.hovedKnapp.disabled}
                        >
                            {aksjonsknapper.hovedKnapp.tekst}
                        </Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
