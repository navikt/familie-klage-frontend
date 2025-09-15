import * as React from 'react';
import { HistorikkInnslag } from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { IBehandlingshistorikk } from './behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';

export const Historikk: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const { behandling, behandlingHistorikk } = useBehandling();

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer response={{ behandling, behandlingHistorikk }}>
            {({ behandling, behandlingHistorikk }) => (
                <HistorikkContainer
                    behandling={behandling}
                    behandlingHistorikk={behandlingHistorikk}
                />
            )}
        </DataViewer>
    );
};

const HistorikkContainer: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => (
    <>
        {behandlingHistorikk.map((historikk, index) => (
            <HistorikkInnslag behandling={behandling} historikkInnslag={historikk} key={index} />
        ))}
    </>
);
