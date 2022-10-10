import React, { useEffect, useMemo, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import BrevInnhold from './BrevInnhold';
import styled from 'styled-components';
import {
    AvsnittMedId,
    BrevtyperTilAvsnitt,
    BrevtyperTilOverskrift,
    FritekstBrevtype,
    FrittståendeBrevtype,
    IFritekstBrev,
} from './BrevTyper';
import {
    flyttAvsnittNedover,
    flyttAvsnittOppover,
    initielleAvsnittMellomlager,
    leggAvsnittBakSisteSynligeAvsnitt,
    leggTilAvsnittFørst,
    skjulAvsnittIBrevbygger,
} from './BrevUtils';
import { useApp } from '../../../App/context/AppContext';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { AxiosRequestConfig } from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { VedtakValg } from '../Vurdering/vurderingValg';
import { IFormkravVilkår } from '../Formkrav/typer';
import { alleVilkårOppfylt } from '../Formkrav/utils';

const StyledBrev = styled.div`
    margin-bottom: 1rem;
    width: inherit;
`;

export interface Props {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    mellomlagretFritekstbrev?: IFritekstBrev;
}

const FritekstBrev: React.FC<Props> = ({
    behandlingId,
    mellomlagretFritekstbrev,
    oppdaterBrevressurs,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { axiosRequest } = useApp();

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-klage/api/personopplysninger/${behandlingId}`,
        }),
        [behandlingId]
    );

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    const [brevType, settBrevType] = useState<FritekstBrevtype | undefined>(
        mellomlagretFritekstbrev?.brevType
    );
    const [overskrift, settOverskrift] = useState(
        (mellomlagretFritekstbrev && mellomlagretFritekstbrev?.overskrift) || ''
    );
    const [avsnitt, settAvsnitt] = useState<AvsnittMedId[]>(
        initielleAvsnittMellomlager(mellomlagretFritekstbrev)
    );
    const [senderInn, settSenderInn] = useState<boolean>(false);

    const endreBrevType = (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => {
        settBrevType(nyBrevType as FritekstBrevtype);
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

    const endreDeloverskriftAvsnitt = (radId: string, deloverskrift: string) => {
        const oppdaterteAvsnitt = avsnitt.map((rad) =>
            rad.avsnittId === radId ? { ...rad, deloverskrift } : rad
        );
        settAvsnitt(oppdaterteAvsnitt);
        return oppdaterteAvsnitt;
    };

    const endreInnholdAvsnitt = (avsnittId: string, innhold: string) => {
        const oppdaterteAvsnitt = avsnitt.map((rad) =>
            rad.avsnittId === avsnittId ? { ...rad, innhold } : rad
        );
        settAvsnitt(oppdaterteAvsnitt);
        return oppdaterteAvsnitt;
    };

    const fjernAvsnitt = (avsnittId: string) => {
        settAvsnitt((eksisterendeAvsnitt: AvsnittMedId[]) =>
            eksisterendeAvsnitt.filter((rad) => avsnittId !== rad.avsnittId)
        );
    };

    const genererBrev = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        if (personopplysninger.status !== RessursStatus.SUKSESS) return;
        if (!brevType) return;

        const brev: IFritekstBrev = {
            overskrift: overskrift,
            avsnitt: avsnitt,
            behandlingId: behandlingId,
            brevType: brevType,
        };

        axiosRequest<string, IFritekstBrev>({
            method: 'POST',
            url: `/familie-klage/api/brev/`,
            data: brev,
        }).then((respons: Ressurs<string>) => {
            settSenderInn(false);
            if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
        });
    };

    useEffect(() => {
        axiosRequest<VedtakValg, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}/vedtak`,
        }).then((res: Ressurs<VedtakValg>) => {
            let type: FritekstBrevtype = FritekstBrevtype.VEDTAK_AVSLAG;
            if (res.status === RessursStatus.SUKSESS) {
                const vedtak: VedtakValg = res.data;
                axiosRequest<IFormkravVilkår, null>({
                    method: 'GET',
                    url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
                }).then((res: Ressurs<IFormkravVilkår>) => {
                    if (res.status === RessursStatus.SUKSESS && res.data != null) {
                        if (vedtak === VedtakValg.OMGJØR_VEDTAK && alleVilkårOppfylt(res.data)) {
                            type = FritekstBrevtype.VEDTAK_INVILGELSE;
                        }
                    }
                    endreBrevType(type);
                    settOverskiftOgAvsnitt(type);
                });
            }
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (mellomlagretFritekstbrev) {
            settOverskrift(mellomlagretFritekstbrev.overskrift);
            settAvsnitt(mellomlagretFritekstbrev.avsnitt);
        }
    }, [mellomlagretFritekstbrev]);

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);
    useEffect(utsattGenererBrev, [utsattGenererBrev, avsnitt, overskrift]);

    const settOverskiftOgAvsnitt = (brevType?: FritekstBrevtype) => {
        settOverskrift(brevType ? BrevtyperTilOverskrift[brevType] : '');
        settAvsnitt(brevType ? skjulAvsnittIBrevbygger(BrevtyperTilAvsnitt[brevType]) : []);
    };

    return (
        <StyledBrev>
            <h1>Fritekstbrev</h1>
            {behandlingErRedigerbar && (
                <BrevInnhold
                    brevType={brevType}
                    overskrift={overskrift}
                    endreOverskrift={settOverskrift}
                    avsnitt={avsnitt}
                    endreAvsnitt={settAvsnitt}
                    endreDeloverskriftAvsnitt={endreDeloverskriftAvsnitt}
                    endreInnholdAvsnitt={endreInnholdAvsnitt}
                    fjernAvsnitt={fjernAvsnitt}
                    leggTilAvsnittFørst={oppdaterLeggTilAvsnittFørst}
                    leggAvsnittBakSisteSynligeAvsnitt={oppdaterLeggAvsnittBakSisteSynligeAvsnitt}
                    flyttAvsnittOpp={oppdaterFlyttAvsnittOppover}
                    flyttAvsnittNed={oppdaterFlyttAvsnittNedover}
                />
            )}
        </StyledBrev>
    );
};

export default FritekstBrev;
