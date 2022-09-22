import NavFrontendSpinner from 'nav-frontend-spinner';
import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';

const StyledSystemetLaster = styled.div`
    height: 100%;
    width: 100%;
    z-index: 1000;
`;

const StyledWrapper = styled.div`
    padding-top: 2rem;
    width: 13rem;
    margin: auto;
`;

const StyledSpinner = styled.div`
    margin: auto;
    width: 4rem;
`;

const SystemetLaster: FC<{ tittel?: string }> = ({ tittel = '' }) => {
    return (
        <StyledSystemetLaster>
            <StyledWrapper>
                <Heading>{tittel}</Heading>
                <StyledSpinner>
                    <NavFrontendSpinner
                        className={'systemet-laster__content--spinner'}
                        transparent={true}
                    />
                </StyledSpinner>
            </StyledWrapper>
        </StyledSystemetLaster>
    );
};

export default SystemetLaster;
