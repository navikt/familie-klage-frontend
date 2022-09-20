import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TidslinjeContainer } from './TidslinjeContainer';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Klageresultat } from '../../../App/typer/klageresultat';

const ResultatStyling = styled.div`
    margin: 2rem 5rem 0 5rem;
`;

interface IResultat {
    behandlingId: string;
}

export const Resultat: React.FC<IResultat> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const [historikk, settHistorikk] = useState<Ressurs<IBehandlingshistorikk[]>>(byggTomRessurs);
    const [klageresultat, settKlageresultat] = useState<Ressurs<Klageresultat[]>>(byggTomRessurs);

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

    useEffect(() => {
        axiosRequest<Klageresultat[], null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}/resultat`,
        }).then((res: Ressurs<Klageresultat[]>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settKlageresultat(res);
            }
        });
    }, [axiosRequest, behandling, behandlingId]);

    return (
        <DataViewer response={{ behandling, historikk, klageresultat }}>
            {({ behandling, historikk }) => (
                <ResultatStyling>
                    <Heading spacing size="large" level="5">
                        Resultat
                    </Heading>
                    <TidslinjeContainer
                        aktivtSteg={behandling.steg}
                        historikkForVisning={historikk}
                    />
                </ResultatStyling>
            )}
        </DataViewer>
    );
};
