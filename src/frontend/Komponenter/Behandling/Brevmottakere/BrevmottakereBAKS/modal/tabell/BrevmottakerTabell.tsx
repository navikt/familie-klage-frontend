import React from 'react';

import styled from 'styled-components';

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading } from '@navikt/ds-react';
import { AFontWeightBold } from '@navikt/ds-tokens/dist/tokens';
import CountryData from '@navikt/land-verktoy';
import { Brevmottaker, mottakerVisningsnavn } from '../../BrevmottakereBAKS';

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledDiv = styled.div`
    margin-top: 2.5rem;
`;

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

interface Props {
    mottaker: Brevmottaker;
    fjernMottaker: (brevmottakerId: string) => void;
    erLesevisning: boolean;
}

const BrevmottakerTabell = ({ mottaker, fjernMottaker, erLesevisning }: Props) => {
    const land = CountryData.getCountryInstance('nb').findByValue(mottaker.land);

    return (
        <StyledDiv>
            <FlexDiv>
                <Heading size="medium">{mottakerVisningsnavn[mottaker.mottakertype]}</Heading>
                {!erLesevisning && (
                    <Button
                        variant={'tertiary'}
                        onClick={() => fjernMottaker(mottaker.id)}
                        loading={false}
                        disabled={false}
                        size={'small'}
                        icon={<TrashIcon />}
                    >
                        {'Fjern'}
                    </Button>
                )}
            </FlexDiv>
            <DefinitionList>
                <dt>Navn</dt>
                <dd>{mottaker.navn}</dd>
                <dt>Land</dt>
                <dd>{land.label}</dd>
                <dt>Adresselinje 1</dt>
                <dd>{mottaker.adresselinje1}</dd>
                <dt>Adresselinje 2</dt>
                <dd>{mottaker.adresselinje2 || '-'}</dd>
                <dt>Postnummer</dt>
                <dd>{mottaker.postnummer || '-'}</dd>
                <dt>Poststed</dt>
                <dd>{mottaker.poststed || '-'}</dd>
            </DefinitionList>

            {mottaker.land !== 'NO' && (
                <Alert variant="info" inline>
                    Ved utenlandsk adresse skal postnummer og poststed legges i adresselinjene.
                </Alert>
            )}
        </StyledDiv>
    );
};

export default BrevmottakerTabell;
