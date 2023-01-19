import React, { useMemo } from 'react';
import { Header, PopoverItem } from '@navikt/familie-header';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';
import { Sticky } from '../Visningskomponenter/Sticky';
import { AppEnv } from '../../App/api/env';
import { lagAInntektLink } from '../Lenker/Lenker';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler: ISaksbehandler;
}

const lagAInntekt = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined
): PopoverItem => {
    if (!fagsakId) {
        return { name: 'A-inntekt', href: appEnv.aInntekt, isExternal: true };
    }

    return {
        name: 'A-inntekt',
        href: '#/a-inntekt',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(await lagAInntektLink(axiosRequest, appEnv, fagsakId));
        },
    };
};
/*
const lagGosys = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return { name: 'Gosys', href: appEnv.gosys, isExternal: true };
    }

    return {
        name: 'Gosys',
        href: '#/gosys',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(lagGosysLink(appEnv, personIdent));
        },
    };
};
*/
const lagEksterneLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined
): PopoverItem[] => {
    const eksterneLenker = [
        lagAInntekt(axiosRequest, appEnv, fagsakId),
        //lagGosys(appEnv, personIdent),
    ];
    return eksterneLenker;
};

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { axiosRequest, gåTilUrl, appEnv, valgtFagsakId } = useApp();

    const eksterneLenker = useMemo(
        () => lagEksterneLenker(axiosRequest, appEnv, valgtFagsakId),
        [axiosRequest, appEnv, valgtFagsakId]
    );
    return (
        <Sticky>
            <Header
                tittelOnClick={() => {
                    gåTilUrl('#');
                }}
                tittelHref={'#'}
                tittel="NAV Familie - klage"
                brukerinfo={{
                    navn: innloggetSaksbehandler?.displayName || 'Ukjent',
                }}
                brukerPopoverItems={[{ name: 'Logg ut', href: `${window.origin}/auth/logout` }]}
                eksterneLenker={eksterneLenker}
            />
        </Sticky>
    );
};
