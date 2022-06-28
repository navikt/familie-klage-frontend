/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Textarea, Radio, RadioGroup, Button } from '@navikt/ds-react';
import { IRadioKnapper, RadioknapperLesemodus } from './RadioKnapperLesemodus';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 0 5% 0 5%;
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
    margin-top: 2%;
`;

const RadioStyled = styled(Radio)`
    padding: 2%;
`;

const RadioGroupStyled = styled(RadioGroup)`
    padding: 2% 0;
    width: 40%;
`;

export const FormkravHøyre: React.FC = () => {
    const [vurdering, settVurdering] = useState('');
    const [klagePart, settKlagePart] = useState('');
    const [klageKonkret, settKlageKonkret] = useState('');
    const [klageFrist, settKlageFrist] = useState('');
    const [klageSignert, settKlageSignert] = useState('');
    const [leseModus, settLeseModus] = useState(false);
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
            settLeseModus(true);
        }
    };

    return (
        <FormKravStyling>
            {!leseModus && (
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
                        <Button variant="primary" size="medium" onClick={lagreVilkår}>
                            Lagre
                        </Button>
                    </FormKravStylingFooter>
                </>
            )}
            {leseModus && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={settLeseModus}
                />
            )}
        </FormKravStyling>
    );
};
