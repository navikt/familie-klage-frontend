import { useCallback, useState } from 'react';
import type { Ressurs } from '../typer/ressurs';
import { byggTomRessurs } from '../typer/ressurs';
import type { Behandling } from '../typer/fagsak';
import { useApp } from '../context/AppContext';
import type { Klagebehandlingsresultat } from '../typer/klagebehandlingsresultat';

export const useHentKlagebehandlingsresultater = (): {
    hentKlagebehandlingsresultater: (behandling: Behandling) => void;
    klagebehandlingsresultater: Ressurs<Klagebehandlingsresultat[]>;
} => {
    const { axiosRequest } = useApp();

    const [klagebehandlingsresultater, settKlagebehandlingsresultater] =
        useState<Ressurs<Klagebehandlingsresultat[]>>(byggTomRessurs);

    const hentKlagebehandlingsresultater = useCallback(
        (behandling: Behandling) => {
            axiosRequest<Klagebehandlingsresultat[], null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/${behandling.id}/hent-klager-ikke-medhold-formkrav-avvist`,
            }).then(settKlagebehandlingsresultater);
        },
        [axiosRequest]
    );

    return {
        hentKlagebehandlingsresultater,
        klagebehandlingsresultater: klagebehandlingsresultater,
    };
};
