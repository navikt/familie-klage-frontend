import * as React from 'react';
import { useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import FritekstBrev from './FritekstBrev';

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    return (
        <div>
            <FritekstBrev behandlingId={behandlingId} oppdaterBrevressurs={settBrevRessurs} />
        </div>
    );
};
