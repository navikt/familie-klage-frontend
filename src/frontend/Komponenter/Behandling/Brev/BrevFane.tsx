import React from 'react';
import { Behandling, Klagebehandlingsårsak } from '../../../App/typer/fagsak';
import { Brev } from './Brev';
import { BrevFaneUtenBrev } from './BrevFaneUtenBrev';

interface Props {
    behandling: Behandling;
}

export const BrevFane: React.FC<Props> = ({ behandling }) => {
    if (behandling.årsak === Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL) {
        return <BrevFaneUtenBrev behandlingId={behandling.id} />;
    }

    return <Brev behandling={behandling} />;
};
