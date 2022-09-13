import React from 'react';
import { VisFormkravVurderinger } from './VisFormkravVurderinger';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { EndreFormkravVurderinger } from './EndreFormkravVurderinger';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';

export interface IProps {
    vurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    redigeringsmodus: Redigeringsmodus;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
}

export const VisEllerEndreFormkravVurderinger: React.FC<IProps> = ({
    vurderinger,
    lagreVurderinger,
    redigeringsmodus,
    settRedigeringsmodus,
}) => {
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
                    saksbehandlerBegrunnelse={vurderinger.saksbehandlerBegrunnelse}
                    endretTid={vurderinger.endretTid}
                    lagreVurderinger={lagreVurderinger}
                    vurderinger={vurderinger}
                />
            );
    }
};
