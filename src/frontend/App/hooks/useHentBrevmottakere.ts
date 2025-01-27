import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Brevmottakere } from '../../Komponenter/Behandling/Brevmottakere/brevmottakere';

export const useHentBrevmottakere = (
    behandlingId: string
): {
    hentBrevmottakere: () => Promise<void>;
    mottakere: Ressurs<Brevmottakere>;
} => {
    const { axiosRequest } = useApp();
    const [mottakere, settMottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}/mottakere`,
        };
        return axiosRequest<Brevmottakere, null>(behandlingConfig).then(
            (res: Ressurs<Brevmottakere>) => settMottakere(res)
        );
    }, [axiosRequest, behandlingId]);

    return {
        hentBrevmottakere,
        mottakere,
    };
};
