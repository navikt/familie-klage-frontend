import React from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Behandling } from '../../App/typer/fagsak';
import { useBehandling } from '../../App/context/BehandlingContext';

const StyledTest = styled.div`
    display: flex;
    flex-direction: column;
    width: 10rem;
    margin: 2rem;
`;

export const TestSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    const { settFormkravGyldig, settFormkravLåst } = useBehandling();

    const lagStandardBehandling = () => {
        axiosRequest<Behandling, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res.data.id}`);
            }
        });
    };

    const lagFormkravBehandling = () => {
        axiosRequest<Behandling, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res.data.id}`);
            }
        });
        settFormkravGyldig(true);
        settFormkravLåst(true);
    };

    return (
        <Side className={'container'}>
            <StyledTest>
                <b>[Test] Opprett standard dummy-behandling</b>
                <Button onClick={lagStandardBehandling}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling med ferdig utfylt formkrav</b>
                <Button onClick={lagFormkravBehandling}>Lag behandling</Button>
            </StyledTest>
        </Side>
    );
};
