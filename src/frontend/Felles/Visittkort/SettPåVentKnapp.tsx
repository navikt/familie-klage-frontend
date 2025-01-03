import React from 'react';
import { Button } from '@navikt/ds-react';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

export const SettPåVentKnapp = () => {
    const { toggles } = useToggles();

    const visSettPåVent = toggles[ToggleName.visSettPåVent];

    if (!visSettPåVent) {
        return null;
    }

    return (
        <Button size="xsmall" variant="secondary">
            Sett på vent
        </Button>
    );
};
