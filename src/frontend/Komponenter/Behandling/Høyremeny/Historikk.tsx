import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { IBehandlingshistorikk } from './Behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';

const Historikk: React.FC = () => {
    const { behandlingHistorikk, behandling } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikk, behandling }}>
            {({ behandlingHistorikk, behandling }) => (
                <HistorikkContainer
                    behandlingHistorikk={behandlingHistorikk}
                    behandling={behandling}
                />
            )}
        </DataViewer>
    );
};

const HistorikkContainer: React.FC<{
    behandlingHistorikk: IBehandlingshistorikk[];
    behandling: Behandling;
}> = ({ behandlingHistorikk, behandling }) => {
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
