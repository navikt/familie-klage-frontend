import { Delete } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const SlettKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <Button onClick={onClick} icon={<Delete />} variant={'tertiary'}>
            {knappetekst}
        </Button>
    );
};

export default hiddenIf(SlettKnapp);
