import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';

const Historikk: React.FC = () => {
    const { behandlingHistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikk }}>
            {({ behandlingHistorikk }) => (
                <>
                    {behandlingHistorikk.map((behandlingshistorikk, index) => (
                        <HistorikkInnslag
                            key={index}
                            steg={behandlingshistorikk.steg}
                            endretTid={behandlingshistorikk.endretTid}
                            opprettetAv={behandlingshistorikk.opprettetAv}
                            opprettet={false}
                        />
                    ))}
                </>
            )}
        </DataViewer>
    );
};

export default hiddenIf(Historikk);
