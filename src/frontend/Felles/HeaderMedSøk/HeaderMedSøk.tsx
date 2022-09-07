import React from 'react';
import { Header } from '@navikt/familie-header';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler: ISaksbehandler;
}

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { gåTilUrl } = useApp();

    return (
        <Header
            tittelOnClick={() => {
                gåTilUrl('/');
            }}
            tittelHref={'#'}
            tittel="NAV Enslig mor eller far"
            brukerinfo={{
                navn: innloggetSaksbehandler?.displayName || 'Ukjent',
            }}
            brukerPopoverItems={[{ name: 'Logg ut', href: `${window.origin}/auth/logout` }]}
            eksterneLenker={[]}
        />
    );
};
