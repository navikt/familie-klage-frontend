import { Henlagtårsak } from './Henlagtårsak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';

interface HenleggBehandlingDto {
    årsak: Henlagtårsak;
    skalSendeHenleggelsesbrev: boolean;
}

export function useHenleggBehandling() {
    const { axiosRequest } = useApp();
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();

    async function henleggBhandling(
        behandlingId: string,
        henlagtÅrsak: Henlagtårsak,
        sendBrevOmTrukketKlage: boolean | null
    ): Promise<Awaited<void>> {
        return axiosRequest<void, HenleggBehandlingDto>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/henlegg`,
            data: {
                årsak: henlagtÅrsak,
                skalSendeHenleggelsesbrev: sendBrevOmTrukketKlage ?? false,
            },
        }).then((respons: RessursSuksess<void> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(respons.frontendFeilmelding));
            }
        });
    }

    return { henleggBhandling };
}
