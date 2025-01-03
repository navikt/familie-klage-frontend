import React from 'react';

import { Brevmottaker } from '../../brevmottaker';
import { RegistrertBrevmottaker } from './RegistrertBrevmottaker';

type Props = {
    brevmottakere: Brevmottaker[];
    slettBrevmottaker: (brevmottakerId: string) => Promise<void>;
    erLesevisning: boolean;
};

export function RegistrerteBrevmottakere({
    brevmottakere,
    slettBrevmottaker,
    erLesevisning,
}: Props) {
    return brevmottakere.map((brevmottaker) => {
        return (
            <RegistrertBrevmottaker
                key={brevmottaker.id}
                brevmottaker={brevmottaker}
                slettBrevmottaker={slettBrevmottaker}
                erLesevisning={erLesevisning}
            />
        );
    });
}
