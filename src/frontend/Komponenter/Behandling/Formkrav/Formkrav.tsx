import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormKlage, IFormVilkår, VilkårStatus } from './typer';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';

export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const formKlageObjekt: IFormKlage = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksDato: '',
        klageMottatt: '',
        klageAarsak: '',
        klageBeskrivelse: '',
    };

    const dateString = new Date().toISOString().split('T')[0];
    const formVilkårObjekt: IFormVilkår = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        klagePart: VilkårStatus.IKKE_SATT,
        klageKonkret: VilkårStatus.IKKE_SATT,
        klagefristOverholdt: VilkårStatus.IKKE_SATT,
        klageSignert: VilkårStatus.IKKE_SATT,
        saksbehandlerBegrunnelse: '',
        endretTid: dateString,
    };

    const [formKlageData, settFormKlageData] = useState<IFormKlage>(formKlageObjekt);
    const [formVilkårData, settFormVilkårData] = useState<IFormVilkår>(formVilkårObjekt);
    const { formkravLåst, settFormkravLåst, formkravGyldig, settFormkravGyldig } = useBehandling();
    const { settFormkravBesvart } = useBehandling();

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
        axiosRequest<IFormVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then((res: Ressurs<IFormVilkår>) => {
            if (res.status === RessursStatus.SUKSESS && res.data != null) {
                settFormkravLåst(true);
                settFormVilkårData((prevState) => ({
                    ...prevState,
                    fagsakId: res.data.fagsakId,
                    klagePart: res.data.klagePart,
                    klageKonkret: res.data.klageKonkret,
                    klagefristOverholdt: res.data.klagefristOverholdt,
                    klageSignert: res.data.klageSignert,
                    saksbehandlerBegrunnelse: res.data.saksbehandlerBegrunnelse,
                    endretTid: res.data.endretTid,
                }));

                const vilkårListe = [
                    res.data.klagePart,
                    res.data.klageKonkret,
                    res.data.klagefristOverholdt,
                    res.data.klageSignert,
                ];

                const besvart = vilkårListe.filter(
                    (item: VilkårStatus) => item === VilkårStatus.OPPFYLT
                ).length;
                const muligBesvart = vilkårListe.length;
                settFormkravGyldig(besvart === muligBesvart);
                settFormkravBesvart(true);
            } else settFormkravLåst(false);
        });
    }, [axiosRequest, behandlingId, settFormkravLåst, settFormkravGyldig, settFormkravBesvart]);
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <KlageInfo
                        formkravGyldig={formkravGyldig}
                        formkrav={formKlageData}
                        låst={formkravLåst}
                    />
                ),
                høyre: (
                    <VisEllerEndreFormkravVurderinger
                        settFormkravGyldig={settFormkravGyldig}
                        låst={formkravLåst}
                        settLåst={settFormkravLåst}
                        formData={formVilkårData}
                        settFormkravBesvart={settFormkravBesvart}
                        settFormVilkårData={settFormVilkårData}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
