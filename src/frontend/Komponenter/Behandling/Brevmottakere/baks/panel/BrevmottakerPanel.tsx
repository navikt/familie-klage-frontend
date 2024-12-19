import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { BodyShort, Box, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { Brevmottaker, utledOppsumertBrevmottakereSomTekst } from '../brevmottaker';

type Props = {
    brevmottakere: Brevmottaker[];
};

export function BrevmottakerPanel({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const oppsumertBrevmottakereSomTekst = utledOppsumertBrevmottakereSomTekst(brevmottakere);

    return (
        <Box padding={'10'} background={'surface-info-subtle'}>
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
                {oppsumertBrevmottakereSomTekst.map((brevmottaker, index) => (
                    <li key={brevmottaker + index}>
                        <BodyShort key={brevmottaker + index}>{brevmottaker}</BodyShort>
                    </li>
                ))}
            </ul>
        </Box>
    );
}
