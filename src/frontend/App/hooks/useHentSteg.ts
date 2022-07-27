import { useApp } from '../context/AppContext';
import { useCallback, useEffect, useState } from 'react';
import { Ressurs } from '../typer/ressurs';
import { Behandling } from '../typer/fagsak';

export const useHentSteg = (behandlingId: string) => {
    const { axiosRequest } = useApp();

    const [formkravSteg, settFormkravSteg] = useState(true);
    const [vurderingSteg, settVurderingSteg] = useState(false);
    const [brevSteg, settBrevSteg] = useState(false);
    const [resultatSteg, settResultatSteg] = useState(false);

    const hentSteg = useCallback(() => {
        axiosRequest<Behandling, null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}`,
        }).then((res: Ressurs<Behandling>) => {
            if (res.status === 'SUKSESS') {
                settFormkravSteg(true);
                if (res.data.steg !== 'FORMKRAV') {
                    settVurderingSteg(true);
                    if (res.data.steg !== 'VURDERING') {
                        settBrevSteg(true);
                        if (res.data.steg !== 'BREV') {
                            settResultatSteg(true);
                        }
                    }
                }
            }
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        hentSteg();
    }, [axiosRequest, behandlingId, formkravSteg, vurderingSteg, brevSteg, resultatSteg, hentSteg]);

    return {
        brevSteg,
        settBrevSteg,
        resultatSteg,
        settResultatSteg,
        vurderingSteg,
        settVurderingSteg,
        formkravSteg,
        settFormkravSteg,
    };
};
