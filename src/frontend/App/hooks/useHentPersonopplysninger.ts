import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IPersonopplysningerFagsakeierOgSøker } from '../typer/personopplysninger';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: () => void;
    personopplysningerResponse: Ressurs<IPersonopplysningerFagsakeierOgSøker>;
} => {
    const { axiosRequest } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] =
        useState<Ressurs<IPersonopplysningerFagsakeierOgSøker>>(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerResponse(byggHenterRessurs());
        axiosRequest<IPersonopplysningerFagsakeierOgSøker, void>({
            method: 'GET',
            url: `/familie-klage/api/personopplysninger/${behandlingId}/fagsak-eier-og-soker`,
        }).then((res) => {
            settPersonopplysningerResponse(res);
        });
    }, [axiosRequest, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
