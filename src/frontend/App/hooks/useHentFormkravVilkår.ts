import { useCallback, useEffect, useState } from 'react';
import { IFormkravVilkår } from '../../Komponenter/Behandling/Formkrav/typer';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import {
    alleVilkårOppfylt,
    påKlagetVedtakValgt,
} from '../../Komponenter/Behandling/Formkrav/validerFormkravUtils';

export interface HentFormkravVilkår {
    vilkårsvurderinger: Ressurs<IFormkravVilkår>;
    hentVilkårsvurderinger: (behandlingId: string) => void;
    lagreVilkårsvurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    feilVedLagring: string;
    formkravOppfylt: boolean;
}

export const useHentFormkravVilkår = (): HentFormkravVilkår => {
    const { axiosRequest } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');

    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormkravVilkår>>(byggTomRessurs);
    const [formkravOppfylt, settFormkravOppfylt] = useState<boolean>(false);

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
                settFeilVedLagring(respons.frontendFeilmelding ?? 'Noe gikk galt ved innsending');
            }
            return respons;
        });
    };

    useEffect(() => {
        settFormkravOppfylt(
            vilkårsvurderinger.status === RessursStatus.SUKSESS &&
                påKlagetVedtakValgt(vilkårsvurderinger.data) &&
                alleVilkårOppfylt(vilkårsvurderinger.data)
        );
    }, [vilkårsvurderinger]);

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurderinger,
        feilVedLagring,
        formkravOppfylt,
    };
};
