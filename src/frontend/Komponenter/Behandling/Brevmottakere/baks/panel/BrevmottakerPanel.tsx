import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { BodyShort, Box, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { utledOppsumertBrevmottakere } from '../oppsummertBrevmottaker';
import { Brevmottakere } from '../../brevmottakere';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { usePersonopplysningerContext } from '../../../../../App/context/PersonopplysningerContext';
import { ToggleName } from '../../../../../App/context/toggles';

type Props = {
    brevmottakere: Brevmottakere;
};

export function BrevmottakerPanel({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const {
        fagsakEier: { personIdent: fagsakEierPersonIdent },
        søker: { personIdent: søkerPersonIdent },
    } = usePersonopplysningerContext();
    const { toggles } = useToggles();

    const oppsumertBrevmottakere = utledOppsumertBrevmottakere(brevmottakere);
    const kanEndreBrevmottakere =
        behandlingErRedigerbar &&
        (fagsakEierPersonIdent === søkerPersonIdent ||
            toggles[ToggleName.BRUK_SØKER_PERSONOPPLYSNINGER] === false);

    return (
        <>
            <Box background={'info-moderate'} padding={'space-24'}>
                <HStack justify={'space-between'} align={'center'}>
                    <Label htmlFor={'brevmottakere_liste'}>Brevmottakere</Label>
                    {kanEndreBrevmottakere && (
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
