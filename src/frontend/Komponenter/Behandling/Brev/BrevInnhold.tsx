import React, { ChangeEventHandler } from 'react';
import { AvsnittMedId, FritekstBrevtype, FrittståendeBrevtype } from './BrevTyper';
import styled from 'styled-components';
import { Input, Textarea } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import OppKnapp from '../../../Felles/Knapper/OppKnapp';
import NedKnapp from '../../../Felles/Knapper/NedKnapp';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';

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
}

const BrevInnhold: React.FC<IBrevInnhold> = ({
    brevType,
    overskrift,
    endreOverskrift,
    avsnitt,
    endreDeloverskriftAvsnitt,
    endreInnholdAvsnitt,
    fjernRad,
    leggTilAvsnittFørst,
    leggAvsnittBakSisteSynligeAvsnitt,
    flyttAvsnittOpp,
    flyttAvsnittNed,
}) => {
    const ikkeRedigerBareBrev: (FrittståendeBrevtype | FritekstBrevtype | undefined)[] = [
        FrittståendeBrevtype.VARSEL_OM_AKTIVITETSPLIKT,
    ];
    const finnesSynligeAvsnitt = avsnitt.some((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);
    const brevSkalKunneRedigeres = !ikkeRedigerBareBrev.includes(brevType);
    const avsnittSomSkalVises = avsnitt.filter((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);

    return (
        <BrevKolonner>
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
                    <LeggTilKnapp onClick={leggTilAvsnittFørst} knappetekst="Legg til avsnitt" />
                </LeggTilKnappWrapper>
            )}
            {avsnittSomSkalVises.map((rad, index) => {
                const deloverskriftId = `deloverskrift-${rad.id}`;
                const innholdId = `innhold-${rad.id}`;
                const toKolonneId = `toKolonne-${rad.id}`;
                const knappWrapperId = `knappWrapper-${rad.id}`;

                return (
                    <ToKolonneLayout id={toKolonneId}>
                        <Innholdsrad key={rad.id} border>
                            <Input
                                onChange={endreDeloverskriftAvsnitt(rad.id)}
                                label="Deloverskrift (valgfri)"
                                id={deloverskriftId}
                                value={rad.deloverskrift}
                            />
                            <Textarea
                                onChange={endreInnholdAvsnitt(rad.id)}
                                label="Innhold"
                                id={innholdId}
                                value={rad.innhold}
                                maxLength={0}
                            />
                            <LenkeKnapp onClick={() => fjernRad(rad.id)}>
                                <SlettSøppelkasse withDefaultStroke={false} />
                                Slett avsnitt
                            </LenkeKnapp>
                        </Innholdsrad>
                        <FlyttAvsnittKnappWrapper id={knappWrapperId}>
                            {index > 0 && (
                                <OppKnapp
                                    onClick={() => {
                                        flyttAvsnittOpp(rad.id);
                                    }}
                                />
                            )}
                            {index + 1 < avsnittSomSkalVises.length && (
                                <NedKnapp
                                    onClick={() => {
                                        flyttAvsnittNed(rad.id);
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
        </BrevKolonner>
    );
};
export default BrevInnhold;
