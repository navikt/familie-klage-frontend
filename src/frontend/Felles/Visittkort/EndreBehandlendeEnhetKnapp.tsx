import { useBehandling } from '../../App/context/BehandlingContext';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { Fagsystem } from '../../App/typer/fagsak';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

interface IProps {
    fagsystem: Fagsystem;
}

export const EndreBehandlendeEnhetKnapp: React.FC<IProps> = ({ fagsystem }: IProps) => {
    const { settVisEndreBehandlendeEnhet, behandlingErRedigerbar } = useBehandling();
    const { toggles } = useToggles();

    const fagsystemerSomStøtterEndringAvBehandlendeEnhet = [Fagsystem.BA, Fagsystem.KS];

    const skalViseEndreBehandlendeEnhetKnapp =
        fagsystemerSomStøtterEndringAvBehandlendeEnhet.includes(fagsystem) &&
        toggles[ToggleName.skalKunneEndreBehandlendeEnhetBaks];

    return (
        skalViseEndreBehandlendeEnhetKnapp && (
            <Button
                disabled={!behandlingErRedigerbar}
                onClick={() => settVisEndreBehandlendeEnhet(true)}
                size="xsmall"
                variant="secondary"
            >
                Endre enhet
            </Button>
        )
    );
};
