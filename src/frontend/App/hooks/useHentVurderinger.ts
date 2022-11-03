import { useCallback, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IVurdering } from '../../Komponenter/Behandling/Vurdering/vurderingValg';

export const useHentVurderinger = (): {
    vurdering: Ressurs<IVurdering>;
    hentVurdering: (behandlingId: string) => void;
    lagreVurdering: (
        vurderinger: IVurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    feilVedLagring: string;
} => {
    const { axiosRequest } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');

    const [vurdering, settVurdering] = useState<Ressurs<IVurdering>>(byggTomRessurs);

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering, null>({
                method: 'GET',
                url: `/familie-klage/api/vurdering/${behandlingId}`,
            }).then((hentetVurdering: RessursSuksess<IVurdering> | RessursFeilet) => {
                settVurdering(hentetVurdering);
            });
        },
        [axiosRequest]
    );

    const lagreVurdering = (
        vurdering: IVurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        settFeilVedLagring('');
        return axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: vurdering,
        }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVurdering(respons);
            } else {
                settFeilVedLagring(respons.frontendFeilmelding ?? 'Noe gikk galt ved innsending');
            }
            return respons;
        });
    };

    return {
        vurdering,
        hentVurdering,
        lagreVurdering,
        feilVedLagring,
    };
};
