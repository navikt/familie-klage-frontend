import React from 'react';
import { AvsnittMedId, FritekstBrevtype, FrittståendeBrevtype } from './BrevTyper';
import styled from 'styled-components';
import OppKnapp from '../../../Felles/Knapper/OppKnapp';
import NedKnapp from '../../../Felles/Knapper/NedKnapp';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import { FamilieInput } from '@navikt/familie-form-elements';
import { Button, Panel } from '@navikt/ds-react';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import { Delete } from '@navikt/ds-icons';

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

const Overskrift = styled(FamilieInput)`
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
    endreDeloverskriftAvsnitt: (avsnittId: string, deloverskrift: string) => AvsnittMedId[];
    endreInnholdAvsnitt: (avsnittId: string, innhold: string) => AvsnittMedId[];
    fjernAvsnitt: (avsnittId: string) => void;
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
    fjernAvsnitt,
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
            {avsnittSomSkalVises.map((avsnitt, index) => {
                const avsnittId = avsnitt.avsnittId;
                const deloverskriftId = `deloverskrift-${avsnittId}`;
                const innholdId = `innhold-${avsnittId}`;
                const toKolonneId = `toKolonne-${avsnittId}`;
                const knappWrapperId = `knappWrapper-${avsnittId}`;

                return (
                    <ToKolonneLayout id={toKolonneId} key={toKolonneId}>
                        <Innholdsrad key={avsnittId} border>
                            <FamilieInput
                                onChange={(e) => {
                                    endreDeloverskriftAvsnitt(avsnittId, e.target.value);
                                }}
                                label="Deloverskrift (valgfri)"
                                id={deloverskriftId}
                                value={avsnitt.deloverskrift}
                            />
                            <EnsligTextArea
                                onChange={(e) => {
                                    endreInnholdAvsnitt(avsnittId, e.target.value);
                                }}
                                label="Innhold"
                                id={innholdId}
                                value={avsnitt.innhold}
                                maxLength={0}
                                erLesevisning={false}
                            />
                            <Button
                                onClick={() => {
                                    fjernAvsnitt(avsnittId);
                                }}
                                variant={'tertiary'}
                                icon={<Delete />}
                            >
                                Slett avsnitt
                            </Button>
                        </Innholdsrad>
                        <FlyttAvsnittKnappWrapper id={knappWrapperId}>
                            {index > 0 && (
                                <OppKnapp
                                    onClick={() => {
                                        flyttAvsnittOpp(avsnittId);
                                    }}
                                />
                            )}
                            {index + 1 < avsnittSomSkalVises.length && (
                                <NedKnapp
                                    onClick={() => {
                                        flyttAvsnittNed(avsnittId);
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
