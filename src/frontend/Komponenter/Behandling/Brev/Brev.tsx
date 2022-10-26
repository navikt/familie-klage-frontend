import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import PdfVisning from './PdfVisning';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button } from '@navikt/ds-react';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { IFritekstBrev } from './BrevTyper';
import { lagOpprettholdelseBrev } from './Brevtekster';

const Container = styled.div`
    background-color: var(--navds-semantic-color-canvas-background);
    padding: 2rem 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5rem;
    justify-content: center;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const { hentBehandling, hentBehandlingshistorikk, behandlingErRedigerbar } = useBehandling();

    const navigate = useNavigate();
    const { axiosRequest } = useApp();

    const [senderInnBrev, settSenderInnBrev] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const hentBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}/pdf`,
        }).then(settBrevRessurs);
    }, [axiosRequest, behandlingId]);

    const genererBrev = useCallback(() => {
        // TODO: Fiks innhold
        const brev: IFritekstBrev = {
            overskrift: '',
            avsnitt: lagOpprettholdelseBrev('...'),
            behandlingId: behandlingId,
        };

        axiosRequest<string, IFritekstBrev>({
            method: 'POST',
            url: `/familie-klage/api/brev/`,
            data: brev,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (behandlingErRedigerbar) {
            genererBrev();
        } else {
            hentBrev();
        }
    }, [
        axiosRequest,
        behandlingId,
        behandlingErRedigerbar,
        settBrevRessurs,
        hentBrev,
        genererBrev,
    ]);

    const ferdigstillBrev = () => {
        if (senderInnBrev) {
            return;
        }
        settSenderInnBrev(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/ferdigstill`,
        }).then((res: RessursSuksess<null> | RessursFeilet) => {
            settSenderInnBrev(false);
            if (res.status === RessursStatus.SUKSESS) {
                lukkModal();
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                navigate(`/behandling/${hentBehandlingIdFraUrl()}/resultat`);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    return (
        <>
            <Container>
                {behandlingErRedigerbar && (
                    <div>
                        <Button
                            variant="primary"
                            size="medium"
                            onClick={() => {
                                settVisModal(true);
                            }}
                        >
                            Ferdigstill
                        </Button>
                    </div>
                )}
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </Container>
            <ModalWrapper
                tittel={'Bekreft utsending av brev'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => ferdigstillBrev(),
                        tekst: 'Send brev',
                        disabled: senderInnBrev,
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                    marginTop: 4,
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && (
                    <AlertStripe variant={'error'}>Utsending feilet.{feilmelding}</AlertStripe>
                )}
            </ModalWrapper>
        </>
    );
};
