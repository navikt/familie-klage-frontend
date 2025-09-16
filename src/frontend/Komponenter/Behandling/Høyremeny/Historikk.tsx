import * as React from 'react';
import { HistorikkInnslag } from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { IBehandlingshistorikk, HøyremenyHendelse } from './behandlingshistorikk';
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
}> = ({ behandling, behandlingHistorikk }) => {
    const stegTypeTilHistorikkInnslag = behandlingHistorikk.reduce(
        (
            acc: Map<HøyremenyHendelse, IBehandlingshistorikk[]>,
            historikk: IBehandlingshistorikk
        ) => {
            const hendelseType = historikk.historikkHendelse ?? historikk.steg;
            return new Map(acc).set(hendelseType, [...(acc.get(hendelseType) ?? []), historikk]);
        },
        new Map<HøyremenyHendelse, IBehandlingshistorikk[]>()
    );

    const sisteInnslagPerUnikeHistorikkHendelse = Array.from(
        stegTypeTilHistorikkInnslag.values()
    ).map((historikkInnslagListe: IBehandlingshistorikk[]) =>
        historikkInnslagListe.reduce((nyesteForekomst, current) =>
            Date.parse(current.endretTid) > Date.parse(nyesteForekomst.endretTid)
                ? current
                : nyesteForekomst
        )
    );

    return (
        <>
            {sisteInnslagPerUnikeHistorikkHendelse.map((historikk, index) => (
                <HistorikkInnslag
                    behandling={behandling}
                    historikkInnslag={historikk}
                    key={index}
                />
            ))}
        </>
    );
};
