import { Alert } from '@navikt/ds-react';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import type { Fagsystem } from '../../../App/typer/fagsak';
import type { Ressurs, RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import { byggTomRessurs, RessursStatus } from '../../../App/typer/ressurs';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import type { IVurdering } from '../Vurdering/vurderingValg';
import { VedtakValg } from '../Vurdering/vurderingValg';
import { OmgjørVedtak } from './OmgjørVedtak';
import { OpprettholdVedtak } from './OpprettholdVedtak';

interface Props {
    behandlingId: string;
    fagsystem: Fagsystem;
}

export const Brev: React.FC<Props> = ({ behandlingId, fagsystem }) => {
    const { axiosRequest } = useApp();
    const { formkravErOppfylt } = useBehandling();
    const [feilmelding, settFeilmelding] = useState('');
    const [vurdering, settVurdering] = useState<Ressurs<IVurdering | undefined>>(byggTomRessurs());

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering | undefined, null>({
                method: 'GET',
                url: `/familie-klage/api/vurdering/${behandlingId}`,
            }).then((response: RessursSuksess<IVurdering | undefined> | RessursFeilet) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (!response.data?.vedtak && formkravErOppfylt) {
                        settFeilmelding(
                            'Det er ikke tatt stilling til om vedtaket skal opprettholdes eller omgjøres. Vennligst naviger til vurderingsfanen for å ta stilling til dette.'
                        );
                    } else {
                        settVurdering(response);
                    }
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            });
        },
        [axiosRequest, formkravErOppfylt]
    );

    useEffect(() => {
        hentVurdering(behandlingId);
    }, [behandlingId, hentVurdering]);

    if (feilmelding) {
        return <Alert variant="error">{feilmelding}</Alert>;
    }

    return (
        <DataViewer response={{ vurdering }}>
            {({ vurdering }) => {
                if (vurdering && vurdering.vedtak === VedtakValg.OMGJØR_VEDTAK) {
                    return <OmgjørVedtak behandlingId={behandlingId} />;
                }
                return <OpprettholdVedtak behandlingId={behandlingId} fagsystem={fagsystem} />;
            }}
        </DataViewer>
    );
};
