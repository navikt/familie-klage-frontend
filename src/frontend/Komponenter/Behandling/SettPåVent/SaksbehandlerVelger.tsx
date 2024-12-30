import React, { FC } from 'react';
import { Oppgave } from '../Typer/Oppgave';
import { useApp } from '../../../App/context/AppContext';
import { Select } from '@navikt/ds-react';

export const SaksbehandlerVelger: FC<{
    oppgave: Oppgave;
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
            onChange={(e) => settSaksbehandler(e.target.value)}
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
