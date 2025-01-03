import React from 'react';
import { Button } from '@navikt/ds-react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

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
