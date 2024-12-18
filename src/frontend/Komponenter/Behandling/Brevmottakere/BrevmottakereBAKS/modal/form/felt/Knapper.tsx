import { Button, HStack } from '@navikt/ds-react';
import React from 'react';

type Props = {
    erLesevisning: boolean;
    vedAvbrytKlikk: () => void;
};

export function Knapper({ erLesevisning, vedAvbrytKlikk }: Props) {
    if (erLesevisning) {
        return <Button onClick={vedAvbrytKlikk}>Lukk</Button>;
    }
    return (
        <HStack gap={'4'}>
            <Button variant={'primary'} type={'submit'}>
                Legg til mottaker
            </Button>
            <Button variant="tertiary" onClick={vedAvbrytKlikk}>
                Avbryt
            </Button>
        </HStack>
    );
}
