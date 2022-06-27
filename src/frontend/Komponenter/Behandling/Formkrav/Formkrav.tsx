/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';
import {
    Heading,
    Alert,
    Detail,
    Textarea,
    Select,
    Radio,
    RadioGroup,
    Button,
} from '@navikt/ds-react';

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
    display: flex;
    padding-left: 5%;
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

const AlertStyled = styled(Alert)`
    width: 100%;
`;
const RadioGroupStyled = styled(RadioGroup)`
    padding: 2% 5%% 0 0;
    width: 40%;
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
                <Heading spacing size="medium" level="4">
                    Vurder formkrav
                </Heading>
                <>
                    <Detail size="small">FVI 99 28, 31, 32, 33 og ftrl 9 21-12</Detail>
                </>
                <AlertStyled variant="warning" size="medium" fullWidth>
                    Vurder om klagen oppfyller formkravene.
                </AlertStyled>
            </FormKravStylingHeader>
            <FormKravStylingBody>
                <FormKravStylingVenstre>
                    <Textarea
                        label={undefined}
                        value={vurdering}
                        onChange={(e) => settVurdering(e.target.value)}
                        size="small"
                        description="Vurdering"
                        maxLength={1500}
                    />
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
            <FormKravStylingFooter>
                <Button variant="primary" size="medium">
                    Bekreft og fortsett
                </Button>
            </FormKravStylingFooter>
        </FormKravStyling>
    );
};
