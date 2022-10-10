import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { IFritekstBrev } from './BrevTyper';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import FritekstBrev from './FritekstBrev';

interface Props {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
}

const BrevRedigerer: React.FC<Props> = ({ behandlingId, oppdaterBrevressurs }) => {
    const { axiosRequest } = useApp();
    const [mellomlagretBrev, settMellomlagretBrev] = useState<Ressurs<IFritekstBrev | undefined>>(
        byggTomRessurs()
    );
    useEffect(() => {
        axiosRequest<IFritekstBrev | undefined, null>({
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}`,
        }).then(settMellomlagretBrev);
    }, [axiosRequest, behandlingId, settMellomlagretBrev]);

    return (
        <DataViewer response={{ mellomlagretBrev }}>
            {({ mellomlagretBrev }) => (
                <FritekstBrev
                    behandlingId={behandlingId}
                    oppdaterBrevressurs={oppdaterBrevressurs}
                    mellomlagretBrev={mellomlagretBrev}
                />
            )}
        </DataViewer>
    );
};

export default BrevRedigerer;
