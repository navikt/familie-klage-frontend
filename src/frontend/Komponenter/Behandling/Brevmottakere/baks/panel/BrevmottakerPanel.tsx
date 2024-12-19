import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { BodyShort, Box, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { Brevmottaker } from '../brevmottaker';
import { utledOppsumertBrevmottakere } from '../oppsumertBrevmottaker';

type Props = {
    brevmottakere: Brevmottaker[];
};

export function BrevmottakerPanel({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const oppsumertBrevmottakere = utledOppsumertBrevmottakere(brevmottakere);

    return (
        <Box background={'surface-info-subtle'} padding={'10'} width={'100%'} maxWidth={'1000px'}>
            <HStack justify={'space-between'} align={'center'}>
                <Label htmlFor={'brevmottakere_liste'}>Brevmottakere</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til eller fjern brevmottakere'}>
                        <Button
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/fjern brevmottakere
                        </Button>
                    </Tooltip>
                )}
            </HStack>
            <ul id={'brevmottakere_liste'}>
                {oppsumertBrevmottakere.map((oppsumertBrevmottaker) => (
                    <li key={oppsumertBrevmottaker.id}>
                        <BodyShort>{oppsumertBrevmottaker.visningstekst}</BodyShort>
                    </li>
                ))}
            </ul>
        </Box>
    );
}
