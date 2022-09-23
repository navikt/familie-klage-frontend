import { Down } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const NedKnapp: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return <Button onClick={onClick} variant={'secondary'} icon={<Down />} />;
};

export default hiddenIf(NedKnapp);
