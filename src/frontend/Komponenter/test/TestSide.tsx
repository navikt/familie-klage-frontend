import React from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Behandling } from '../../App/typer/fagsak';

const StyledTest = styled.div`
    display: flex;
    flex-direction: column;
    width: 10rem;
    margin: 2rem;
`;

export const TestSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    const lagBehandling = (url: string) => {
        axiosRequest<Behandling, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res.data.id}/${url}`);
            }
        });
    };

    return (
        <Side className={'container'}>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til formkrav</b>
                <Button onClick={() => lagBehandling('')}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til vurdering</b>
                <Button onClick={() => lagBehandling('vurdering')}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til brev</b>
                <Button onClick={() => lagBehandling('brev')}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til resultat</b>
                <Button onClick={() => lagBehandling('resultat')}>Lag behandling</Button>
            </StyledTest>
        </Side>
    );
};
