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

export interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

export const useHentVurderinger = (): {
    vurdering: Ressurs<IVurdering | null>;
    hentVurdering: (behandlingId: string) => void;
    lagreVurderingOgOppdaterSteg: (
        vurderinger: IVurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    lagreVurdering: (
        vurderinger: IVurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    melding: IMelding | undefined;
    settMelding: (melding?: IMelding) => void;
} => {
    const { axiosRequest } = useApp();

    const [melding, settMelding] = useState<IMelding>();

    const [vurdering, settVurdering] = useState<Ressurs<IVurdering | null>>(byggTomRessurs);

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering | null, null>({
                method: 'GET',
                url: `/familie-klage/api/vurdering/${behandlingId}`,
            }).then((hentetVurdering: RessursSuksess<IVurdering | null> | RessursFeilet) => {
                settVurdering(hentetVurdering);
            });
        },
        [axiosRequest]
    );

    const lagre = (
        vurdering: IVurdering,
        url: string
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        settMelding(undefined);
        return axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: url,
            data: vurdering,
        }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVurdering(respons);
                settMelding({
                    tekst: 'Vurderingen er lagret',
                    type: 'success',
                });
            } else {
                settMelding({
                    tekst: respons.frontendFeilmelding || 'Noe gikk galt ved innsending',
                    type: 'error',
                });
            }
            return respons;
        });
    };

    const lagreVurderingOgOppdaterSteg = (
        vurdering: IVurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> =>
        lagre(vurdering, '/familie-klage/api/vurdering/lagre-og-oppdater-steg');

    const lagreVurdering = (
        vurdering: IVurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> =>
        lagre(vurdering, '/familie-klage/api/vurdering/lagre');

    return {
        vurdering,
        hentVurdering,
        lagreVurderingOgOppdaterSteg,
        lagreVurdering,
        melding,
        settMelding,
    };
};
