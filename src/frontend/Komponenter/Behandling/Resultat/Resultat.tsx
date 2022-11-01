import * as React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Tidslinje } from './Tidslinje';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AnkeVisning } from './AnkeVisning';

const FaneContainer = styled.div`
    margin: 2rem 5rem 0rem 5rem;
`;

const TidslinjeContainer = styled.div`
    @media (max-width: 1449px) {
        display: flex;
        justify-content: center;
    }
    @media (min-width: 1450px) {
        margin-top: 12rem;
    }
`;

export const Resultat: React.FC = () => {
    const { behandling, hentBehandling, behandlingHistorikk } = useBehandling();

    useEffect(() => {
        hentBehandling.rerun();
    }, [hentBehandling]);

    return (
        <DataViewer response={{ behandling, behandlingHistorikk }}>
            {({ behandling, behandlingHistorikk }) => (
                <FaneContainer>
                    <Heading spacing size="large" level="5">
                        Resultat
                    </Heading>
                    <TidslinjeContainer>
                        <Tidslinje
                            behandling={behandling}
                            behandlingHistorikk={behandlingHistorikk}
                        />
                        <AnkeVisning behandling={behandling} />
                    </TidslinjeContainer>
                </FaneContainer>
            )}
        </DataViewer>
    );
};
