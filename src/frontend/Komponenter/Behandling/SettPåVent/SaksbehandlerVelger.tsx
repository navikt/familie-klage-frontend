import React, { FC } from 'react';
import { IOppgave } from './IOppgave';
import { useApp } from '../../../App/context/AppContext';
import FamilieSelect from './FamilieSelect';

const SaksbehandlerVelger: FC<{
    oppgave: IOppgave;
    saksbehandler: string | undefined;
    settSaksbehandler: (saksbehandler: string) => void;
    erLesevisning: boolean;
}> = ({ oppgave, saksbehandler, settSaksbehandler, erLesevisning }) => {
    const { innloggetSaksbehandler } = useApp();

    return (
        <FamilieSelect
            label={'Saksbehandler'}
            size={'small'}
            value={saksbehandler}
            onChange={(e) => {
                settSaksbehandler(e.target.value);
            }}
            erLesevisning={erLesevisning}
            lesevisningVerdi={saksbehandler || 'Ingen'}
        >
            {oppgave.tilordnetRessurs &&
                innloggetSaksbehandler.navIdent !== oppgave.tilordnetRessurs && (
                    <option value={oppgave.tilordnetRessurs}>{oppgave.tilordnetRessurs}</option>
                )}
            <option value={innloggetSaksbehandler.navIdent}>
                {innloggetSaksbehandler.displayName}
            </option>
            <option value={''}>Ingen</option>
        </FamilieSelect>
    );
};

export default SaksbehandlerVelger;
