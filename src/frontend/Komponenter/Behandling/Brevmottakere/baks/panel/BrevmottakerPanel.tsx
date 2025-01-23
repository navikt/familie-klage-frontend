import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { BodyShort, Box, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { utledOppsumertBrevmottakere } from '../oppsumertBrevmottaker';
import { Brevmottakere } from '../../brevmottakere';

type Props = {
    brevmottakere: Brevmottakere;
};

export function BrevmottakerPanel({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const oppsumertBrevmottakere = utledOppsumertBrevmottakere(brevmottakere);

    return (
        <Box background={'surface-info-subtle'} padding={'6'}>
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
