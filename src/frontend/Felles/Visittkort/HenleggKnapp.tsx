import { Button } from '@navikt/ds-react';
import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';

export const HenleggKnapp = () => {
    const { settVisHenleggModal, behandlingErRedigerbar } = useBehandling();

    return (
        <Button
            disabled={!behandlingErRedigerbar}
            onClick={() => settVisHenleggModal(true)}
            size="xsmall"
            variant="secondary"
        >
            Henlegg
        </Button>
    );
};
