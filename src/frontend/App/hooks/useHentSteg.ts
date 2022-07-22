import { useApp } from '../context/AppContext';
import { useCallback, useEffect, useState } from 'react';
import { Ressurs } from '../typer/ressurs';
import { Behandling, StegType } from '../typer/fagsak';
import { useHentBehandling } from './useHentBehandling';

export const useHentSteg = (behandlingId: string) => {
    const { axiosRequest } = useApp();

    const [formkravSteg, settFormkravSteg] = useState(true);
    const [vurderingSteg, settVurderingSteg] = useState(false);
    const [brevSteg, settBrevSteg] = useState(false);
    const [resultatSteg, settResultatSteg] = useState(false);

    const { behandling, hentBehandlingCallback } = useHentBehandling(behandlingId);

    const finnSteg = useCallback(() => {
        if (resultatSteg) return StegType.BEHANDLING_FERDIGSTILT;
        else if (brevSteg) return StegType.BREV;
        else if (vurderingSteg) return StegType.VURDERING;
        else return StegType.FORMKRAV;
    }, [brevSteg, resultatSteg, vurderingSteg]);

    useEffect(() => {
        axiosRequest<Behandling, null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}`,
        }).then((res: Ressurs<Behandling>) => {
            if (res.status === 'SUKSESS') {
                if (res.data.steg === 'BEHANDLING_FERDIGSTILT') settResultatSteg(true);
                else if (res.data.steg === 'BREV') settBrevSteg(true);
                else if (res.data.steg === 'VURDERING') settVurderingSteg(true);
                else settFormkravSteg(true);
            }
        });
    }, [
        axiosRequest,
        behandlingId,
        brevSteg,
        settBrevSteg,
        resultatSteg,
        settResultatSteg,
        vurderingSteg,
        settVurderingSteg,
        formkravSteg,
        settFormkravSteg,
    ]);

    useEffect(() => {
        if (behandling.status === 'IKKE_HENTET') hentBehandlingCallback();
        if (behandling.status === 'SUKSESS') {
            const behandlingSteg = {
                stegType: finnSteg(),
            };
            axiosRequest<string, { stegType: StegType }>({
                method: 'POST',
                url: `/familie-klage/api/behandling/${behandlingId}`,
                data: behandlingSteg,
            }).then((res: Ressurs<string>) => {
                if (res.status === 'SUKSESS') {
                    console.log(res);
                }
            });
        }
    }, [
        settBrevSteg,
        settResultatSteg,
        settVurderingSteg,
        settFormkravSteg,
        axiosRequest,
        behandling,
        behandlingId,
        finnSteg,
        hentBehandlingCallback,
    ]);

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
