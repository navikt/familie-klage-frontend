import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../App/typer/ressurs';
import { useApp } from '../../../../App/context/AppContext';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { HenleggBehandlingDto } from '../domain/henleggBehandlingDto';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../../App/typer/toast';

export function useHenleggBehandling() {
    const navigate = useNavigate();
    const { axiosRequest, settToast } = useApp();
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();

    async function henleggBhandling(
        behandlingId: string,
        henleggBehandlingDto: HenleggBehandlingDto
    ): Promise<Awaited<void>> {
        return axiosRequest<void, HenleggBehandlingDto>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/henlegg`,
            data: henleggBehandlingDto,
        }).then((respons: RessursSuksess<void> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                settToast(EToast.BEHANDLING_HENLAGT);
                navigate(`/behandling/${behandlingId}/resultat`);
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(respons.frontendFeilmelding));
            }
        });
    }

    return henleggBhandling;
}
