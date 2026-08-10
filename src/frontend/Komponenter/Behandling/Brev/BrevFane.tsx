import React from 'react';
import type { Behandling } from '../../../App/typer/fagsak';
import { Klagebehandlingsårsak } from '../../../App/typer/fagsak';
import { Brev } from './Brev';
import { BrevFaneUtenBrev } from './BrevFaneUtenBrev';

interface Props {
    behandling: Behandling;
}

export const BrevFane: React.FC<Props> = ({ behandling }) => {
    if (behandling.årsak === Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL) {
        return <BrevFaneUtenBrev behandlingId={behandling.id} />;
    }

    return <Brev behandlingId={behandling.id} fagsystem={behandling.fagsystem} />;
};
