import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IPersonopplysninger } from '../typer/personopplysninger';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerResponse: Ressurs<IPersonopplysninger>;
} => {
    const { axiosRequest } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] =
        useState<Ressurs<IPersonopplysninger>>(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerResponse(byggHenterRessurs());
        axiosRequest<IPersonopplysninger, { behandlingId: string }>({
            method: 'GET',
            url: `/familie-klage/api/personopplysninger/${behandlingId}`,
        }).then((res) => {
            settPersonopplysningerResponse(res);
        });
    }, [axiosRequest, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
