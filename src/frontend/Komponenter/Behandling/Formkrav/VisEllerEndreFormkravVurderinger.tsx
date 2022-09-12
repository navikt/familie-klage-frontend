import React, { useState } from 'react';
import { VisFormkravVurderinger } from './VisFormkravVurderinger';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormVilkår, IRadioKnapper, Redigeringsmodus, VilkårStatus } from './typer';
import { utledRedigeringsmodus } from './utils';
import { EndreFormkravVurderinger } from './EndreFormkravVurderinger';

export interface IProps {
    settFormkravGyldig: (value: boolean) => void;
    låst: boolean;
    settLåst: (value: boolean) => void;
    formData: IFormVilkår;
    settFormkravBesvart: (value: boolean) => void;
    settFormVilkårData: (value: IFormVilkår) => void;
}

export const VisEllerEndreFormkravVurderinger: React.FC<IProps> = ({
    settFormkravGyldig,
    låst,
    settLåst,
    formData,
    settFormkravBesvart,
    settFormVilkårData,
}) => {
    const { visAdvarselFormkrav, settVisAdvarselFormkrav, hentBehandling, behandlingErRedigerbar } =
        useBehandling();

    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const vilkårErGyldig = (): boolean => {
        const svarListe = [
            formData.klagePart,
            formData.klageSignert,
            formData.klageKonkret,
            formData.klagefristOverholdt,
        ];
        return (
            svarListe.filter((svar) => svar !== 'OPPFYLT').length === 0 &&
            formData.saksbehandlerBegrunnelse.length !== 0
        );
    };

    const vilkårErBesvart = (): boolean => {
        const svarListe = [
            formData.klagePart,
            formData.klageSignert,
            formData.klageKonkret,
            formData.klagefristOverholdt,
        ];
        return (
            ((svarListe.includes(VilkårStatus.SKAL_IKKE_VURDERES) &&
                svarListe.includes(VilkårStatus.IKKE_OPPFYLT)) ||
                !svarListe.includes(VilkårStatus.SKAL_IKKE_VURDERES)) &&
            !svarListe.includes(VilkårStatus.IKKE_SATT) &&
            formData.saksbehandlerBegrunnelse !== ''
        );
    };

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const opprettForm = () => {
        if (senderInn) {
            return;
        }
        settSenderInn(true);

        if (vilkårErGyldig()) settFormkravGyldig(true);

        if (vilkårErBesvart()) {
            settFormkravBesvart(true);
        } else {
            settFormkravBesvart(false);
        }
        settLåst(true);
        axiosRequest<IFormVilkår, IFormVilkår>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: formData,
        }).then((res: Ressurs<IFormVilkår>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFormVilkårData((prevState: IFormVilkår) => ({
                    ...prevState,
                    endretTid: res.data.endretTid,
                }));
                settVisAdvarselFormkrav(false);
                nullstillIkkePersisterteKomponenter();
            } else {
                settLåst(false);
                settVisAdvarselFormkrav(true);
            }
            settSenderInn(false);
            hentBehandling.rerun();
        });
    };

    const låsOppFormVilkår = (val: boolean) => {
        settFormkravGyldig(val);
        settLåst(val);
    };

    const radioKnapperVilkår: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: formData.klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket?',
            svar: formData.klageKonkret,
            navn: 'klageKonkret',
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: formData.klagefristOverholdt,
            navn: 'klagefristOverholdt',
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: formData.klageSignert,
            navn: 'klageSignert',
        },
    ];

    const redigeringsModus = utledRedigeringsmodus(
        visAdvarselFormkrav,
        behandlingErRedigerbar,
        formData
    );
    console.log(redigeringsModus);
    switch (redigeringsModus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
        case Redigeringsmodus.REDIGERING:
            return (
                <EndreFormkravVurderinger
                    radioKnapper={radioKnapperVilkår}
                    settFormkravGyldig={settFormkravGyldig}
                    låst={låst}
                    settLåst={settLåst}
                    formData={formData}
                    settFormkravBesvart={settFormkravBesvart}
                    settFormVilkårData={settFormVilkårData}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisFormkravVurderinger
                    radioKnapper={radioKnapperVilkår}
                    redigerHandling={låsOppFormVilkår}
                    saksbehandlerBegrunnelse={formData.saksbehandlerBegrunnelse}
                    endretTid={formData.endretTid}
                    settFormkravGyldig={settFormkravGyldig}
                    settFormVilkårData={settFormVilkårData}
                    senderInn={senderInn}
                    settSenderInn={settSenderInn}
                />
            );
    }
};
