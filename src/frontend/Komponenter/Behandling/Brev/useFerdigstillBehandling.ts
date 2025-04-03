import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../App/context/AppContext';

export const useFerdigstillBehandling = (
    behandlingId: string,
    onSuccess: () => void,
    onFailure: (feilmelding: string) => void
) => {
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();

    const [senderInn, settSenderInn] = useState(false);
    const navigate = useNavigate();
    const { axiosRequest } = useApp();

    const ferdigstill = () => {
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
                onSuccess();
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                navigate(`/behandling/${behandlingId}/resultat`);
            } else {
                onFailure(res.frontendFeilmelding);
            }
        });
    };

    return {
        ferdigstill,
        senderInn,
    };
};
