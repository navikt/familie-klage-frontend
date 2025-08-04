import React, { Dispatch, SetStateAction } from 'react';
import { VisFormkravVurderinger } from './VisFormkravVurderinger';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { EndreFormkravVurderinger } from './EndreFormkravVurderinger';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { Fagsystem } from '../../../App/typer/fagsak';
import { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';

export interface IProps {
    vurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    redigeringsmodus: Redigeringsmodus;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    feilmelding: string;
    fagsystemVedtak: FagsystemVedtak[];
    fagsystem: Fagsystem;
    klagebehandlingsresultater: Klagebehandlingsresultat[];
}

export const FormkravVurderinger: React.FC<IProps> = ({
    vurderinger,
    lagreVurderinger,
    redigeringsmodus,
    settRedigeringsmodus,
    settOppdaterteVurderinger,
    feilmelding,
    fagsystemVedtak,
    fagsystem,
    klagebehandlingsresultater: klagebehandlingsresultater,
}) => {
    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
        case Redigeringsmodus.REDIGERING:
            return (
                <EndreFormkravVurderinger
                    fagsystemVedtak={fagsystemVedtak}
                    feilmelding={feilmelding}
                    lagreVurderinger={lagreVurderinger}
                    settOppdaterteVurderinger={settOppdaterteVurderinger}
                    settRedigeringsmodus={settRedigeringsmodus}
                    vurderinger={vurderinger}
                    fagsystem={fagsystem}
                    klagebehandlingsresultater={klagebehandlingsresultater}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisFormkravVurderinger
                    fagsystemVedtak={fagsystemVedtak}
                    lagreVurderinger={lagreVurderinger}
                    settOppdaterteVurderinger={settOppdaterteVurderinger}
                    settRedigeringsmodus={settRedigeringsmodus}
                    vurderinger={vurderinger}
                    klagebehandlingsresultater={klagebehandlingsresultater}
                />
            );
    }
};
