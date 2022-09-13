import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormKlage } from './typer';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';

export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { vilkårsvurderinger, hentVilkårsvurderinger, lagreVilkårsvurderinger, feilmeldinger } =
        useHentFormkravVilkår();

    const formKlageObjekt: IFormKlage = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksDato: '',
        klageMottatt: '',
        klageAarsak: '',
        klageBeskrivelse: '',
    };

    const [formKlageData, settFormKlageData] = useState<IFormKlage>(formKlageObjekt);
    const { formkravGyldig, settFormkravGyldig } = useBehandling();

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IFormKlage, null>({
            method: 'GET',
            url: `/familie-klage/api/klageinfo/${behandlingId}`,
        }).then((res: Ressurs<IFormKlage>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFormKlageData((prevState) => ({
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

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkårsvurderinger.status !== RessursStatus.SUKSESS) {
                hentVilkårsvurderinger(behandlingId);
            }
        }
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkårsvurderinger }}>
            {({ vilkårsvurderinger }) => {
                return (
                    <ToKolonnerLayout>
                        {{
                            venstre: (
                                <KlageInfo
                                    formkravGyldig={formkravGyldig}
                                    formkrav={formKlageData}
                                />
                            ),
                            høyre: (
                                <VisEllerEndreFormkravVurderinger
                                    settFormkravGyldig={settFormkravGyldig}
                                    vurderinger={vilkårsvurderinger}
                                    lagreVurderinger={lagreVilkårsvurderinger}
                                />
                            ),
                        }}
                    </ToKolonnerLayout>
                );
            }}
        </DataViewer>
    );
};
