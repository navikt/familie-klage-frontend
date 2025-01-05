import React, { useState } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import CountryData from '@navikt/land-verktoy';
import { Brevmottaker } from '../brevmottaker';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';
import { Mottakertype, mottakertypeVisningsnavn } from '../mottakertype';

type Props = {
    brevmottaker: Brevmottaker;
    slettBrevmottaker: (brevmottakerId: string) => Promise<void>;
    erLesevisning: boolean;
};

const countryInstance = CountryData.getCountryInstance('nb');

export function BrevmottakerDetaljer({ brevmottaker, slettBrevmottaker, erLesevisning }: Props) {
    const [laster, setLaster] = useState(false);
    return (
        <Box padding={'2'}>
            <VStack marginBlock={'2 2'} gap={'2'}>
                <HStack justify={'space-between'}>
                    <Heading level={'2'} size={'small'}>
                        {mottakertypeVisningsnavn[brevmottaker.mottakertype]}
                    </Heading>
                    {!erLesevisning && (
                        <Button
                            variant={'tertiary'}
                            onClick={async () => {
                                // TODO : Dette kan håndteres bedre i react-query
                                setLaster(true);
                                await slettBrevmottaker(brevmottaker.id);
                                setLaster(false);
                            }}
                            size={'small'}
                            icon={<TrashIcon />}
                            loading={laster}
                        >
                            Fjern
                        </Button>
                    )}
                </HStack>
                <HGrid gap={'2'} columns={'1fr 2fr'}>
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
                {brevmottaker.landkode !== EøsLandkode.NO && (
                    <Alert variant={'info'} inline={true}>
                        Ved utenlandsk adresse skal postnummer og poststed legges i adresselinjene.
                    </Alert>
                )}
                {brevmottaker.mottakertype === Mottakertype.DØDSBO && (
                    <Alert variant={'info'} inline={true}>
                        Ved dødsbo kan kun en brevmottaker legges til.
                    </Alert>
                )}
            </VStack>
        </Box>
    );
}
