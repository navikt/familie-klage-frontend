import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../App/typer/ressurs';
import { useApp } from '../../../../App/context/AppContext';
import { ForhåndsvisHenleggBehandlingBrevDto } from '../domain/forhåndsvisHenleggBehandlingBrevDto';

export function useHentBrev() {
    const { axiosRequest } = useApp();

    async function hentBrev(
        behandlingId: string,
        forhåndsvisHenleggBehandlingBrevDto: ForhåndsvisHenleggBehandlingBrevDto
    ): Promise<Awaited<string>> {
        return axiosRequest<string, ForhåndsvisHenleggBehandlingBrevDto>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandlingId}/henlegg/brev/forhandsvisning`,
            data: forhåndsvisHenleggBehandlingBrevDto,
        }).then((respons: RessursSuksess<string> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                return Promise.resolve(respons.data);
            } else {
                return Promise.reject(new Error(respons.frontendFeilmelding));
            }
        });
    }

    return hentBrev;
}
