import { useCallback, useState } from 'react';
import { IFormVilkår } from '../../Komponenter/Behandling/Formkrav/typer';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';

export const useHentFormkravVilkår = (): {
    vilkårsvurderinger: Ressurs<IFormVilkår>;
    hentVilkårsvurderinger: (behandlingId: string) => void;
    lagreVilkårsvurderinger: (
        vurderinger: IFormVilkår
    ) => Promise<RessursSuksess<IFormVilkår> | RessursFeilet>;
    feilmeldinger: string;
} => {
    const { axiosRequest } = useApp();

    const [feilmeldinger, settFeilmeldinger] = useState<string>('');
    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormVilkår>>(byggTomRessurs);

    const tilbakestillFeilmelding = () => {
        settFeilmeldinger('');
    };

    const leggTilFeilmelding = () => {
        settFeilmeldinger('Noe gikk galt');
    };

    const hentVilkårsvurderinger = useCallback(
        (behandlingId: string) => {
            axiosRequest<IFormVilkår, null>({
                method: 'GET',
                url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
            }).then((hentedeVurderinger: RessursSuksess<IFormVilkår> | RessursFeilet) => {
                settVilkårsvurderinger(hentedeVurderinger);
            });
        },
        [axiosRequest]
    );

    const lagreVilkårsvurderinger = (
        vurderinger: IFormVilkår
    ): Promise<RessursSuksess<IFormVilkår> | RessursFeilet> => {
        return axiosRequest<IFormVilkår, IFormVilkår>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: vurderinger,
        }).then((respons: RessursSuksess<IFormVilkår> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                tilbakestillFeilmelding();
                settVilkårsvurderinger(() => respons as RessursSuksess<IFormVilkår>);
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
