import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { Alert, BodyShort, Box, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { utledOppsumertBrevmottakere } from '../oppsumertBrevmottaker';
import { Brevmottakere } from '../../brevmottakere';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../../App/context/toggles';

type Props = {
    brevmottakere: Brevmottakere;
};

export function BrevmottakerPanel({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { toggles } = useToggles();
    const { behandlingErRedigerbar } = useBehandling();

    const oppsumertBrevmottakere = utledOppsumertBrevmottakere(brevmottakere);

    return (
        <>
            {!toggles[ToggleName.leggTilBrevmottakerBaks] && (
                <Alert variant={'warning'}>
                    Muligheten for å legge til manuelle brevmottakere er foreløpig under utvikling
                    og er dermed ikke tilgjengelig. Det er foreløpig kun mulig å sende brev til
                    personen som er registrert på fagsaken.
                </Alert>
            )}
            <Box background={'surface-info-subtle'} padding={'6'}>
                <HStack justify={'space-between'} align={'center'}>
                    <Label htmlFor={'brevmottakere_liste'}>Brevmottakere</Label>
                    {behandlingErRedigerbar && toggles[ToggleName.leggTilBrevmottakerBaks] && (
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
        </>
    );
}
