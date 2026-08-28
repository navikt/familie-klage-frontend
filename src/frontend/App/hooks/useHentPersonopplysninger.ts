import { useCallback, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { IPersonopplysningerFagsakeierOgSøker } from '../typer/personopplysninger';
import type { Ressurs } from '../typer/ressurs';
import { byggHenterRessurs, byggTomRessurs } from '../typer/ressurs';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: () => void;
    personopplysningerResponse: Ressurs<IPersonopplysningerFagsakeierOgSøker>;
} => {
    const { axiosRequest } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] = useState<
        Ressurs<IPersonopplysningerFagsakeierOgSøker>
    >(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerResponse(byggHenterRessurs());
        axiosRequest<IPersonopplysningerFagsakeierOgSøker, void>({
            method: 'GET',
            url: `/familie-klage/api/personopplysninger/${behandlingId}/fagsak-eier-og-soker`,
        }).then(res => {
            settPersonopplysningerResponse(res);
        });
    }, [axiosRequest, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
