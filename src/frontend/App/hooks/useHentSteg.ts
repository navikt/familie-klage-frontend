import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { Ressurs } from '../typer/ressurs';
import { Behandling } from '../typer/fagsak';
import { useHentBehandling } from './useHentBehandling';

export const useHentSteg = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [formkravGyldig, settFormkravGyldig] = useState<boolean>(false);
    const [vurderingSideGyldig, settVurderingSideGyldig] = useState<boolean>(false);
    const [brevSideGyldig, settBrevSideGyldig] = useState<boolean>(false);
    const [resultatSideGyldig, settResultatSideGyldig] = useState<boolean>(false);
    const { behandling, hentBehandlingCallback } = useHentBehandling(behandlingId);

    const finnSteg = () => {
        if (resultatSideGyldig) return 'RESULTAT';
        else if (brevSideGyldig) return 'BREV';
        else if (vurderingSideGyldig) return 'VURDERING';
        else if (formkravGyldig) return 'FORMKRAV';
    };

    useEffect(() => {
        axiosRequest<Behandling, null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}`,
        }).then((res: Ressurs<Behandling>) => {
            if (res.status === 'SUKSESS') {
                if (res.data.steg === 'FORMKRAV') settFormkravGyldig(true);
            }
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (behandling.status === 'IKKE_HENTET') hentBehandlingCallback();
        if (behandling.status === 'SUKSESS') {
            const behandlingMedNyttSteg = {
                ...behandling.data,
                steg: finnSteg(),
            };
            console.log('behandling med nytt steg', behandlingMedNyttSteg);
        }
        console.log('behandling', behandling);
        // axiosRequest<Behandling, null>({
        //     method: 'POST',
        //     url: `/familie-klage/api/behandling/${behandlingId}`,
        // }).then((res: Ressurs<Behandling>) => {
        //     if (res.status === 'SUKSESS') {
        //         if (res.data.steg === 'FORMKRAV') settFormkravGyldig(true);
        //     }
        // });
    }, [behandling, hentBehandlingCallback]);

    return {
        formkravGyldig,
        settFormkravGyldig,
        vurderingSideGyldig,
        settVurderingSideGyldig,
        brevSideGyldig,
        settBrevSideGyldig,
        resultatSideGyldig,
        settResultatSideGyldig,
    };
};
