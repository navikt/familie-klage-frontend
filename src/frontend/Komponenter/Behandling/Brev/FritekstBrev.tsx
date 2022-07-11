import React, { ChangeEvent, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs } from '../../../App/typer/ressurs';

import DataViewer from '../../../Felles/DataViewer/DataViewer';
import BrevInnhold from './BrevInnhold';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import styled from 'styled-components';
import {
    AvsnittMedId,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
} from './BrevTyper';
import {
    flyttAvsnittNedover,
    flyttAvsnittOppover,
    leggAvsnittBakSisteSynligeAvsnitt,
    leggTilAvsnittFørst,
} from './BrevUtils';

const StyledBrev = styled.div`
    margin-bottom: 10rem;
    width: inherit;
`;

export interface IFritekstBrev {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
}

const FritekstBrev: React.FC<IFritekstBrev> = ({ oppdaterBrevressurs, behandlingId }) => {
    const { behandling } = useBehandling();

    const [brevType, settBrevType] = useState<FritekstBrevtype>(FritekstBrevtype.SANKSJON);
    const [overskrift, settOverskrift] = useState('');
    const [avsnitt, settAvsnitt] = useState<AvsnittMedId[]>([
        {
            deloverskrift: '',
            innhold: '',
            skalSkjulesIBrevbygger: false,
            id: '',
        },
    ]);

    const endreBrevType = (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => {
        settBrevType(nyBrevType as FritekstBrevtype);
    };

    const endreOverskrift = (nyOverskrift: string) => {
        settOverskrift(nyOverskrift);
    };

    const endreAvsnitt = (nyttAvsnitt: AvsnittMedId[]) => {
        settAvsnitt(nyttAvsnitt);
    };

    const oppdaterFlyttAvsnittOppover = (avsnittId: string) => {
        settAvsnitt(flyttAvsnittOppover(avsnittId, avsnitt));
    };

    const oppdaterFlyttAvsnittNedover = (avsnittId: string) => {
        settAvsnitt(flyttAvsnittNedover(avsnittId, avsnitt));
    };

    const oppdaterLeggTilAvsnittFørst = () => {
        settAvsnitt(leggTilAvsnittFørst(avsnitt));
    };

    const oppdaterLeggAvsnittBakSisteSynligeAvsnitt = () => {
        settAvsnitt(leggAvsnittBakSisteSynligeAvsnitt(avsnitt));
    };

    const endreDeloverskriftAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, deloverskrift: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const endreInnholdAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLTextAreaElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, innhold: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const fjernRad = (radId: string) => {
        settAvsnitt((eksisterendeAvsnitt: AvsnittMedId[]) => {
            return eksisterendeAvsnitt.filter((rad) => radId !== rad.id);
        });
    };

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <StyledBrev>
                    <h1>Fritekstbrev for {stønadstypeTilTekst[behandling.stønadstype]}</h1>
                    <BrevInnhold
                        brevType={brevType}
                        endreBrevType={endreBrevType}
                        overskrift={overskrift}
                        endreOverskrift={endreOverskrift}
                        avsnitt={avsnitt}
                        endreAvsnitt={endreAvsnitt}
                        endreDeloverskriftAvsnitt={endreDeloverskriftAvsnitt}
                        endreInnholdAvsnitt={endreInnholdAvsnitt}
                        fjernRad={fjernRad}
                        leggTilAvsnittFørst={oppdaterLeggTilAvsnittFørst}
                        leggAvsnittBakSisteSynligeAvsnitt={
                            oppdaterLeggAvsnittBakSisteSynligeAvsnitt
                        }
                        flyttAvsnittOpp={oppdaterFlyttAvsnittOppover}
                        flyttAvsnittNed={oppdaterFlyttAvsnittNedover}
                        context={FritekstBrevContext.BEHANDLING}
                        behandlingsårsak={behandling.behandlingsårsak}
                        stønadstype={Stønadstype.BARNETILSYN}
                    />
                </StyledBrev>
            )}
        </DataViewer>
    );
};

export default FritekstBrev;
