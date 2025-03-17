import React from 'react';
import { Button } from '@navikt/ds-react';
import { useBehandling } from '../../App/context/BehandlingContext';

export const SettPåVentKnapp = () => {
    const { settVisSettPåVent, behandlingErRedigerbar } = useBehandling();

    return (
        <Button
            disabled={!behandlingErRedigerbar}
            onClick={() => settVisSettPåVent(true)}
            size="xsmall"
            variant="secondary"
        >
            Sett på vent
        </Button>
    );
};
