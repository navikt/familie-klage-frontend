import { ErrorMessage, Textarea, TextareaProps } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

const StyledTextArea = styled(Textarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 60rem;
`;

type Props = TextareaProps & { feilmelding?: string };

export const EnsligTextArea: React.FC<Props> = ({ feilmelding, ...props }) => {
    return (
        <div>
            <StyledTextArea {...props} />
            <ErrorMessage>{feilmelding}</ErrorMessage>
        </div>
    );
};
