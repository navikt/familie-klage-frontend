import { Button, HStack } from '@navikt/ds-react';
import React from 'react';

const NOOP = () => {
    // Do nothing
};

type Props = {
    erLesevisning: boolean;
};

export function Submit({ erLesevisning }: Props) {
    if (erLesevisning) {
        return <Button onClick={NOOP}>Lukk</Button>;
    }
    return (
        <HStack gap={'4'}>
            <Button variant={'primary'} type={'submit'}>
                Legg til mottaker
            </Button>
            <Button variant="tertiary" onClick={NOOP}>
                Avbryt
            </Button>
        </HStack>
    );
}
