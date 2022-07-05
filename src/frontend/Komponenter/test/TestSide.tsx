import React from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';

const StyledTest = styled.div`
    display: flex;
    flex-direction: column;
    width: 10rem;
    margin: 2rem;
`;

export const TestSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    const lagBehandling = () => {
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res?.data.id}`);
            }
        });
    };

    return (
        <Side className={'container'}>
            <StyledTest>
                [Test]
                <Button onClick={lagBehandling}>Lag behandling</Button>
            </StyledTest>
        </Side>
    );
};
