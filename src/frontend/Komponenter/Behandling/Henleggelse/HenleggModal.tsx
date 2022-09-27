import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from './EHenlagtÅrsak';
import styled from 'styled-components';
import { Alert, Button, Modal, Radio, RadioGroup } from '@navikt/ds-react';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';

interface IHenlegg {
    settHenlagtårsak: (årsak: EHenlagtårsak) => void;
    lagreHenleggelse: () => void;
    låsKnapp: boolean;
    henlagtårsak?: EHenlagtårsak;
    settVisHenleggModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HenleggModal: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { visHenleggModal, settVisHenleggModal } = useBehandling();

    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const lagreHenleggelse = () => {
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
        }

        if (låsKnapp || !henlagtårsak) {
            return;
        }
        settLåsKnapp(true);
        axiosRequest<string, { årsak: EHenlagtårsak }>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak,
            },
        })
            .then((respons: RessursSuksess<string> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVisHenleggModal(false);
                    navigate(`/behandling/${behandling.id}/resultat`);
                    settToast(EToast.BEHANDLING_HENLAGT);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    const StyledModalInnhold = styled(Modal.Content)`
        margin-top: 1rem;
        margin-right: 1rem;
        margin-left: 1rem;
    `;

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Henlegg',
                lukkKnapp: true,
                visModal: visHenleggModal,
                onClose: () => settVisHenleggModal(false),
            }}
        >
            <StyledModalInnhold>
                <Henlegging
                    lagreHenleggelse={lagreHenleggelse}
                    henlagtårsak={henlagtårsak}
                    settHenlagtårsak={settHenlagtårsak}
                    låsKnapp={låsKnapp}
                    settVisHenleggModal={settVisHenleggModal}
                />
                {feilmelding && <Alert variant="error">{feilmelding}</Alert>}
            </StyledModalInnhold>
        </UIModalWrapper>
    );
};

const StyledKnappWrapper = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
`;

const Henlegging: React.FC<IHenlegg> = ({
    settHenlagtårsak,
    lagreHenleggelse,
    låsKnapp,
    settVisHenleggModal,
}) => (
    <>
        <RadioGroup
            legend=""
            size="medium"
            onChange={(val: EHenlagtårsak) => settHenlagtårsak(val)}
        >
            <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
            <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
            <StyledKnappWrapper>
                <Button onClick={lagreHenleggelse} disabled={låsKnapp}>
                    Henlegg
                </Button>
                <Button variant="secondary" onClick={() => settVisHenleggModal(false)}>
                    Avbryt
                </Button>
            </StyledKnappWrapper>
        </RadioGroup>
    </>
);
