import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TidslinjeContainer } from './TidslinjeContainer';
import { Behandling } from '../../../App/typer/fagsak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { ResultatOppsummering } from './ResultatOppsummering';

const ResultatStyling = styled.div`
    width: 90%;
    margin: 2rem 5rem 0 5rem;
`;

interface IResultat {
    behandling: Behandling;
}

export const Resultat: React.FC<IResultat> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const [historikk, settHistorikk] = useState<Ressurs<IBehandlingshistorikk[]>>(byggTomRessurs);

    useEffect(() => {
        axiosRequest<IBehandlingshistorikk[], null>({
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandling.id}`,
        }).then((res: Ressurs<IBehandlingshistorikk[]>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settHistorikk(res);
            }
        });
    }, [axiosRequest, behandling]);

    return (
        <ResultatStyling>
            <ResultatOppsummering behandling={behandling} />
            <DataViewer response={{ historikk }}>
                {({ historikk }) => <TidslinjeContainer historikkForVisning={historikk} />}
            </DataViewer>
        </ResultatStyling>
    );
};
