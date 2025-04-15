import * as React from 'react';
import { useEffect } from 'react';
import { Alert } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VurderingLesemodus } from './VurderingLesemodus';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Formkrav/validerFormkravUtils';
import { useHentVurderinger } from '../../../App/hooks/useHentVurderinger';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';
import { VurderingRedigeringsmodus as VurderingRedigeringsmodusBaks } from './VurderingRedigeringsmodusBaks/VurderingRedigeringsmodus';
import { VurderingRedigeringsmodus } from './VurderingRedigeringsmodus';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

export const Vurdering: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const behandlingId = behandling.id;

    const { behandlingErRedigerbar } = useBehandling();
    const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
    const { vurdering, hentVurdering } = useHentVurderinger();
    const { toggles } = useToggles();

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
                    påKlagetVedtakValgt(vilkårsvurderinger) &&
                    alleVilkårOppfylt(vilkårsvurderinger);

                return (
                    <>
                        {behandlingErRedigerbar && !skalViseVurderingsvalg && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <VurderingLesemodus vurdering={vurdering} />
                        )}
                        {behandlingErRedigerbar &&
                            skalViseVurderingsvalg &&
                            (behandling.fagsystem === Fagsystem.EF ||
                            !toggles[ToggleName.kanMellomlagreVurdering] ? (
                                <VurderingRedigeringsmodus
                                    behandling={behandling}
                                    vurdering={vurdering}
                                />
                            ) : (
                                <VurderingRedigeringsmodusBaks
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
