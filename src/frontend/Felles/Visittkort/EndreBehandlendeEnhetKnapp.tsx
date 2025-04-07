import { useBehandling } from '../../App/context/BehandlingContext';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { Fagsystem } from '../../App/typer/fagsak';

interface IProps {
    fagsystem: Fagsystem;
}

export const EndreBehandlendeEnhetKnapp: React.FC<IProps> = ({ fagsystem }: IProps) => {
    const { settVisEndreBehandlendeEnhet, behandlingErRedigerbar } = useBehandling();

    const fagsystemerSomStøtterEndringAvBehandlendeEnhet = [Fagsystem.BA, Fagsystem.KS];

    const skalViseEndreBehandlendeEnhetKnapp =
        fagsystemerSomStøtterEndringAvBehandlendeEnhet.includes(fagsystem);

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
