import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import PdfVisning from './PdfVisning';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Button } from '@navikt/ds-react';
import BrevModal from './BrevModal';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import BrevRedigerer from './BrevRedigerer';

const redigeringsmodus = {
    backgroundColor: '#f2f2f2',
    padding: '2rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '5rem',
    justifyContent: 'center',
};
const lesemodus = {
    backgroundColor: '#f2f2f2',
    padding: '2rem 2rem',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center' as const,
};

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

    const {
        personopplysningerResponse,
        behandling,
        hentBehandling,
        hentBehandlingshistorikk,
        visAdvarselSendBrev,
        settVisAdvarselSendBrev,
        behandlingErRedigerbar,
    } = useBehandling();

    const navigate = useNavigate();
    const { axiosRequest } = useApp();

    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [feilFerdigstilling, settFeilFerdigstilling] = useState('');

    useEffect(() => {
        if (!behandlingErRedigerbar) {
            axiosRequest<string, null>({
                method: 'GET',
                url: `/familie-klage/api/brev/${behandlingId}/pdf`,
            }).then(settBrevRessurs);
        }
    }, [axiosRequest, behandlingId, behandlingErRedigerbar, settBrevRessurs]);

    const ferdigstillBrev = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/ferdigstill`,
        }).then((res: RessursSuksess<null> | RessursFeilet) => {
            settSenderInn(false);
            if (res.status === RessursStatus.SUKSESS) {
                settFeilFerdigstilling('');
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                settVisAdvarselSendBrev(false);
                navigate(`/behandling/${hentBehandlingIdFraUrl()}/resultat`);
            } else {
                settFeilFerdigstilling(res.frontendFeilmelding);
            }
        });
    };

    return (
        <DataViewer response={{ personopplysningerResponse, behandling }}>
            <div style={behandlingErRedigerbar ? redigeringsmodus : lesemodus}>
                <div>
                    {behandlingErRedigerbar && (
                        <BrevRedigerer
                            behandlingId={behandlingId}
                            oppdaterBrevressurs={settBrevRessurs}
                        />
                    )}
                    {behandlingErRedigerbar ? (
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
                                    settFeil={settFeilFerdigstilling}
                                    feil={feilFerdigstilling}
                                />
                            )}
                        </BrevKnapper>
                    ) : (
                        ''
                    )}
                </div>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </div>
        </DataViewer>
    );
};
