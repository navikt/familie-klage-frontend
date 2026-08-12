import type { Ressurs } from '../typer/ressurs';
import { byggTomRessurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import type { IBehandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/behandlingshistorikk';
import type { AxiosRequestConfig } from 'axios';

export const useHentBehandlingHistorikk = (
    behandlingId: string
): {
    hentBehandlingshistorikkCallback: () => void;
    behandlingHistorikk: Ressurs<IBehandlingshistorikk[]>;
} => {
    const { axiosRequest } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<IBehandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandlingId}`,
        };
        axiosRequest<IBehandlingshistorikk[], null>(behandlingConfig).then(
            (res: Ressurs<IBehandlingshistorikk[]>) => settBehandlingHistorikk(res)
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
