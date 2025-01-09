import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { IBrevmottakere } from '../../Komponenter/Behandling/Brevmottakere/ef/typer';

export const useHentBrevmottakere = (
    behandlingId: string
): {
    hentBrevmottakere: () => Promise<void>;
    mottakere: Ressurs<IBrevmottakere>;
} => {
    const { axiosRequest } = useApp();
    const [mottakere, settMottakere] = useState<Ressurs<IBrevmottakere>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}/mottakere`,
        };
        return axiosRequest<IBrevmottakere, null>(behandlingConfig).then(
            (res: Ressurs<IBrevmottakere>) => settMottakere(res)
        );
    }, [axiosRequest, behandlingId]);

    return {
        hentBrevmottakere,
        mottakere,
    };
};
