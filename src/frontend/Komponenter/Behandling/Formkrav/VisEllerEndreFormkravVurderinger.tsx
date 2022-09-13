import React, { useState } from 'react';
import { VisFormkravVurderinger } from './VisFormkravVurderinger';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormVilkår, IRadioKnapper, Redigeringsmodus } from './typer';
import { utledRedigeringsmodus } from './utils';
import { EndreFormkravVurderinger } from './EndreFormkravVurderinger';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';

export interface IProps {
    settFormkravGyldig: (value: boolean) => void;
    vurderinger: IFormVilkår;
    lagreVurderinger: (
        vurderinger: IFormVilkår
    ) => Promise<RessursSuksess<IFormVilkår> | RessursFeilet>;
}

export const VisEllerEndreFormkravVurderinger: React.FC<IProps> = ({
    settFormkravGyldig,
    vurderinger,
    lagreVurderinger,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [redigeringsmodus, settRedigeringsmodus] = useState(
        utledRedigeringsmodus(behandlingErRedigerbar, vurderinger)
    );

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const låsOppFormVilkår = (val: boolean) => {
        settFormkravGyldig(val);
    };

    const radioKnapperVilkår: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: vurderinger.klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket?',
            svar: vurderinger.klageKonkret,
            navn: 'klageKonkret',
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: vurderinger.klagefristOverholdt,
            navn: 'klagefristOverholdt',
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: vurderinger.klageSignert,
            navn: 'klageSignert',
        },
    ];

    console.log(redigeringsmodus);
    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
        case Redigeringsmodus.REDIGERING:
            return (
                <EndreFormkravVurderinger
                    settRedigeringsmodus={settRedigeringsmodus}
                    vurderinger={vurderinger}
                    lagreVurderinger={lagreVurderinger}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisFormkravVurderinger
                    settRedigeringsmodus={settRedigeringsmodus}
                    redigerHandling={låsOppFormVilkår}
                    saksbehandlerBegrunnelse={vurderinger.saksbehandlerBegrunnelse}
                    endretTid={vurderinger.endretTid}
                    settFormkravGyldig={settFormkravGyldig}
                    senderInn={senderInn}
                    settSenderInn={settSenderInn}
                    lagreVurderinger={lagreVurderinger}
                    vurderinger={vurderinger}
                />
            );
    }
};
