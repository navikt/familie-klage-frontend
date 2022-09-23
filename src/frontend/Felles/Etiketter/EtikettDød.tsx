import React from 'react';
import styled from 'styled-components';
import { formaterIsoDato } from '../../App/utils/formatter';
import { Tag } from '@navikt/ds-react';

const SortEtikett = styled(Tag)`
    background-color: black;
    color: #eee;
    margin-left: 0.5rem;
    border: none;
`;

const EtikettDød: React.FC<{ dødsdato: string }> = ({ dødsdato }) => (
    <SortEtikett variant={'info'} size={'small'}>
        Død {formaterIsoDato(dødsdato)}
    </SortEtikett>
);

export default EtikettDød;
