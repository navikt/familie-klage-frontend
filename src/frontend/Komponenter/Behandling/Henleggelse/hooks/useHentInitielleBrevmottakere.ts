import { useApp } from '../../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../App/typer/ressurs';
import { Brevmottakere } from '../../Brevmottakere/brevmottakere';

export function useHentInitielleBrevmottakere() {
    const { axiosRequest } = useApp();

    async function hentInitielleBrevmottakere(
        behandlingId: string
    ): Promise<Awaited<Brevmottakere>> {
        return axiosRequest<Brevmottakere, void>({
            method: 'GET',
            url: `/familie-klage/api/brevmottaker/initielle/${behandlingId}`,
        }).then((respons: RessursSuksess<Brevmottakere> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                return Promise.resolve(respons.data);
            } else {
                return Promise.reject(new Error(respons.frontendFeilmelding));
            }
        });
    }

    return hentInitielleBrevmottakere;
}
