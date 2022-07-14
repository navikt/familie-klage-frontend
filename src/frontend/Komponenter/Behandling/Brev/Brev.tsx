import * as React from 'react';
import { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import FritekstBrev from './FritekstBrev';
import PdfVisning from './PdfVisning';
import { IFritekstBrev, IMellomlagretBrevFritekst } from './BrevTyper';
import { useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';

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
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);

    const { personopplysningerResponse, behandling } = useBehandling();

    const { mellomlagretBrev } = useMellomlagringBrev(behandlingId);

    const oppdaterBrevRessurs = (respons: Ressurs<string>) => {
        settBrevRessurs(respons);
        if (respons.status === RessursStatus.SUKSESS) {
            settKanSendesTilBeslutter(true);
        }
    };

    const lagBeslutterBrev = () => {
        axiosRequest<string, IFritekstBrev>({
            method: 'POST',
            url: `/familie-klage/api/brev`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const hentBrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    useEffect(() => {
        lagBeslutterBrev();
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <div>
            <StyledBrev>
                <DataViewer response={{ personopplysningerResponse, behandling }}>
                    <FritekstBrev
                        behandlingId={behandlingId}
                        mellomlagretFritekstbrev={mellomlagretBrev as IMellomlagretBrevFritekst}
                        oppdaterBrevressurs={oppdaterBrevRessurs}
                    />
                </DataViewer>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </StyledBrev>
        </div>
    );
};
