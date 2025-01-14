import { BodyShort, Detail, VStack, Label, HStack } from '@navikt/ds-react';
import * as React from 'react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import styled from 'styled-components';

interface IHistorikkOppdateringV2 {
    tittelTekst: string;
    bodyTekst?: string;
    detaljTekst: string;
}

const InnslagHStack = styled(HStack)`
    margin: 1rem 1.6rem;
    gap: 1rem;
    align-items: center;
`;

const StipletLinje = styled.div`
    border-left: 0.15rem dotted ${ABorderStrong};
    height: 2rem;
`;

export const HistorikkInnslagV2: React.FC<IHistorikkOppdateringV2> = ({
    tittelTekst,
    bodyTekst,
    detaljTekst,
}) => {
    return (
        <InnslagHStack>
            <VStack gap="2" align="center">
                <PersonCircleIcon fontSize="1.5rem" />
                <StipletLinje />
            </VStack>
            <VStack>
                <Label size="small">{tittelTekst}</Label>
                {bodyTekst && <BodyShort size="small">{bodyTekst}</BodyShort>}
                <Detail>{detaljTekst}</Detail>
            </VStack>
        </InnslagHStack>
    );
};
