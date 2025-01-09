import React, { FC } from 'react';
import { Prioritet, prioritetTilTekst } from '../Typer/IOppgave';
import { Select } from '@navikt/ds-react';

export const PrioritetVelger: FC<{
    prioritet: Prioritet | undefined;
    settPrioritet: (prioritet: Prioritet) => void;
    erLesevisning: boolean;
}> = ({ prioritet, settPrioritet, erLesevisning }) => {
    return (
        <Select
            label="Prioritet"
            size="small"
            value={prioritet}
            onChange={(e) => settPrioritet(e.target.value as Prioritet)}
            readOnly={erLesevisning}
        >
            {Object.entries(prioritetTilTekst).map(([prioritet, tekst]) => (
                <option key={prioritet} value={prioritet}>
                    {tekst}
                </option>
            ))}
        </Select>
    );
};
