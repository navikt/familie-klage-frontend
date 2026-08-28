import type { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import type { IBehandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/behandlingshistorikk';
import { useApp } from '../context/AppContext';
import type { Ressurs } from '../typer/ressurs';
import { byggTomRessurs } from '../typer/ressurs';

export const useHentBehandlingHistorikk = (
    behandlingId: string
): {
    hentBehandlingshistorikkCallback: () => void;
    behandlingHistorikk: Ressurs<IBehandlingshistorikk[]>;
} => {
    const { axiosRequest } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] = useState<
        Ressurs<IBehandlingshistorikk[]>
    >(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandlingId}`,
        };
        axiosRequest<IBehandlingshistorikk[], null>(behandlingConfig).then(
            (res: Ressurs<IBehandlingshistorikk[]>) => settBehandlingHistorikk(res)
        );
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
