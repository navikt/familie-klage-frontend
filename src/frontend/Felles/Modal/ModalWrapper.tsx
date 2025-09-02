import styles from './ModalWrapper.module.css';
import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

interface Props {
    tittel: string;
    visModal: boolean;
    onClose?: () => void;
    aksjonsknapper?: { hovedKnapp: Aksjonsknapp; lukkKnapp: Aksjonsknapp };
    ariaLabel?: string;
    children?: React.ReactNode;
    width?: `${number}${string}`;
}

interface Aksjonsknapp {
    onClick: () => void;
    tekst: string;
    disabled?: boolean;
}

export const ModalWrapper: React.FC<Props> = ({
    tittel,
    visModal,
    onClose,
    aksjonsknapper,
    ariaLabel,
    children,
    width,
}) =>
    visModal && (
        <Modal
            open={visModal}
            onClose={onClose ? () => onClose() : () => null}
            aria-label={ariaLabel ? ariaLabel : tittel}
            header={{ heading: tittel, closeButton: !!onClose }}
            width={width}
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
