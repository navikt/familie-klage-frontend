import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Button } from '@navikt/ds-react';

export const Henlegg = () => {
    const { settVisHenleggModal } = useBehandling();

    return (
        <Button onClick={() => settVisHenleggModal(true)} size="xsmall" variant="secondary">
            Henlegg
        </Button>
    );
};
