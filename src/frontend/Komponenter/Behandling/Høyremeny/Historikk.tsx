import * as React from 'react';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import HistorikkOppdatering from './HistorikkOppdatering';
import { useEffect, useState } from 'react';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { IBehandlingshistorikk } from './behandlingshistorikk';

const Historikk: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [behandlingshistorikk, settBehandlingshistorikk] = useState<IBehandlingshistorikk[]>([]);

    useEffect(() => {
        axiosRequest<IBehandlingshistorikk[], null>({
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandlingId}`,
        }).then((res: Ressurs<IBehandlingshistorikk[]>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settBehandlingshistorikk(res.data);
            }
        });
    }, [axiosRequest, behandlingId]);

    return (
        <div>
            {behandlingshistorikk.map((behandlingshistorikk) => (
                <HistorikkOppdatering
                    key={behandlingId}
                    steg={behandlingshistorikk.steg}
                    endretTid={behandlingshistorikk.endretTid}
                    opprettetAv={behandlingshistorikk.opprettetAv}
                />
            ))}
        </div>
    );
};

export default hiddenIf(Historikk);
