import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { BodyShort, Box, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { Brevmottaker, utledOppsumeringsnavnPåBrevmottakere } from '../brevmottaker';

type Props = {
    brevmottakere: Brevmottaker[];
};

export function BrevmottakerPanel({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const navn = utledOppsumeringsnavnPåBrevmottakere(brevmottakere);

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
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Box>
    );
}
