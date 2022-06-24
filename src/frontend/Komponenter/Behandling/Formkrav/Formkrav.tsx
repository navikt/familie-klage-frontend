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

export const Formkrav: React.FC = () => {
    const [value, setValue] = useState('');
    const [klagePart, setKlagePart] = useState('');

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
        padding: 2% 5% 5% 5%;
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

    const TextareaStyled = styled(Textarea)``;

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
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        size="small"
                        description="Vurdering"
                        maxLength={1500}
                    />
                </FormKravStylingVenstre>
                <FormKravStylingHøyre>
                    <Select size="small" description="Vedtaket som er påklagd">
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
                                onChange={(val: any) => setKlagePart('')}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="10">Ja</RadioStyled>
                                    <RadioStyled value="20">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                            <RadioGroupStyled
                                legend="Klages det på konkrete elementer i vedtaket?"
                                size="small"
                                onChange={(val: any) => setKlagePart('')}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="10">Ja</RadioStyled>
                                    <RadioStyled value="20">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                        </RadioKnapperRadContainer>
                        <RadioKnapperRadContainer>
                            <RadioGroupStyled
                                legend="Er klagefristen overholdt?"
                                size="small"
                                onChange={(val: any) => setKlagePart('')}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="10">Ja</RadioStyled>
                                    <RadioStyled value="20">Nei</RadioStyled>
                                </RadioGroupKnapperContainer>
                            </RadioGroupStyled>
                            <RadioGroupStyled
                                legend="Er klagen signert?"
                                size="small"
                                onChange={(val: any) => setKlagePart('')}
                            >
                                <RadioGroupKnapperContainer>
                                    <RadioStyled value="10">Ja</RadioStyled>
                                    <RadioStyled value="20">Nei</RadioStyled>
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
