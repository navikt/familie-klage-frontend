import React from 'react';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import { Button } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useBehandling } from '../../../App/context/BehandlingContext';

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;
    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

interface BrevModal {
    ferdigstillBrev: () => void;
}

const BrevModal: React.FC<BrevModal> = ({ ferdigstillBrev }) => {
    const navigate = useNavigate();
    const { visAdvarselSendBrev, settVisAdvarselSendBrev } = useBehandling();

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Er du sikker på at du ønsker å sende brev?',
                lukkKnapp: false,
                visModal: visAdvarselSendBrev,
                onClose: () => settVisAdvarselSendBrev(false),
                className: 'cake',
            }}
        >
            <SentrerKnapper>
                <Button
                    variant="tertiary"
                    onClick={
                        () => {
                            ferdigstillBrev();
                            navigate(`/behandling/${hentBehandlingIdFraUrl()}/resultat`);
                        }
                        //settVisUlagretDataModal(false);
                    }
                >
                    Send brev
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        settVisAdvarselSendBrev(false);
                    }}
                >
                    Gå tilbake for å redigere
                </Button>
            </SentrerKnapper>
        </UIModalWrapper>
    );
};
export default BrevModal;
