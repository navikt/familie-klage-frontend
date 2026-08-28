import { Button, Modal } from '@navikt/ds-react';
import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';

export function BrevmottakerModalFooter() {
    const { settVisBrevmottakereModal } = useApp();
    return (
        <Modal.Footer>
            <Button
                variant={'tertiary'}
                size={'medium'}
                onClick={() => settVisBrevmottakereModal(false)}
            >
                Lukk vindu
            </Button>
        </Modal.Footer>
    );
}
