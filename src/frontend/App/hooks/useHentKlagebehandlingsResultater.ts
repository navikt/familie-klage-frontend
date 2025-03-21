import { useCallback, useState } from 'react';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Behandling } from '../typer/fagsak';
import { useApp } from '../context/AppContext';
import { KlagebehandlingsResultat } from '../typer/klagebehandlingsResultat';

export const useHentKlagebehandlingsResultater = (): {
    hentKlagebehandlingsResultater: (behandling: Behandling) => void;
    klagebehandlingsResultater: Ressurs<KlagebehandlingsResultat[]>;
} => {
    const { axiosRequest } = useApp();

    const [klagebehandlingsResultater, settKlagebehandlingsResultater] =
        useState<Ressurs<KlagebehandlingsResultat[]>>(byggTomRessurs);

    const hentKlagebehandlingsResultater = useCallback(
        (behandling: Behandling) => {
            axiosRequest<KlagebehandlingsResultat[], null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/${behandling.id}/hent-klager`,
            }).then(settKlagebehandlingsResultater);
        },
        [axiosRequest]
    );

    return {
        hentKlagebehandlingsResultater,
        klagebehandlingsResultater,
    };
};
