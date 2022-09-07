import * as React from 'react';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import HistorikkOppdatering from './HistorikkOppdatering';
import { useEffect, useState } from 'react';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { IBehandlingshistorikk } from './behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';

const Historikk: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const [behandlingshistorikk, settBehandlingshistorikk] = useState<IBehandlingshistorikk[]>([]);

    useEffect(() => {
        axiosRequest<IBehandlingshistorikk[], null>({
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandling.id}`,
        }).then((res: Ressurs<IBehandlingshistorikk[]>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settBehandlingshistorikk(res.data);
            }
        });
    }, [axiosRequest, behandling]);

    return (
        <div>
            {behandlingshistorikk.map((behandlingshistorikk, index) => (
                <HistorikkOppdatering
                    key={index}
                    steg={behandlingshistorikk.steg}
                    endretTid={behandlingshistorikk.endretTid}
                    opprettetAv={behandlingshistorikk.opprettetAv}
                    opprettet={false}
                />
            ))}
        </div>
    );
};

export default hiddenIf(Historikk);
