import { AppEnv } from '../../App/api/env';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { AxiosError } from 'axios';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';

export const lagAInntektLink = async (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string
): Promise<string> => {
    const url = `/familie-klage/api/inntekt/fagsak/${fagsakId}/generer-url`;
    return await axiosRequest<string, null>({
        method: 'GET',
        url: url,
    })
        .then((response: Ressurs<string>) => {
            return response.status === RessursStatus.SUKSESS ? response.data : appEnv.aInntekt;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_: AxiosError<string>) => {
            return appEnv.aInntekt;
        });
};

export const lagGosysLink = (appEnv: AppEnv, personIdent: string): string => {
    return `${appEnv.gosys}/personoversikt/fnr=${personIdent}`;
};
