import { Select } from '@navikt/ds-react';
import type { FC } from 'react';
import React from 'react';
import { useApp } from '../../../App/context/AppContext';
import type { IOppgave } from '../Typer/IOppgave';

export const SaksbehandlerVelger: FC<{
    oppgave: IOppgave;
    saksbehandler: string | undefined;
    settSaksbehandler: (saksbehandler: string) => void;
    erLesevisning: boolean;
}> = ({ oppgave, saksbehandler, settSaksbehandler, erLesevisning }) => {
    const { innloggetSaksbehandler } = useApp();

    return (
        <Select
            label="Saksbehandler"
            size="small"
            value={saksbehandler}
            onChange={e => settSaksbehandler(e.target.value)}
            readOnly={erLesevisning}
        >
            {oppgave.tilordnetRessurs &&
                innloggetSaksbehandler.navIdent !== oppgave.tilordnetRessurs && (
                    <option value={oppgave.tilordnetRessurs}>{oppgave.tilordnetRessurs}</option>
                )}
            <option value={innloggetSaksbehandler.navIdent}>
                {innloggetSaksbehandler.displayName}
            </option>
            <option value="">Ingen</option>
        </Select>
    );
};
