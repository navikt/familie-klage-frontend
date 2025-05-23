import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    KanIkkeOppretteRevurderingÅrsak,
    KanOppretteRevurdering,
} from '../../../App/typer/kanOppretteRevurdering';
import { Alert, Button } from '@navikt/ds-react';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import styled from 'styled-components';
import { useFerdigstillBehandling } from './useFerdigstillBehandling';

const AlertContainer = styled.div`
    padding: 2rem;
    max-width: 40rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

const StyledKnapp = styled(Button)`
    margin-top: 2rem;
`;

const KanOppretteRevurderingTekst: React.FC<{ kanOppretteRevurdering: KanOppretteRevurdering }> = ({
    kanOppretteRevurdering,
}) => {
    if (kanOppretteRevurdering.kanOpprettes) {
        return (
            <Alert variant={'info'}>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Når du
                ferdigstiller klagebehandlingen vil det automatisk bli opprettet en
                revurderingsbehandling.
            </Alert>
        );
    } else if (kanOppretteRevurdering.årsak === KanIkkeOppretteRevurderingÅrsak.ÅPEN_BEHANDLING) {
        return (
            <Alert variant={'warning'}>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Det vil ikke
                bli opprettet en revurderingsbehandling automatisk fordi det allerede finnes en åpen
                behandling på bruker.
            </Alert>
        );
    } else {
        return (
            <Alert variant={'warning'}>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. En
                revurderingsbehandling for å fatte nytt vedtak blir ikke automatisk opprettet.
            </Alert>
        );
    }
};

export const OmgjørVedtak: React.FC<{
    behandlingId: string;
}> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [kanOppretteRevurdering, settKanOppretteRevurdering] =
        useState<Ressurs<KanOppretteRevurdering>>(byggTomRessurs());
    const { ferdigstill, senderInn } = useFerdigstillBehandling(
        behandlingId,
        () => lukkModal(),
        (feilmelding) => settFeilmelding(feilmelding)
    );

    const lukkModal = () => {
        settFeilmelding('');
        settVisModal(false);
    };

    useEffect(() => {
        if (behandlingErRedigerbar) {
            axiosRequest<KanOppretteRevurdering, null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/${behandlingId}/kan-opprette-revurdering`,
            }).then(settKanOppretteRevurdering);
        }
    }, [axiosRequest, behandlingErRedigerbar, behandlingId]);

    if (!behandlingErRedigerbar) {
        return (
            <AlertContainer>
                <Alert variant={'info'}>Brev finnes ikke fordi klagen er tatt til følge.</Alert>
            </AlertContainer>
        );
    }
    return (
        <DataViewer response={{ kanOppretteRevurdering }}>
            {({ kanOppretteRevurdering }) => (
                <>
                    {behandlingErRedigerbar && (
                        <AlertContainer>
                            <KanOppretteRevurderingTekst
                                kanOppretteRevurdering={kanOppretteRevurdering}
                            />
                            <StyledKnapp onClick={() => settVisModal(true)}>
                                Ferdigstill
                            </StyledKnapp>
                        </AlertContainer>
                    )}
                    <ModalWrapper
                        tittel={'Bekreft ferdigstillelse av klagebehandling'}
                        visModal={visModal}
                        onClose={() => lukkModal()}
                        aksjonsknapper={{
                            hovedKnapp: {
                                onClick: ferdigstill,
                                tekst: 'Ferdigstill',
                                disabled: senderInn,
                            },
                            lukkKnapp: { onClick: lukkModal, tekst: 'Avbryt' },
                            marginTop: 4,
                        }}
                    >
                        {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                    </ModalWrapper>
                </>
            )}
        </DataViewer>
    );
};
