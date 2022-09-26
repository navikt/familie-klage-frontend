import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IBehandlingshistorikk as Behandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/BehandlingsHistorikk';
import { AxiosRequestConfig } from 'axios';

export const useHentBehandlingHistorikk = (
    behandlingId: string
): {
    hentBehandlingshistorikkCallback: () => void;
    behandlingHistorikk: Ressurs<Behandlingshistorikk[]>;
} => {
    const { axiosRequest } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] = useState<
        Ressurs<Behandlingshistorikk[]>
    >(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/behandlingshistorikk/${behandlingId}`,
        };
        axiosRequest<Behandlingshistorikk[], null>(behandlingConfig).then(
            (res: Ressurs<Behandlingshistorikk[]>) => settBehandlingHistorikk(res)
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
