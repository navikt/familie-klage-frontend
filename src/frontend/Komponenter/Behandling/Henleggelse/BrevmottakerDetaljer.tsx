import { Alert, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import React, { ReactNode } from 'react';
import { MottakerRolle, mottakerRolleVisningsnavn } from '../Brevmottakere/mottakerRolle';
import { erNyBrevmottakerPersonUtenIdent, NyBrevmottaker } from '../Brevmottakere/nyBrevmottaker';
import CountryData from '@navikt/land-verktoy';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';
import { Divider } from '../../../Felles/Divider/Divider';

const countryInstance = CountryData.getCountryInstance('nb');

function utledSlettKnappIkon(mottakerRolle: MottakerRolle): ReactNode {
    if (
        mottakerRolle === MottakerRolle.DØDSBO ||
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE
    ) {
        return <ArrowUndoIcon />;
    }
    return <TrashIcon />;
}

function utledSlettKnappTittel(mottakerRolle: MottakerRolle): string {
    if (
        mottakerRolle === MottakerRolle.DØDSBO ||
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE
    ) {
        return 'Tilbakestill til bruker';
    }
    return 'Fjern';
}

interface Props {
    brevmottaker: NyBrevmottaker;
}

export function BrevmottakerDetaljer({ brevmottaker }: Props) {
    const { slettBrevmottaker } = useBrevmottakereContext();

    if (erNyBrevmottakerPersonUtenIdent(brevmottaker)) {
        return (
            <VStack gap={'2'}>
                <Divider />
                <HStack justify={'space-between'}>
                    <Heading level={'3'} size={'xsmall'}>
                        {mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]}
                    </Heading>
                    <Button
                        variant={'tertiary'}
                        onClick={() => slettBrevmottaker(brevmottaker)}
                        size={'small'}
                        icon={utledSlettKnappIkon(brevmottaker.mottakerRolle)}
                    >
                        {utledSlettKnappTittel(brevmottaker.mottakerRolle)}
                    </Button>
                </HStack>
                <HGrid gap={'2'} columns={'1fr 1fr'}>
                    <div>Navn:</div>
                    <div>{brevmottaker.navn}</div>
                    <div>Land:</div>
                    <div>{countryInstance.findByValue(brevmottaker.landkode).label}</div>
                    <div>Adresselinje 1:</div>
                    <div>{brevmottaker.adresselinje1}</div>
                    <div>Adresselinje 2:</div>
                    <div>{brevmottaker.adresselinje2 || '-'}</div>
                    {brevmottaker.postnummer && (
                        <>
                            <div>Postnummer</div>
                            <div>{brevmottaker.postnummer || '-'}</div>
                        </>
                    )}
                    {brevmottaker.poststed && (
                        <>
                            <div>Poststed</div>
                            <div>{brevmottaker.poststed || '-'}</div>
                        </>
                    )}
                </HGrid>
                {brevmottaker.mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE && (
                    <Alert variant={'info'} inline={true}>
                        Ved utenlandsk adresse skal postnummer og poststed legges i adresselinjene.
                    </Alert>
                )}
                {brevmottaker.mottakerRolle === MottakerRolle.DØDSBO && (
                    <Alert variant={'info'} inline={true}>
                        Ved dødsbo kan kun en brevmottaker legges til.
                    </Alert>
                )}
            </VStack>
        );
    }

    return (
        <VStack gap={'0'}>
            <Divider />
            <HStack justify={'space-between'}>
                <Heading level={'3'} size={'xsmall'}>
                    {mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]}
                </Heading>
            </HStack>
            <HGrid gap={'2'} columns={'1fr 1fr'}>
                <div>Navn:</div>
                <div>{brevmottaker.navn}</div>
            </HGrid>
        </VStack>
    );
}
