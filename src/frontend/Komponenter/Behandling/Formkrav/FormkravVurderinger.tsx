import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { Fagsystem } from '../../../App/typer/fagsak';
import type { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import type { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';
import type { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import { EndreFormkravVurderinger } from './EndreFormkravVurderinger';
import type { IFormkravVilkår } from './typer';
import { Redigeringsmodus } from './typer';
import { VisFormkravVurderinger } from './VisFormkravVurderinger';

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
    klagebehandlingsresultater,
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
                    fagsystem={fagsystem}
                />
            );
    }
};
