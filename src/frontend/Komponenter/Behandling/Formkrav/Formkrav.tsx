/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';
import { FormkravHøyre } from './FormkravHøyre';
import { FormkravVenstre } from './FormkravVenstre';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 2rem 5rem 0 5rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
`;

const FormKravStylingFooter = styled.div`
    width: 100%;
    padding-left: 5rem;
    display: flex;
`;

export const Formkrav: React.FC = () => {
    const [låst, settLåst] = useState(false);

    return (
        <FormKravStyling>
            <FormKravStylingBody>
                <FormkravVenstre props={{ låst }} />
                <FormkravHøyre props={{ låst, settLåst }} />
            </FormKravStylingBody>
            <FormKravStylingFooter></FormKravStylingFooter>
        </FormKravStyling>
    );
};
