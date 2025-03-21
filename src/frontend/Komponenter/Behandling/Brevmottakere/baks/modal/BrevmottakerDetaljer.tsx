import React, { useState } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import CountryData from '@navikt/land-verktoy';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';
import { MottakerRolle, mottakerRolleVisningsnavn } from '../../mottakerRolle';
import { BrevmottakerPersonUtenIdent } from '../../brevmottaker';
import {
    legSlettbarBrevmottakerPersonUtenIdent,
    SlettbarBrevmottaker,
} from '../../slettbarBrevmottaker';

type Props = {
    brevmottaker: BrevmottakerPersonUtenIdent;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<boolean>;
    erLesevisning: boolean;
};

const countryInstance = CountryData.getCountryInstance('nb');

export function BrevmottakerDetaljer({ brevmottaker, slettBrevmottaker, erLesevisning }: Props) {
    const [visSlettFeilmelding, setVisSlettFeilmelding] = useState(false);
    const [laster, setLaster] = useState(false);
    return (
        <Box>
            <VStack marginBlock={'2 2'} gap={'2'}>
                {visSlettFeilmelding && (
                    <Alert
                        variant={'error'}
                        closeButton={true}
                        onClose={() => setVisSlettFeilmelding(false)}
                    >
                        Noe gikk galt ved sletting av brevmottaker.
                    </Alert>
                )}
                <HStack justify={'space-between'}>
                    <Heading level={'2'} size={'small'}>
                        {mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]}
                    </Heading>
                    {!erLesevisning && (
                        <Button
                            variant={'tertiary'}
                            onClick={async () => {
                                setVisSlettFeilmelding(false);
                                setLaster(true);
                                const erSukkess = await slettBrevmottaker(
                                    legSlettbarBrevmottakerPersonUtenIdent(brevmottaker.id)
                                );
                                if (!erSukkess) {
                                    setVisSlettFeilmelding(true);
                                }
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
                {brevmottaker.mottakerRolle === MottakerRolle.DØDSBO && (
                    <Alert variant={'info'} inline={true}>
                        Ved dødsbo kan kun en brevmottaker legges til.
                    </Alert>
                )}
            </VStack>
        </Box>
    );
}
