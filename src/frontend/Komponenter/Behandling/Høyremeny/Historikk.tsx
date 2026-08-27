import * as React from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import type { Behandling } from '../../../App/typer/fagsak';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import type { IBehandlingshistorikk } from './behandlingshistorikk';
import { HistorikkInnslag } from './HistorikkInnslag';
import { utledSisteHistorikkInnslagPerKjede } from './utils';

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
}> = ({ behandling, behandlingHistorikk }) => {
    const sisteHistorikkInnslagPerKjede = utledSisteHistorikkInnslagPerKjede(behandlingHistorikk);

    return (
        <>
            {sisteHistorikkInnslagPerKjede.map((historikk, index) => (
                <HistorikkInnslag
                    behandling={behandling}
                    historikkInnslag={historikk}
                    key={index}
                />
            ))}
        </>
    );
};
