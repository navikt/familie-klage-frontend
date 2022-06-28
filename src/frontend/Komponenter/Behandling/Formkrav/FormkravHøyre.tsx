/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Textarea, Radio, RadioGroup, Button } from '@navikt/ds-react';
import { IRadioKnapper, RadioknapperLesemodus } from './RadioKnapperLesemodus';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    margin: 0 5rem 0 5rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
`;

const FormKravStylingFooter = styled.div`
    width: 100%;
    display: flex;
    padding: 2% 0%;
`;

const RadioKnapperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioStyled = styled(Radio)``;

const RadioGroupStyled = styled(RadioGroup)`
    padding: 0.1rem 0;
    margin: 0.8rem 0;
    width: 100%;
`;

const ButtonStyled = styled(Button)`
    margin-bottom: 0.5rem;
`;

interface IFormKravHøyre {
    låst: boolean;
    settLåst: (value: boolean) => void;
}

export const FormkravHøyre: React.FC<{ props: IFormKravHøyre }> = ({ props }) => {
    const [vurdering, settVurdering] = useState('');
    const [klagePart, settKlagePart] = useState('');
    const [klageKonkret, settKlageKonkret] = useState('');
    const [klageFrist, settKlageFrist] = useState('');
    const [klageSignert, settKlageSignert] = useState('');
    const radioKnapperLeseListe: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: klagePart,
            setter: settKlagePart,
            key: 0,
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket',
            svar: klageKonkret,
            setter: settKlageKonkret,
            key: 1,
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: klageFrist,
            setter: settKlageFrist,
            key: 2,
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: klageSignert,
            setter: settKlageSignert,
            key: 3,
        },
        {
            spørsmål: 'Begrunnelse',
            svar: vurdering,
            setter: settVurdering,
            key: 4,
        },
    ];

    const lagreVilkår = () => {
        if (
            !(
                vurdering === '' ||
                klagePart === '' ||
                klageKonkret === '' ||
                klageFrist === '' ||
                klageSignert === ''
            )
        ) {
            props.settLåst(true);
        }
    };

    return (
        <FormKravStyling>
            {!props.låst && (
                <>
                    <FormKravStylingBody>
                        <RadioKnapperContainer>
                            {radioKnapperLeseListe
                                .filter((item: IRadioKnapper) => item.spørsmål !== 'Begrunnelse')
                                .map((item: IRadioKnapper) => (
                                    <RadioGroupStyled
                                        legend={item.spørsmål}
                                        size="small"
                                        onChange={(val: any) => item.setter(val)}
                                        value={item.svar}
                                        key={item.key}
                                    >
                                        <RadioStyled value="Ja">Ja</RadioStyled>
                                        <RadioStyled value="Nei">Nei</RadioStyled>
                                    </RadioGroupStyled>
                                ))}
                        </RadioKnapperContainer>
                        <Textarea
                            label={undefined}
                            value={vurdering}
                            onChange={(e) => settVurdering(e.target.value)}
                            size="small"
                            description="Vurdering"
                            maxLength={1500}
                        />
                    </FormKravStylingBody>
                    <FormKravStylingFooter>
                        <ButtonStyled variant="primary" size="medium" onClick={lagreVilkår}>
                            Lagre
                        </ButtonStyled>
                    </FormKravStylingFooter>
                </>
            )}
            {props.låst && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={props.settLåst}
                />
            )}
        </FormKravStyling>
    );
};
