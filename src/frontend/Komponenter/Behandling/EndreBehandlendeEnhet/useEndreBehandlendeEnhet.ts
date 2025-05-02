import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';

export interface OppdaterBehandlendeEnhetDto {
    enhetsnummer: string;
    begrunnelse: string;
}

export function useEndreBehandlendeEnhet() {
    const { axiosRequest } = useApp();
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();

    async function endreBehandlendeEnhet(
        behandlingId: string,
        enhetsnummer: string,
        begrunnelse: string
    ): Promise<void> {
        return axiosRequest<string, OppdaterBehandlendeEnhetDto>({
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
            } else {
                throw Error(oppdatertBehandling.frontendFeilmelding);
            }
        });
    }

    return { endreBehandlendeEnhet };
}
