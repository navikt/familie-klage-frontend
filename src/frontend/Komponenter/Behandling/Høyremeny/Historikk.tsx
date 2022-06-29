import * as React from 'react';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import HistorikkOppdatering from './HistorikkOppdatering';
import { useEffect, useState } from 'react';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';

interface IBehandlingshistorikk {
    id: string;
    behandlingId: string;
    steg: string;
    opprettetAvNavn: string;
    opprettetAv: string;
    endretTid: string;
}

const Historikk: React.FC = () => {
    const { axiosRequest } = useApp();
    const [behandlingshistorikk, settBehandlingshistorikk] = useState<IBehandlingshistorikk>({
        id: '',
        behandlingId: '',
        steg: '',
        opprettetAvNavn: '',
        opprettetAv: '',
        endretTid: '',
    });

    useEffect(() => {
        axiosRequest<IBehandlingshistorikk, null>({
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/1`,
        }).then((res: Ressurs<IBehandlingshistorikk>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settBehandlingshistorikk(res.data);
            }
        });
    }, [axiosRequest]);

    return (
        <div>
            <HistorikkOppdatering
                steg={behandlingshistorikk.steg}
                endretTid={behandlingshistorikk.endretTid}
                opprettetAvNavn={behandlingshistorikk.opprettetAv}
            />
        </div>
    );
};

export default hiddenIf(Historikk);
