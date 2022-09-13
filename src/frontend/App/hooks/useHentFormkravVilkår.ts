import { useCallback, useState } from 'react';
import { IFormkravVilkår } from '../../Komponenter/Behandling/Formkrav/typer';
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
    feilmeldinger: string;
} => {
    const { axiosRequest } = useApp();

    const [feilmeldinger, settFeilmeldinger] = useState<string>('');
    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormkravVilkår>>(byggTomRessurs);

    const tilbakestillFeilmelding = () => {
        settFeilmeldinger('');
    };

    const leggTilFeilmelding = () => {
        settFeilmeldinger('Noe gikk galt');
    };

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
        return axiosRequest<IFormkravVilkår, IFormkravVilkår>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: vurderinger,
        }).then((respons: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                tilbakestillFeilmelding();
                settVilkårsvurderinger(() => respons as RessursSuksess<IFormkravVilkår>);
            } else {
                leggTilFeilmelding();
            }
            return respons;
        });
    };

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurderinger,
        feilmeldinger,
    };
};
