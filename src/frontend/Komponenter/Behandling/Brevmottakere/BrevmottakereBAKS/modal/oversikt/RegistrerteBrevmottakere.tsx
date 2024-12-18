import React from 'react';

import styled from 'styled-components';

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { AFontWeightBold } from '@navikt/ds-tokens/dist/tokens';
import CountryData from '@navikt/land-verktoy';
import { Brevmottaker } from '../../brevmottaker';
import { EøsLandkode } from '../../../../../../Felles/Landvelger/landkode';
import { mottakertypeVisningsnavn } from '../../mottakertype';

const DefinitionList = styled.dl`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 10rem 20rem;
    margin-left: 1rem;

    dt {
        font-weight: ${AFontWeightBold};
    }

    dd {
        margin-left: 0;
    }
`;

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
    return brevmottakere.map((brevmottaker) => {
        const land = CountryData.getCountryInstance('nb').findByValue(brevmottaker.landkode);
        return (
            <VStack key={brevmottaker.id} marginBlock={'2 2'}>
                <HStack justify={'space-between'}>
                    <Heading level={'2'} size={'medium'}>
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
                <DefinitionList>
                    <dt>Navn</dt>
                    <dd>{brevmottaker.navn}</dd>
                    <dt>Land</dt>
                    <dd>{land.label}</dd>
                    <dt>Adresselinje 1</dt>
                    <dd>{brevmottaker.adresselinje1}</dd>
                    <dt>Adresselinje 2</dt>
                    <dd>{brevmottaker.adresselinje2 || '-'}</dd>
                    {brevmottaker.postnummer && (
                        <>
                            <dt>Postnummer</dt>
                            <dd>{brevmottaker.postnummer || '-'}</dd>
                        </>
                    )}
                    {brevmottaker.poststed && (
                        <>
                            <dt>Poststed</dt>
                            <dd>{brevmottaker.poststed || '-'}</dd>
                        </>
                    )}
                </DefinitionList>
                {brevmottaker.landkode !== EøsLandkode.NO && (
                    <Alert variant={'info'} inline={true}>
                        Ved utenlandsk adresse skal postnummer og poststed legges i adresselinjene.
                    </Alert>
                )}
            </VStack>
        );
    });
}
