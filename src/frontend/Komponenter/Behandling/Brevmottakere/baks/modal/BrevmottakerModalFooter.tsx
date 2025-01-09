import React from 'react';
import { Button, Modal } from '@navikt/ds-react';
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
