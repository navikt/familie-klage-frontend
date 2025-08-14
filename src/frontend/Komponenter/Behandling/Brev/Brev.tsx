import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { IVurdering, VedtakValg } from '../Vurdering/vurderingValg';
import { OmgjørVedtak } from './OmgjørVedtak';
import { Fagsystem } from '../../../App/typer/fagsak';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { OpprettholdVedtak } from './OpprettholdVedtak';
import { Alert } from '@navikt/ds-react';

interface Props {
    behandlingId: string;
    fagsystem: Fagsystem;
}

export const Brev: React.FC<Props> = ({ behandlingId, fagsystem }) => {
    const { axiosRequest } = useApp();
    const [feilmelding, settFeilmelding] = useState('');
    const [vurdering, settVurdering] = useState<Ressurs<IVurdering | undefined>>(byggTomRessurs());

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering | undefined, null>({
                method: 'GET',
                url: `/familie-klage/api/vurdering/${behandlingId}`,
            }).then((response: RessursSuksess<IVurdering | undefined> | RessursFeilet) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (!response.data?.vedtak) {
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
        [axiosRequest]
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
                if (vurdering && vurdering.vedtak) {
                    if (vurdering.vedtak === VedtakValg.OPPRETTHOLD_VEDTAK) {
                        return (
                            <OpprettholdVedtak
                                behandlingId={behandlingId}
                                fagsystem={fagsystem}
                                vurdering={vurdering}
                            />
                        );
                    }

                    if (vurdering.vedtak === VedtakValg.OMGJØR_VEDTAK) {
                        return <OmgjørVedtak behandlingId={behandlingId} />;
                    }
                }
                return <Alert variant="error">Noe gikk galt</Alert>;
            }}
        </DataViewer>
    );
};
