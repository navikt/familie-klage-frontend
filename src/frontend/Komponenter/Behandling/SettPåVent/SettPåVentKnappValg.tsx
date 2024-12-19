import React from 'react';
import { Button, HStack } from '@navikt/ds-react';

interface SettPåVentKnappValgProps {
    settVisSettPåVent: (value: boolean) => void;
    erBehandlingPåVent: boolean;
    taAvVent: () => void;
    settPåVent: () => void;
    låsKnapp: boolean;
}

export const SettPåVentKnappValg: React.FC<SettPåVentKnappValgProps> = ({
    settVisSettPåVent,
    erBehandlingPåVent,
    taAvVent,
    settPåVent,
    låsKnapp,
}) => {
    return (
        <HStack justify="end" gap="4">
            <Button onClick={() => settVisSettPåVent(false)} variant="tertiary" size="small">
                Avbryt
            </Button>
            {erBehandlingPåVent ? (
                <Button onClick={taAvVent} variant="primary" size="small" disabled={låsKnapp}>
                    Ta av vent
                </Button>
            ) : (
                <Button onClick={settPåVent} variant="primary" size="small" disabled={låsKnapp}>
                    Sett på vent
                </Button>
            )}
        </HStack>
    );
};
