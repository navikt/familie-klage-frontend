import { Alert, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import React from 'react';
import {
    harEnBrukerNyBrevmottaker,
    harEnDødsboNyBrevmottaker,
} from '../Brevmottakere/nyBrevmottaker';
import { BrevmottakerDetaljer } from './BrevmottakerDetaljer';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';
import { useBrevmottakerFormActionsContext } from './context/BrevmottakerFormActionsContextProvider';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

export function BrevmottakereBox({ behandling }: Props) {
    const { brevmottakere } = useBrevmottakereContext();
    const { visForm } = useBrevmottakerFormActionsContext();

    const harDødsboBrevmottaker = harEnDødsboNyBrevmottaker(brevmottakere);
    const harBruker = harEnBrukerNyBrevmottaker(brevmottakere);

    const visLeggTilNyBrevmottakerKnapp =
        behandling.fagsystem !== Fagsystem.EF &&
        !harDødsboBrevmottaker &&
        (brevmottakere.length < 2 || harBruker);

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
                            onClick={visForm}
                        >
                            Legg til ny brevmottaker
                        </Button>
                    </div>
                )}
            </VStack>
        </Box>
    );
}
