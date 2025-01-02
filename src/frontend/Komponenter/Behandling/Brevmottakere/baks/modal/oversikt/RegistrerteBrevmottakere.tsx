import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import CountryData from '@navikt/land-verktoy';
import { Brevmottaker } from '../../brevmottaker';
import { EøsLandkode } from '../../../../../../Felles/Landvelger/landkode';
import { mottakertypeVisningsnavn } from '../../mottakertype';

type Props = {
    brevmottakere: Brevmottaker[];
    slettBrevmottaker: (brevmottakerId: string) => void;
    erLesevisning: boolean;
};

export function RegistrerteBrevmottakere({
    brevmottakere,
    slettBrevmottaker,
    erLesevisning,
}: Props) {
    const countryInstance = CountryData.getCountryInstance('nb');
    return (
        <Box padding={'1'}>
            {brevmottakere.map((brevmottaker) => {
                const land = countryInstance.findByValue(brevmottaker.landkode).label;
                return (
                    <VStack key={brevmottaker.id} marginBlock={'2 2'} gap={'2'}>
                        <HStack justify={'space-between'}>
                            <Heading level={'2'} size={'small'}>
                                {mottakertypeVisningsnavn[brevmottaker.mottakertype]}
                            </Heading>
                            {!erLesevisning && (
                                <Button
                                    variant={'tertiary'}
                                    onClick={() => slettBrevmottaker(brevmottaker.id)}
                                    size={'small'}
                                    icon={<TrashIcon />}
                                >
                                    Fjern
                                </Button>
                            )}
                        </HStack>
                        <HGrid gap={'2'} columns={'1fr 2fr'}>
                            <div>Navn:</div>
                            <div>{brevmottaker.navn}</div>
                            <div>Land:</div>
                            <div>{land}</div>
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
                        {brevmottaker.landkode !== EøsLandkode.NO && (
                            <Alert variant={'info'} inline={true}>
                                Ved utenlandsk adresse skal postnummer og poststed legges i
                                adresselinjene.
                            </Alert>
                        )}
                    </VStack>
                );
            })}
        </Box>
    );
}
