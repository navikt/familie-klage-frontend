import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { Fagsak } from '../typer/fagsak';

export const useHentFagsak = (): {
    hentFagsak: (fagsakId: string) => void;
    fagsakResponse: Ressurs<Fagsak>;
} => {
    const { axiosRequest } = useApp();
    const [fagsakResponse, settFagsakResponse] = useState<Ressurs<Fagsak>>(byggTomRessurs());

    const hentFagsak = useCallback(
        (fagsakId: string) => {
            settFagsakResponse(byggHenterRessurs());
            axiosRequest<Fagsak, { fagsakId: string }>({
                method: 'GET',
                url: `/familie-klage/api/fagsak/${fagsakId}`,
            }).then((res) => {
                settFagsakResponse(res);
            });
        },
        [axiosRequest]
    );

    return {
        hentFagsak,
        fagsakResponse,
    };
};
