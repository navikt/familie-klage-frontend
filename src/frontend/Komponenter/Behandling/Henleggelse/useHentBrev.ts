import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';

export function useHentBrev() {
    const { axiosRequest } = useApp();

    async function hentBrev(behandlingId: string): Promise<Awaited<string>> {
        return axiosRequest<string, void>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandlingId}/henlegg/brev/forhandsvisning`,
        }).then((respons: RessursSuksess<string> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                return Promise.resolve(respons.data);
            } else {
                return Promise.reject(new Error(respons.frontendFeilmelding));
            }
        });
    }

    return { hentBrev };
}
