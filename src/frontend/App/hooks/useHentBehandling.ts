import type { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Behandling } from '../typer/fagsak';
import type { Ressurs } from '../typer/ressurs';
import { byggTomRessurs } from '../typer/ressurs';

export const useHentBehandling = (
    behandlingId: string
): {
    hentBehandlingCallback: () => void;
    behandling: Ressurs<Behandling>;
} => {
    const { axiosRequest } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());

    const hentBehandlingCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}`,
        };
        axiosRequest<Behandling, null>(behandlingConfig).then((res: Ressurs<Behandling>) =>
            settBehandling(res)
        );
    }, [axiosRequest, behandlingId]);

    return {
        hentBehandlingCallback,
        behandling,
    };
};
