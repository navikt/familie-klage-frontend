import React, { ChangeEventHandler } from 'react';
import {
    AvsnittMedId,
    BrevtyperTilAvsnitt,
    BrevtyperTilOverskrift,
    BrevtyperTilSelectNavn,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
    stønadstypeTilBrevtyper,
} from './BrevTyper';
import { BehandlingsÅrsak } from '../../../App/typer/Behandlingsårsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import styled from 'styled-components';
import { Input, Select, Textarea } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import { skjulAvsnittIBrevbygger } from './BrevUtils';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import OppKnapp from '../../../Felles/Knapper/OppKnapp';
import NedKnapp from '../../../Felles/Knapper/NedKnapp';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';

const StyledSelect = styled(Select)`
    margin-top: 1rem;
`;

const Innholdsrad = styled(Panel)`
    width: 95%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ToKolonneLayout = styled.div`
    display: flex;
`;

const Overskrift = styled(Input)`
    margin-top: 1rem;
`;

const LeggTilKnappWrapper = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-start;
`;

const BrevKolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

const FlyttAvsnittKnappWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 0.5rem;
    margin-top: 1rem;
`;

export interface IBrevInnhold {
    brevType: FrittståendeBrevtype | FritekstBrevtype | undefined;
    endreBrevType: (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => void;
    overskrift: string;
    endreOverskrift: (nyOverskrift: string) => void;
    avsnitt: AvsnittMedId[];
    endreAvsnitt: (avsnitt: AvsnittMedId[]) => void;
    endreDeloverskriftAvsnitt: (radId: string) => ChangeEventHandler<HTMLInputElement>;
    endreInnholdAvsnitt: (radId: string) => ChangeEventHandler<HTMLTextAreaElement>;
    fjernRad: (radId: string) => void;
    leggTilAvsnittFørst: () => void;
    leggAvsnittBakSisteSynligeAvsnitt: () => void;
    flyttAvsnittOpp: (avsnittId: string) => void;
    flyttAvsnittNed: (avsnittId: string) => void;
    context: FritekstBrevContext;
    behandlingsårsak: BehandlingsÅrsak;
    stønadstype: Stønadstype;
}

const BrevInnhold: React.FC<IBrevInnhold> = ({
    brevType,
    endreBrevType,
    overskrift,
    endreOverskrift,
    avsnitt,
    endreAvsnitt,
    endreDeloverskriftAvsnitt,
    endreInnholdAvsnitt,
    fjernRad,
    leggTilAvsnittFørst,
    leggAvsnittBakSisteSynligeAvsnitt,
    flyttAvsnittOpp,
    flyttAvsnittNed,
    context,
    behandlingsårsak,
    stønadstype,
}) => {
    const brevtyper = stønadstypeTilBrevtyper[stønadstype];
    const ikkeRedigerBareBrev: (FrittståendeBrevtype | FritekstBrevtype | undefined)[] = [
        FrittståendeBrevtype.VARSEL_OM_AKTIVITETSPLIKT,
    ];
    const finnesSynligeAvsnitt = avsnitt.some((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);
    const brevSkalKunneRedigeres = !ikkeRedigerBareBrev.includes(brevType);
    const avsnittSomSkalVises = avsnitt.filter((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);

    return (
        <BrevKolonner>
            <StyledSelect
                label="Brevtype"
                onChange={(e) => {
                    const nyBrevType = e.target.value as FrittståendeBrevtype | FritekstBrevtype;
                    endreBrevType(nyBrevType);
                    endreOverskrift(nyBrevType ? BrevtyperTilOverskrift[nyBrevType] : '');
                    endreAvsnitt(
                        nyBrevType ? skjulAvsnittIBrevbygger(BrevtyperTilAvsnitt[nyBrevType]) : []
                    );
                }}
                value={brevType}
            >
                <option value={''}>Ikke valgt</option>
                {Object.values(
                    context === FritekstBrevContext.FRITTSTÅENDE ? FrittståendeBrevtype : brevtyper
                )
                    .filter(
                        (type: FrittståendeBrevtype | FritekstBrevtype) =>
                            type !== FritekstBrevtype.SANKSJON ||
                            behandlingsårsak === BehandlingsÅrsak.SANKSJON_1_MND
                    )
                    .map((type: FrittståendeBrevtype | FritekstBrevtype) => (
                        <option value={type} key={type}>
                            {
                                BrevtyperTilSelectNavn[
                                    type as FrittståendeBrevtype | FritekstBrevtype
                                ]
                            }
                        </option>
                    ))}
            </StyledSelect>
            {brevType && (
                <>
                    {brevSkalKunneRedigeres && (
                        <Overskrift
                            label="Overskrift"
                            value={overskrift}
                            onChange={(e) => {
                                endreOverskrift(e.target.value);
                            }}
                        />
                    )}
                    {finnesSynligeAvsnitt && brevSkalKunneRedigeres && (
                        <LeggTilKnappWrapper>
                            <LeggTilKnapp
                                onClick={leggTilAvsnittFørst}
                                knappetekst="Legg til avsnitt"
                            />
                        </LeggTilKnappWrapper>
                    )}
                    {avsnittSomSkalVises.map((rad, index) => {
                        const deloverskriftId = `deloverskrift-${rad.avsnittId}`;
                        const innholdId = `innhold-${rad.avsnittId}`;
                        const toKolonneId = `toKolonne-${rad.avsnittId}`;
                        const knappWrapperId = `knappWrapper-${rad.avsnittId}`;

                        return (
                            <ToKolonneLayout id={toKolonneId}>
                                <Innholdsrad key={rad.avsnittId} border>
                                    <Input
                                        onChange={endreDeloverskriftAvsnitt(rad.avsnittId)}
                                        label="Deloverskrift (valgfri)"
                                        id={deloverskriftId}
                                        value={rad.deloverskrift}
                                    />
                                    <Textarea
                                        onChange={endreInnholdAvsnitt(rad.avsnittId)}
                                        label="Innhold"
                                        id={innholdId}
                                        value={rad.innhold}
                                        maxLength={0}
                                    />
                                    <LenkeKnapp onClick={() => fjernRad(rad.avsnittId)}>
                                        <SlettSøppelkasse withDefaultStroke={false} />
                                        Slett avsnitt
                                    </LenkeKnapp>
                                </Innholdsrad>
                                <FlyttAvsnittKnappWrapper id={knappWrapperId}>
                                    {index > 0 && (
                                        <OppKnapp
                                            onClick={() => {
                                                flyttAvsnittOpp(rad.avsnittId);
                                            }}
                                        />
                                    )}
                                    {index + 1 < avsnittSomSkalVises.length && (
                                        <NedKnapp
                                            onClick={() => {
                                                flyttAvsnittNed(rad.avsnittId);
                                            }}
                                        />
                                    )}
                                </FlyttAvsnittKnappWrapper>
                            </ToKolonneLayout>
                        );
                    })}
                    {brevSkalKunneRedigeres && (
                        <LeggTilKnappWrapper>
                            <LeggTilKnapp
                                onClick={leggAvsnittBakSisteSynligeAvsnitt}
                                knappetekst="Legg til avsnitt"
                            />
                        </LeggTilKnappWrapper>
                    )}
                </>
            )}
        </BrevKolonner>
    );
};

export default BrevInnhold;
