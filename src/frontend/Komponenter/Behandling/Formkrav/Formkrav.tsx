import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormkravVilkår, IKlageInfo } from './typer';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { utledRedigeringsmodus } from './utils';

export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { vilkårsvurderinger, hentVilkårsvurderinger, lagreVilkårsvurderinger } =
        useHentFormkravVilkår();

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkårsvurderinger.status !== RessursStatus.SUKSESS) {
                hentVilkårsvurderinger(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkårsvurderinger }}>
            {({ vilkårsvurderinger }) => {
                return (
                    <FormkravKomponent
                        behandlingId={behandlingId}
                        vilkårsvurderinger={vilkårsvurderinger}
                        lagreVurderinger={lagreVilkårsvurderinger}
                    />
                );
            }}
        </DataViewer>
    );
};

const FormkravKomponent: React.FC<{
    behandlingId: string;
    vilkårsvurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
}> = ({ behandlingId, vilkårsvurderinger, lagreVurderinger }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const formKlageObjekt: IKlageInfo = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksDato: '',
        klageMottatt: '',
        klageAarsak: '',
        klageBeskrivelse: '',
    };

    const [klageInfo, settKlageInfo] = useState<IKlageInfo>(formKlageObjekt);
    const [redigeringsmodus, settRedigeringsmodus] = useState(
        utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger)
    );

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IKlageInfo, null>({
            method: 'GET',
            url: `/familie-klage/api/klageinfo/${behandlingId}`,
        }).then((res: Ressurs<IKlageInfo>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settKlageInfo((prevState) => ({
                    ...prevState,
                    fagsakId: res.data.fagsakId,
                    klageMottatt: res.data.klageMottatt,
                    klageAarsak: res.data.klageAarsak,
                    klageBeskrivelse: res.data.klageBeskrivelse,
                    vedtaksDato: res.data.vedtaksDato,
                }));
            }
        });
    }, [axiosRequest, behandlingId]);

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <KlageInfo
                        klageInfo={klageInfo}
                        vurderinger={vilkårsvurderinger}
                        redigeringsmodus={redigeringsmodus}
                    />
                ),
                høyre: (
                    <VisEllerEndreFormkravVurderinger
                        vurderinger={vilkårsvurderinger}
                        lagreVurderinger={lagreVurderinger}
                        redigeringsmodus={redigeringsmodus}
                        settRedigeringsmodus={settRedigeringsmodus}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
