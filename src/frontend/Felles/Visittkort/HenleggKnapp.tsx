import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Button } from '@navikt/ds-react';

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
