import React from 'react';
import { Header } from '@navikt/familie-header';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';
import { Sticky } from '../Visningskomponenter/Sticky';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler: ISaksbehandler;
}

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { gåTilUrl } = useApp();

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
                eksterneLenker={[]}
            />
        </Sticky>
    );
};
