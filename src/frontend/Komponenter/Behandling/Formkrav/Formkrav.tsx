import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { FagsystemVedtak, IFormkravVilkår } from './typer';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { utledRedigeringsmodus } from './validerFormkravUtils';

export const Formkrav: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurderinger,
        feilVedLagring,
        fagsystemVedtak,
        hentFagsystemVedtak,
    } = useHentFormkravVilkår();
    const behandlingId = behandling.id;

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkårsvurderinger.status !== RessursStatus.SUKSESS) {
                hentVilkårsvurderinger(behandlingId);
                hentFagsystemVedtak(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId, hentVilkårsvurderinger, hentFagsystemVedtak]);

    return (
        <DataViewer response={{ vilkårsvurderinger, fagsystemVedtak }}>
            {({ vilkårsvurderinger, fagsystemVedtak }) => {
                return (
                    <FormkravKomponent
                        vilkårsvurderinger={vilkårsvurderinger}
                        lagreVurderinger={lagreVilkårsvurderinger}
                        behandling={behandling}
                        feilmelding={feilVedLagring}
                        fagsystemVedtak={fagsystemVedtak}
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
    fagsystemVedtak: FagsystemVedtak[];
}> = ({ vilkårsvurderinger, lagreVurderinger, behandling, feilmelding, fagsystemVedtak }) => {
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
                        fagsystemVedtak={fagsystemVedtak}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
