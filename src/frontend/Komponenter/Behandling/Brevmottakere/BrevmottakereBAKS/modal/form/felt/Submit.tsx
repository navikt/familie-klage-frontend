import { Button, HStack } from '@navikt/ds-react';
import React from 'react';

type Props = {
    erLesevisning: boolean;
    lukkModal: () => void;
};

export function Submit({ erLesevisning, lukkModal }: Props) {
    if (erLesevisning) {
        return <Button onClick={lukkModal}>Lukk</Button>;
    }
    return (
        <HStack gap={'4'}>
            <Button variant={'primary'} type={'submit'}>
                Legg til mottaker
            </Button>
            <Button variant="tertiary" onClick={lukkModal}>
                Avbryt
            </Button>
        </HStack>
    );
}
