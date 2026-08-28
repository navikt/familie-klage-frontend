import { Alert } from '@navikt/ds-react';
import * as React from 'react';
import { useEffect } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { useHentVurderinger } from '../../../App/hooks/useHentVurderinger';
import type { Behandling } from '../../../App/typer/fagsak';
import { Fagsystem } from '../../../App/typer/fagsak';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { alleVilkårOppfylt, påklagetVedtakErValgt } from '../Formkrav/validerFormkravUtils';
import { VurderingLesemodus } from './VurderingLesemodus';
import { VurderingRedigeringsmodus } from './VurderingRedigeringsmodus';
import { VurderingRedigeringsmodus as VurderingRedigeringsmodusBaks } from './VurderingRedigeringsmodusBaks/VurderingRedigeringsmodus';

export const VurderingFane: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
    const { vurdering, hentVurdering } = useHentVurderinger();

    const behandlingId = behandling.id;

    useEffect(() => {
        if (behandlingId !== undefined) {
            hentVilkårsvurderinger(behandlingId);
            hentVurdering(behandlingId);
        }
    }, [behandlingId, hentVilkårsvurderinger, hentVurdering]);

    return (
        <DataViewer response={{ vilkårsvurderinger, vurdering }}>
            {({ vilkårsvurderinger, vurdering }) => {
                const skalViseVurderingsvalg =
                    påklagetVedtakErValgt(vilkårsvurderinger) &&
                    alleVilkårOppfylt(vilkårsvurderinger);

                const skalViseRedigeringsmodus = behandlingErRedigerbar && skalViseVurderingsvalg;

                return (
                    <>
                        {behandlingErRedigerbar && !skalViseVurderingsvalg && (
                            <Alert variant={'error'}>
                                Alle formkrav må være utfylt. Vennligst naviger til formkravfanen
                                for å ta stilling til formkravene.
                            </Alert>
                        )}
                        {!behandlingErRedigerbar && skalViseVurderingsvalg && vurdering && (
                            <VurderingLesemodus vurdering={vurdering} />
                        )}
                        {skalViseRedigeringsmodus &&
                            (behandling.fagsystem !== Fagsystem.EF ? (
                                <VurderingRedigeringsmodusBaks
                                    behandling={behandling}
                                    vurdering={vurdering}
                                />
                            ) : (
                                <VurderingRedigeringsmodus
                                    behandling={behandling}
                                    vurdering={vurdering}
                                />
                            ))}
                    </>
                );
            }}
        </DataViewer>
    );
};
