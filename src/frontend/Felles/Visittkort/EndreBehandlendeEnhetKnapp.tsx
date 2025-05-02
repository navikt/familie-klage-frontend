import { useBehandling } from '../../App/context/BehandlingContext';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { Fagsystem } from '../../App/typer/fagsak';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

const fagsystemerSomStøtterEndringAvBehandlendeEnhet = [Fagsystem.BA, Fagsystem.KS];

interface Props {
    fagsystem: Fagsystem;
}

export function EndreBehandlendeEnhetKnapp({ fagsystem }: Props) {
    const { settVisEndreBehandlendeEnhet, behandlingErRedigerbar } = useBehandling();
    const { toggles } = useToggles();

    const skalViseEndreBehandlendeEnhetKnapp =
        fagsystemerSomStøtterEndringAvBehandlendeEnhet.includes(fagsystem) &&
        toggles[ToggleName.skalKunneEndreBehandlendeEnhetBaks];

    if (!skalViseEndreBehandlendeEnhetKnapp) {
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
