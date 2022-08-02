import * as React from 'react';
import { useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import FritekstBrev from './FritekstBrev';
import PdfVisning from './PdfVisning';
import { IFritekstBrev } from './BrevTyper';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useHentBrev } from '../../../App/hooks/useHentBrev';
import { useApp } from '../../../App/context/AppContext';
import { Button } from '@navikt/ds-react';
import BrevModal from './BrevModal';

const redigerbar = {
    backgroundColor: '#f2f2f2',
    padding: '2rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '5rem',
    justifyContent: 'center',
};
const lesemodus = {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
};
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

const BrevKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0rem;
`;

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const { personopplysningerResponse, behandling, settResultatSteg, hentBehandling } =
        useBehandling();

    const { mellomlagretBrev } = useHentBrev(behandlingId);

    const { axiosRequest } = useApp();

    const oppdaterBrevRessurs = (respons: Ressurs<string>) => {
        settBrevRessurs(respons);
    };

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const ferdigstillBrev = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling/ferdigstill/${behandlingId}`,
        }).then(() => {
            settResultatSteg(true);
            settSenderInn(false);
            hentBehandling.rerun();
        });
        settErRedigerbar(false);
    };

    const { visAdvarselSendBrev, settVisAdvarselSendBrev, erRedigerbar, settErRedigerbar } =
        useBehandling();

    return (
        <div>
            <div style={erRedigerbar ? redigerbar : lesemodus}>
                <div>
                    <DataViewer response={{ personopplysningerResponse, behandling }}>
                        <FritekstBrev
                            behandlingId={behandlingId}
                            mellomlagretFritekstbrev={mellomlagretBrev as IFritekstBrev}
                            oppdaterBrevressurs={oppdaterBrevRessurs}
                        />
                    </DataViewer>
                    {erRedigerbar ? (
                        <BrevKnapper>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {
                                    settVisAdvarselSendBrev(true);
                                }}
                            >
                                Ferdigstill
                            </Button>

                            {visAdvarselSendBrev && (
                                <BrevModal
                                    ferdigstillBrev={ferdigstillBrev}
                                    senderInn={senderInn}
                                />
                            )}
                        </BrevKnapper>
                    ) : (
                        ''
                    )}
                </div>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </div>
        </div>
    );
};
