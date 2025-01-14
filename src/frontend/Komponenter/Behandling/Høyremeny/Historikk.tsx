import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IBehandlingshistorikk } from './behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';
import { HistorikkInnslagV2 } from './HistorikkInnslagV2';

const Historikk: React.FC<{ hidden: boolean }> = ({ hidden }) => {
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
    return (
        <>
            {behandlingHistorikk.map((historikk, index) => {
                return (
                    <HistorikkInnslag
                        behandling={behandling}
                        steg={historikk.steg}
                        behandlingStatus={historikk.behandlingStatus}
                        opprettetAv={historikk.opprettetAv}
                        endretTid={historikk.endretTid}
                        key={index}
                    />
                );
            })}
            <HistorikkInnslagV2 tittelTekst="Tittel!" detaljTekst="01.01.2025 kl.09:00 | Z994175" />
            <HistorikkInnslagV2
                tittelTekst="Tittel!"
                bodyTekst="Noe har skjedd"
                detaljTekst="01.01.2025 kl.09:00 | Z994175"
            />
        </>
    );
};

export default Historikk;
