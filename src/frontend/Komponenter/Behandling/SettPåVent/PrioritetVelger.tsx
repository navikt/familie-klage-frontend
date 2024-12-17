import React, { FC } from 'react';
import { Prioritet, prioritetTilTekst } from './IOppgave';
import FamilieSelect from './FamilieSelect';

const PrioritetVelger: FC<{
    prioritet: Prioritet | undefined;
    settPrioritet: (prioritet: Prioritet) => void;
    erLesevisning: boolean;
}> = ({ prioritet, settPrioritet, erLesevisning }) => (
    <FamilieSelect
        label={'Prioritet'}
        size={'small'}
        value={prioritet}
        erLesevisning={erLesevisning}
        lesevisningVerdi={prioritet ? prioritetTilTekst[prioritet] : 'Ikke satt'}
        onChange={(e) => {
            settPrioritet(e.target.value as Prioritet);
        }}
    >
        {Object.entries(prioritetTilTekst).map(([prioritet, tekst]) => {
            return (
                <option key={prioritet} value={prioritet}>
                    {tekst}
                </option>
            );
        })}
    </FamilieSelect>
);

export default PrioritetVelger;
