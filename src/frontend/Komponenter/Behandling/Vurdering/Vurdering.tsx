import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { Alert } from '@navikt/ds-react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IFormkravVilkår } from '../Formkrav/typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VurderingLesemodus } from './VurderingLesemodus';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Formkrav/validerFormkravUtils';
import { useHentVurderinger } from '../../../App/hooks/useHentVurderinger';
import { Behandling } from '../../../App/typer/fagsak';
import { VurderingRedigeringsmodus } from './VurderingRedigeringsmodus';

export const Vurdering: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());
    const behandlingId = behandling.id;

    const {
        oppdatertVurdering,
        settOppdatertVurdering,
        settVurderingEndret,
        behandlingErRedigerbar,
    } = useBehandling();

    const { vurdering, hentVurdering } = useHentVurderinger();
    const { axiosRequest } = useApp();

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vurdering.status !== RessursStatus.SUKSESS) {
                hentVurdering(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId, hentVurdering]);

    useEffect(() => {
        axiosRequest<IFormkravVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then(settFormkrav);
    }, [axiosRequest, behandlingId, settFormkrav]);

    useEffect(() => {
        if (vurdering.status === RessursStatus.SUKSESS && vurdering.data != null) {
            settOppdatertVurdering(vurdering.data);
        } else settVurderingEndret(true);
    }, [vurdering, settVurderingEndret, settOppdatertVurdering]);

    return (
        <DataViewer response={{ formkrav }}>
            {({ formkrav }) => {
                const skalViseVurderingsvalg =
                    påKlagetVedtakValgt(formkrav) && alleVilkårOppfylt(formkrav);

                return (
                    <>
                        {behandlingErRedigerbar && !skalViseVurderingsvalg && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <VurderingLesemodus vurdering={oppdatertVurdering} />
                        )}
                        {behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <VurderingRedigeringsmodus
                                behandling={behandling}
                                vurdering={oppdatertVurdering}
                            />
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
