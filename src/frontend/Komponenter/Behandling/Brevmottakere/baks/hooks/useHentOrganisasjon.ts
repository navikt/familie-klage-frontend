import { useApp } from '../../../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../App/typer/ressurs';
import { Organisasjon } from '../../ef/SøkOrganisasjon';

export function useHentOrganisasjon() {
    const { axiosRequest } = useApp();

    async function hentOrganisasjon(organisasjonsnummer: string): Promise<Awaited<Organisasjon>> {
        return axiosRequest<Organisasjon, null>({
            method: 'GET',
            url: `/familie-klage/api/sok/organisasjon/${organisasjonsnummer}`,
        }).then((respons: RessursSuksess<Organisasjon> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                return Promise.resolve(respons.data);
            } else {
                return Promise.reject(new Error(respons.frontendFeilmelding));
            }
        });
    }

    return hentOrganisasjon;
}
