import { useBehandling } from '../../App/context/BehandlingContext';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { Fagsystem } from '../../App/typer/fagsak';

const fagsystemerSomStøtterEndringAvBehandlendeEnhet = [Fagsystem.BA, Fagsystem.KS];

interface Props {
    fagsystem: Fagsystem;
}

export function EndreBehandlendeEnhetKnapp({ fagsystem }: Props) {
    const { settVisEndreBehandlendeEnhet, behandlingErRedigerbar } = useBehandling();

    if (!fagsystemerSomStøtterEndringAvBehandlendeEnhet.includes(fagsystem)) {
        return null;
    }

    return (
        <Button
            disabled={!behandlingErRedigerbar}
            onClick={() => settVisEndreBehandlendeEnhet(true)}
            size="xsmall"
            variant="secondary"
        >
            Endre enhet
        </Button>
    );
}
