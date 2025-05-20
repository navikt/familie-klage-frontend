import { Alert, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import React from 'react';
import {
    harEnBrukerNyBrevmottaker,
    harEnDødsboNyBrevmottaker,
} from '../Brevmottakere/nyBrevmottaker';
import { BrevmottakerDetaljer } from './BrevmottakerDetaljer';
import { useOnUnmount } from '../../../App/hooks/useOnUnmount';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';
import { useBrevmottakerFormContext } from './context/BrevmottakerFormContextProvider';

export function BrevmottakereBox() {
    const { brevmottakere } = useBrevmottakereContext();
    const { åpneBrevmottakerForm, lukkBrevmottakerForm } = useBrevmottakerFormContext();

    useOnUnmount(() => lukkBrevmottakerForm());

    const harDødsboBrevmottaker = harEnDødsboNyBrevmottaker(brevmottakere);
    const harBruker = harEnBrukerNyBrevmottaker(brevmottakere);

    const visLeggTilNyBrevmottakerKnapp =
        !harDødsboBrevmottaker && (brevmottakere.length < 2 || harBruker);

    return (
        <Box as={'div'} background={'surface-neutral-subtle'} padding={'space-12'}>
            <VStack gap={'4'}>
                <Heading size={'small'}>Brevmottakere</Heading>
                {brevmottakere.length === 0 && (
                    <Alert variant={'warning'}>Fant ingen brevmottakere...</Alert>
                )}
                {brevmottakere.map((brevmottaker) => (
                    <BrevmottakerDetaljer
                        key={brevmottaker.mottakerRolle}
                        brevmottaker={brevmottaker}
                    />
                ))}
                {visLeggTilNyBrevmottakerKnapp && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            size={'small'}
                            icon={<PlusCircleIcon />}
                            onClick={åpneBrevmottakerForm}
                        >
                            Legg til ny brevmottaker
                        </Button>
                    </div>
                )}
            </VStack>
        </Box>
    );
}
