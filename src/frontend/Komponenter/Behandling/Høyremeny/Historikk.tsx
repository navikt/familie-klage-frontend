import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';

const Historikk: React.FC = () => {
    const { behandlingHistorikk, behandling } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikk, behandling }}>
            {({ behandlingHistorikk, behandling }) => (
                <>
                    {behandlingHistorikk.map((behandlingshistorikk, index) => (
                        <HistorikkInnslag
                            behandling={behandling}
                            steg={behandlingshistorikk.steg}
                            opprettetAv={behandlingshistorikk.opprettetAv}
                            endretTid={behandlingshistorikk.endretTid}
                            opprettet={false}
                            key={index}
                        />
                    ))}
                </>
            )}
        </DataViewer>
    );
};

export default hiddenIf(Historikk);
