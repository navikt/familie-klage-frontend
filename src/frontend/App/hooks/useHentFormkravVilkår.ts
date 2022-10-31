import { useCallback, useState } from 'react';
import { FagsystemVedtak, IFormkravVilkår } from '../../Komponenter/Behandling/Formkrav/typer';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';

export const useHentFormkravVilkår = (): {
    vilkårsvurderinger: Ressurs<IFormkravVilkår>;
    hentVilkårsvurderinger: (behandlingId: string) => void;
    lagreVilkårsvurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    feilVedLagring: string;
    hentFagsystemVedtak: (behandlingId: string) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');

    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormkravVilkår>>(byggTomRessurs);

    const [fagsystemVedtak, settFagsystemVedtak] =
        useState<Ressurs<FagsystemVedtak[]>>(byggTomRessurs);

    const hentVilkårsvurderinger = useCallback(
        (behandlingId: string) => {
            axiosRequest<IFormkravVilkår, null>({
                method: 'GET',
                url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
            }).then((hentedeVurderinger: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
                settVilkårsvurderinger(hentedeVurderinger);
            });
        },
        [axiosRequest]
    );

    const lagreVilkårsvurderinger = (
        vurderinger: IFormkravVilkår
    ): Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet> => {
        settFeilVedLagring('');
        return axiosRequest<IFormkravVilkår, IFormkravVilkår>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: vurderinger,
        }).then((respons: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsvurderinger(respons);
            } else {
                settFeilVedLagring(respons.frontendFeilmelding ?? 'Noe gikk galt');
            }
            return respons;
        });
    };

    const hentFagsystemVedtak = useCallback(
        (behandlingId: string) => {
            axiosRequest<FagsystemVedtak[], null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/${behandlingId}/fagsystem-vedtak`,
            }).then(settFagsystemVedtak);
        },
        [axiosRequest]
    );

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurderinger,
        feilVedLagring,
        hentFagsystemVedtak,
        fagsystemVedtak,
    };
};
