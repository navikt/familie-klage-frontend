import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { IBehandlingshistorikk } from './Behandlingshistorikk';

const Historikk: React.FC = () => {
    const { behandlingHistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikk }}>
            {({ behandlingHistorikk }) => (
                <HistorikkContainer behandlingHistorikk={behandlingHistorikk} />
            )}
        </DataViewer>
    );
};

const HistorikkContainer: React.FC<{
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandlingHistorikk }) => {
    const steg = behandlingHistorikk.map((historikk) => historikk.steg);

    return (
        <>
            {behandlingHistorikk.map((historikk, index) => {
                const erSisteForekomstAvStegtype = steg.indexOf(historikk.steg) === index;
                return (
                    <HistorikkInnslag
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
