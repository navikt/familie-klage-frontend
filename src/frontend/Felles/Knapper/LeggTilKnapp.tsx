import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const LeggTilKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <Button onClick={onClick} icon={<AddCircle />} variant={'secondary'}>
            {knappetekst}
        </Button>
    );
};

export default hiddenIf(LeggTilKnapp);
