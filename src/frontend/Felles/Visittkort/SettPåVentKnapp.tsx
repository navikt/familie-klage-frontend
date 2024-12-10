import React from 'react';
import { Button } from '@navikt/ds-react';
import { useBehandling } from '../../App/context/BehandlingContext';

export const SettPåVentKnapp = () => {
    const { settVisSettPåVent } = useBehandling();

    return (
        <Button onClick={() => settVisSettPåVent(true)} size="xsmall" variant="secondary">
            Sett på vent
        </Button>
    );
};
