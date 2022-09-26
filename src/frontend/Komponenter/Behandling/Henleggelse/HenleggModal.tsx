import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from './EHenlagtÅrsak';
import styled from 'styled-components';
import { Alert, Button, Heading, Modal, Radio, RadioGroup } from '@navikt/ds-react';

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
            .then((respons: Ressurs<string>) => {
                switch (respons.status) {
                    case RessursStatus.SUKSESS:
                        navigate(`/fagsak/${behandling.fagsakId}`);
                        settToast(EToast.BEHANDLING_HENLAGT);
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
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
        <Modal open={visHenleggModal} onClose={() => settVisHenleggModal(false)} closeButton={true}>
            <StyledModalInnhold>
                <Heading spacing level="1" size="medium">
                    Henlegg
                </Heading>
                <Henlegging
                    lagreHenleggelse={lagreHenleggelse}
                    henlagtårsak={henlagtårsak}
                    settHenlagtårsak={settHenlagtårsak}
                    låsKnapp={låsKnapp}
                    settVisHenleggModal={settVisHenleggModal}
                />
                {feilmelding && <Alert variant="error">{feilmelding}</Alert>}
            </StyledModalInnhold>
        </Modal>
    );
};

const StyledButton = styled(Button)`
    margin-top: 1rem;
`;

const Henlegging: React.FC<IHenlegg> = ({
    settHenlagtårsak,
    lagreHenleggelse,
    låsKnapp,
    henlagtårsak,
    settVisHenleggModal,
}) => (
    <>
        <RadioGroup
            legend=""
            size="medium"
            onChange={(val: EHenlagtårsak) => settHenlagtårsak(val)}
            defaultValue={henlagtårsak}
        >
            <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
            <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
            <StyledButton onClick={lagreHenleggelse} disabled={låsKnapp}>
                Henlegg
            </StyledButton>
            <StyledButton variant="secondary" onClick={() => settVisHenleggModal(false)}>
                Avbryt
            </StyledButton>
        </RadioGroup>
    </>
);
