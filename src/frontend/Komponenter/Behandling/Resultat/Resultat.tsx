import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tidslinje } from './Tidslinje';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';

const FaneContainer = styled.div`
    margin: 2rem 5rem 0rem 5rem;
`;

const TidslinjeContainer = styled.div`
    @media (max-width: 1400px) {
        display: flex;
        justify-content: center;
    }
    @media (min-width: 1400px) {
        margin-top: 12rem;
    }
`;

interface IResultat {
    behandlingId: string;
}

export const Resultat: React.FC<IResultat> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const [historikk, settHistorikk] = useState<Ressurs<IBehandlingshistorikk[]>>(byggTomRessurs);

    useEffect(() => {
        hentBehandling.rerun();
    }, [hentBehandling]);

    useEffect(() => {
        axiosRequest<IBehandlingshistorikk[], null>({
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandlingId}`,
        }).then((res: Ressurs<IBehandlingshistorikk[]>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settHistorikk(res);
            }
        });
    }, [axiosRequest, behandling, behandlingId]);

    return (
        <DataViewer response={{ behandling, historikk }}>
            {({ behandling, historikk }) => (
                <FaneContainer>
                    <Heading spacing size="large" level="5">
                        Resultat
                    </Heading>
                    <TidslinjeContainer>
                        <Tidslinje behandling={behandling} behandlingHistorikk={historikk} />
                    </TidslinjeContainer>
                </FaneContainer>
            )}
        </DataViewer>
    );
};
