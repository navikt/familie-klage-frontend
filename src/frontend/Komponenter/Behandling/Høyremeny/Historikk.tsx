import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { IBehandlingshistorikk } from './Behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';

const Historikk: React.FC = () => {
    const { behandling, behandlingHistorikk } = useBehandling();

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
    const steg = behandlingHistorikk.map((historikk) => historikk.steg);

    return (
        <>
            {behandlingHistorikk.map((historikk, index) => {
                const erSisteForekomstAvStegtype = steg.indexOf(historikk.steg) === index;
                return (
                    <HistorikkInnslag
                        behandling={behandling}
                        steg={historikk.steg}
                        opprettetAv={historikk.opprettetAv}
                        endretTid={historikk.endretTid}
                        key={index}
                        visStegutfall={erSisteForekomstAvStegtype}
                    />
                );
            })}
        </>
    );
};

export default hiddenIf(Historikk);
