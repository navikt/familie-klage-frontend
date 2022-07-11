import * as React from 'react';
import { useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import FritekstBrev from './FritekstBrev';
import PdfVisning from './PdfVisning';
import { IMellomlagretBrevFritekst } from './BrevTyper';
import { useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';

const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 2rem 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5rem;
    justify-content: center;

    @media only screen and (max-width: 1250px) {
        display: flex;
        flex-wrap: wrap;
        gap: 3rem;
    }
`;

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const { personopplysningerResponse, behandling } = useBehandling();

    const { mellomlagretBrev } = useMellomlagringBrev(behandlingId);

    return (
        <div>
            <StyledBrev>
                <DataViewer response={{ personopplysningerResponse, behandling }}>
                    <FritekstBrev
                        behandlingId={behandlingId}
                        mellomlagretFritekstbrev={mellomlagretBrev as IMellomlagretBrevFritekst}
                    />
                </DataViewer>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </StyledBrev>
        </div>
    );
};
