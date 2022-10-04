import * as React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { TidslinjeContainer } from './TidslinjeContainer';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { KlageresultatVisning } from './KlageresultatVisning';

const ResultatStyling = styled.div`
    margin: 2rem 5rem 0 5rem;
`;

export const Resultat: React.FC = () => {
    const { behandling, hentBehandling, behandlingHistorikk } = useBehandling();

    useEffect(() => {
        hentBehandling.rerun();
    }, [hentBehandling]);

    return (
        <DataViewer response={{ behandling, behandlingHistorikk }}>
            {({ behandling, behandlingHistorikk }) => (
                <ResultatStyling>
                    <Heading spacing size="large" level="5">
                        Resultat
                    </Heading>
                    <TidslinjeContainer
                        aktivtSteg={behandling.steg}
                        historikkForVisning={behandlingHistorikk}
                    />
                    <KlageresultatVisning klageresultat={behandling.klageresultat} />
                </ResultatStyling>
            )}
        </DataViewer>
    );
};
