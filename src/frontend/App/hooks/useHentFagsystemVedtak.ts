import { useCallback, useState } from 'react';
import { byggSuksessRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandling } from '../typer/fagsak';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { useBehandling } from '../context/BehandlingContext';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Behandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const [fagsystemVedtak, settFagsystemVedtak] =
        useState<Ressurs<FagsystemVedtak[]>>(byggTomRessurs);

    const hentFagsystemVedtak = useCallback(
        (behandling: Behandling) => {
            if (behandlingErRedigerbar) {
                axiosRequest<FagsystemVedtak[], null>({
                    method: 'GET',
                    url: `/familie-klage/api/behandling/${behandling.id}/fagsystem-vedtak`,
                }).then(settFagsystemVedtak);
            } else {
                const fagsystemVedtak = behandling.påklagetVedtak.fagsystemVedtak;
                settFagsystemVedtak(byggSuksessRessurs(fagsystemVedtak ? [fagsystemVedtak] : []));
            }
        },
        [axiosRequest, behandlingErRedigerbar]
    );

    return {
        hentFagsystemVedtak,
        fagsystemVedtak,
    };
};
