import { useCallback, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Ressurs } from '../typer/ressurs';
import { byggHenterRessurs, byggTomRessurs } from '../typer/ressurs';
import type { AnsvarligSaksbehandler } from '../typer/saksbehandler';

export const useHentAnsvarligSaksbehandler = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [ansvarligSaksbehandler, settAnsvarligSaksbehandler] = useState<
        Ressurs<AnsvarligSaksbehandler>
    >(byggTomRessurs());

    const hentAnsvarligSaksbehandlerCallback = useCallback(() => {
        settAnsvarligSaksbehandler(byggHenterRessurs());
        axiosRequest<AnsvarligSaksbehandler, string>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}/ansvarlig-saksbehandler`,
        }).then((res: Ressurs<AnsvarligSaksbehandler>) => settAnsvarligSaksbehandler(res));
    }, [axiosRequest, behandlingId]);

    return {
        ansvarligSaksbehandler,
        hentAnsvarligSaksbehandlerCallback,
    };
};
