import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useState } from 'react';
import {
    byggHenterRessurs,
    byggTomRessurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { behandlendeEnheter, OppdaterBehandlendeEnhetRequest } from './behandlendeEnhet';
import { Fagsystem } from '../../../App/typer/fagsak';

interface IProps {
    behandlendeEnhet: string;
    fagsystem: Fagsystem;
    onSuccessCallback: () => void;
}

const useEndreBehandlendeEnhet = ({ behandlendeEnhet, fagsystem, onSuccessCallback }: IProps) => {
    const { axiosRequest } = useApp();
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();

    const [enhetsnummer, settEnhetsnummer] = useState<string>(behandlendeEnhet);
    const [begrunnelse, settBegrunnelse] = useState('');
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [submitRessurs, settSubmitRessurs] = useState(byggTomRessurs());

    const onChangeEnhetsnummer = (enhetsnummer: string) => {
        settFeilmelding('');
        settEnhetsnummer(enhetsnummer);
    };

    const onChangeBegrunnelse = (begrunnelse: string) => {
        settFeilmelding('');
        settBegrunnelse(begrunnelse);
    };

    const onSubmitEndreEnhet = (behandlingId: string) => {
        settFeilmelding('');
        if (begrunnelse === '') {
            settFeilmelding('Du må skrive en begrunnelse for endring av enhet');
            return;
        }

        if (enhetsnummer !== undefined) {
            settSubmitRessurs(byggHenterRessurs());
            axiosRequest<string, OppdaterBehandlendeEnhetRequest>({
                method: 'PUT',
                data: {
                    enhetsnummer: enhetsnummer,
                    begrunnelse: begrunnelse,
                },
                url: `/familie-klage/api/behandling/${behandlingId}/oppdater-behandlende-enhet`,
            }).then((oppdatertBehandling: RessursSuksess<string> | RessursFeilet) => {
                if (oppdatertBehandling.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    hentBehandlingshistorikk.rerun();
                    settBegrunnelse('');
                    onSuccessCallback();
                } else {
                    settFeilmelding(oppdatertBehandling.frontendFeilmelding);
                }
                settSubmitRessurs(byggTomRessurs());
            });
        }
    };

    const resetEndreBehandlendeEnhetTilstand = () => {
        settEnhetsnummer(behandlendeEnhet);
        settBegrunnelse('');
        settFeilmelding('');
        settSubmitRessurs(byggTomRessurs());
    };

    const gyldigeEnheterForFagsystem = behandlendeEnheter.filter((behandlendeEnhet) =>
        behandlendeEnhet.gyldigForFagsystem.includes(fagsystem)
    );

    return {
        enhetsnummer,
        onChangeEnhetsnummer,
        begrunnelse,
        onChangeBegrunnelse,
        onSubmitEndreEnhet,
        resetEndreBehandlendeEnhetTilstand,
        submitRessurs,
        feilmelding,
        gyldigeEnheterForFagsystem,
    };
};

export default useEndreBehandlendeEnhet;
