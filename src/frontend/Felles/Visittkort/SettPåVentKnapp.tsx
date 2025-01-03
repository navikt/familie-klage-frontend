import React from 'react';
import { Button } from '@navikt/ds-react';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { useBehandling } from '../../App/context/BehandlingContext';

export const SettPåVentKnapp = () => {
    const { settVisSettPåVent, behandlingErRedigerbar } = useBehandling();
    const { toggles } = useToggles();

    const visSettPåVent = toggles[ToggleName.visSettPåVent];

    if (!visSettPåVent) {
        return null;
    }

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
