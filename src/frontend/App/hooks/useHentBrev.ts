import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { IFritekstBrev } from '../../Komponenter/Behandling/Brev/BrevTyper';
import { Ressurs } from '../typer/ressurs';

export const useHentBrev = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [mellomlagretBrev, settMellomlagretBrev] = useState<IFritekstBrev>();

    useEffect(() => {
        axiosRequest<IFritekstBrev, null>({
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}`,
        }).then((res: Ressurs<IFritekstBrev>) => {
            if (res.status === 'SUKSESS') {
                settMellomlagretBrev(res.data);
            }
        });
    }, [settMellomlagretBrev]);
    return {
        mellomlagretBrev,
    };
};
