import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormkravVilkår } from './typer';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { utledRedigeringsmodus } from './utils';
import { Behandling } from '../../../App/typer/fagsak';

export const Formkrav: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { vilkårsvurderinger, hentVilkårsvurderinger, lagreVilkårsvurderinger, feilVedLagring } =
        useHentFormkravVilkår();
    const behandlingId = behandling.id;

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkårsvurderinger.status !== RessursStatus.SUKSESS) {
                hentVilkårsvurderinger(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId, hentVilkårsvurderinger]);

    return (
        <DataViewer response={{ vilkårsvurderinger }}>
            {({ vilkårsvurderinger }) => {
                return (
                    <FormkravKomponent
                        vilkårsvurderinger={vilkårsvurderinger}
                        lagreVurderinger={lagreVilkårsvurderinger}
                        behandling={behandling}
                        feilmelding={feilVedLagring}
                    />
                );
            }}
        </DataViewer>
    );
};

const FormkravKomponent: React.FC<{
    vilkårsvurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    behandling: Behandling;
    feilmelding: string;
}> = ({ vilkårsvurderinger, lagreVurderinger, behandling, feilmelding }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const [oppdaterteVurderinger, settOppdaterteVurderinger] =
        useState<IFormkravVilkår>(vilkårsvurderinger);
    const [redigeringsmodus, settRedigeringsmodus] = useState(
        utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger)
    );

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <KlageInfo
                        behandling={behandling}
                        vurderinger={oppdaterteVurderinger}
                        redigeringsmodus={redigeringsmodus}
                        settOppdaterteVurderinger={settOppdaterteVurderinger}
                    />
                ),
                høyre: (
                    <VisEllerEndreFormkravVurderinger
                        vurderinger={oppdaterteVurderinger}
                        settOppdaterteVurderinger={settOppdaterteVurderinger}
                        lagreVurderinger={lagreVurderinger}
                        redigeringsmodus={redigeringsmodus}
                        settRedigeringsmodus={settRedigeringsmodus}
                        feilmelding={feilmelding}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
