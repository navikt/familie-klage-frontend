/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Heading, Detail, Select, Radio, RadioGroup, BodyLong } from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import navFarger from 'nav-frontend-core';
import IkkeVurdert from '../../../Felles/Ikoner/IkkeVurdert';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 0 5% 0 5%;
`;

const FormKravStylingHeader = styled.div`
    width: 100%;
    display: flex;
    padding: 5% 5% 0 5%;
    flex-direction: column;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
`;

const FormKravStylingFooter = styled.div`
    width: 100%;
    padding-left: 5%;
    display: flex;
`;

const FormKravStylingVenstre = styled.div`
    width: 50%;
    padding: 2% 5% 5% 5%;
`;

const FormKravStylingHøyre = styled.div`
    width: 50%;
    padding: 2% 5% 2% 5%;
`;

const RadioKnapperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioKnapperRadContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 2%;
`;

const RadioGroupKnapperContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-right: 2%;
`;

const RadioStyled = styled(Radio)`
    padding: 2%;
`;

const IkkeVurdertContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;
const RadioGroupStyled = styled(RadioGroup)`
    padding: 2% 5%% 0 0;
    width: 40%;
`;

const IkonTekstContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1%;
`;

const IkkeVurdertIkonStyled = styled(IkkeVurdert)`
    margin-right: 0.5rem;
`;

const DetailTekstStyled = styled(Detail)`
    padding-left: 2%;
`;

const DetailTekstStyledInfo = styled(Detail)`
    margin-left: auto;
    margin-right: 0;
`;

const BlåStrek = styled.div`
    border-left: solid 2px ${navFarger.navBlaLighten60};
    margin-left: 0.5rem;
    margin-right: 0.5rem;
`;

const BegrunnelseContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 0.7rem;
`;

export const Formkrav: React.FC = () => {
    const [vurdering, settVurdering] = useState('');
    const [klagePart, settKlagePart] = useState();
    const [klageKonkret, settKlageKonkret] = useState();
    const [klageFrist, settKlageFrist] = useState();
    const [klageSignert, settKlageSignert] = useState();

    return (
        <FormKravStyling>
            <FormKravStylingHeader>
                <IkkeVurdertContainer>
                    <IkkeVurdertIkonStyled heigth={23} width={23} />
                    <Heading spacing size="small" level="5">
                        Formkrav
                    </Heading>
                </IkkeVurdertContainer>
            </FormKravStylingHeader>
            <FormKravStylingBody>
                <FormKravStylingVenstre>
                    <>
                        <IkonTekstContainer>
                            <FileContent></FileContent>
                            <DetailTekstStyled size="small">Oppgitt vedtaksdato</DetailTekstStyled>
                            <DetailTekstStyledInfo size="small">17.06.2022</DetailTekstStyledInfo>
                        </IkonTekstContainer>
                        <IkonTekstContainer>
                            <FileContent></FileContent>
                            <DetailTekstStyled size="small">Klage mottatt</DetailTekstStyled>
                            <DetailTekstStyledInfo size="small">27.06.2022</DetailTekstStyledInfo>
                        </IkonTekstContainer>
                        <IkonTekstContainer>
                            <FileContent></FileContent>
                            <DetailTekstStyled size="small">Hva er du uenig i?</DetailTekstStyled>
                            <DetailTekstStyledInfo size="small">
                                Jeg har fått for lite utbetalt
                            </DetailTekstStyledInfo>
                        </IkonTekstContainer>
                        <IkonTekstContainer>
                            <FileContent></FileContent>
                            <DetailTekstStyled size="small">Hvorfor er du uenig?</DetailTekstStyled>
                        </IkonTekstContainer>
                        <BegrunnelseContainer>
                            <BlåStrek />
                            <BodyLong size="small">
                                Ullamco ut laboris irure excepteur velit nisi occaecat proident.
                                Amet aliquip dolor eu occaecat. Elit sunt occaecat excepteur ea.
                                Quis commodo adipisicing laborum minim. Culpa duis occaecat
                                adipisicing dolor sint cillum. Non in consequat ex esse exercitation
                                cillum Lorem voluptate officia.
                            </BodyLong>
                        </BegrunnelseContainer>
                    </>
                </FormKravStylingVenstre>
                <FormKravStylingHøyre>
                    <Select size="small" description="Vedtaket som er påklagd" label={undefined}>
                        <option value="">Velg vedtak</option>
                        <option value="norge">Norge</option>
                        <option value="sverige">Sverige</option>
                        <option value="danmark">Danmark</option>
                    </Select>
                    <RadioKnapperContainer>
                        <RadioKnapperRadContainer>
                            <RadioGroupStyled
                                legend="Er klager part i saken?"
                                size="small"
                                onChange={(val: any) => settKlagePart(val)}
                                value={klagePart}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="Ja">Ja</RadioStyled>
                                    <RadioStyled value="Nei">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                            <RadioGroupStyled
                                legend="Klages det på konkrete elementer i vedtaket?"
                                size="small"
                                onChange={(val: any) => settKlageKonkret(val)}
                                value={klageKonkret}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="Ja">Ja</RadioStyled>
                                    <RadioStyled value="Nei">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                        </RadioKnapperRadContainer>
                        <RadioKnapperRadContainer>
                            <RadioGroupStyled
                                legend="Er klagefristen overholdt?"
                                size="small"
                                onChange={(val: any) => settKlageFrist(val)}
                                value={klageFrist}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="Ja">Ja</RadioStyled>
                                    <RadioStyled value="Nei">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                            <RadioGroupStyled
                                legend="Er klagen signert?"
                                size="small"
                                onChange={(val: any) => settKlageSignert(val)}
                                value={klageSignert}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="Ja">Ja</RadioStyled>
                                    <RadioStyled value="Nei">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                        </RadioKnapperRadContainer>
                    </RadioKnapperContainer>
                </FormKravStylingHøyre>
            </FormKravStylingBody>
            <FormKravStylingFooter></FormKravStylingFooter>
        </FormKravStyling>
    );
};
