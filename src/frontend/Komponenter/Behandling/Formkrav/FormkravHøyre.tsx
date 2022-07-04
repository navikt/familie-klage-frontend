import React, { useState } from 'react';
import styled from 'styled-components';
import { Textarea, Radio, RadioGroup, Button } from '@navikt/ds-react';
import { IRadioKnapper, RadioknapperLesemodus } from './RadioKnapperLesemodus';
import { useApp } from '../../../App/context/AppContext';

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

export interface IForm {
    klagePart: string;
    klageKonkret: string;
    klagefristOverholdt: string;
    klageSignert: string;
    saksbehandlerBegrunnelse: string;
}

export enum FormVilkår {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
}

export const formVilkårTilTekst: Record<FormVilkår, string> = {
    OPPFYLT: 'Oppfylt',
    IKKE_OPPFYLT: 'Ikke oppfylt',
};

export const FormkravHøyre: React.FC<IFormKravHøyre> = ({ låst, settLåst }) => {
    const { axiosRequest } = useApp();

    const [saksbehandlerBegrunnelse, settsaksbehandlerBegrunnelse] = useState('');
    const [klagePart, settKlagePart] = useState('');
    const [klageKonkret, settKlageKonkret] = useState('');
    const [klagefristOverholdt, settKlagefrist] = useState('');
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
            svar: klagefristOverholdt,
            setter: settKlagefrist,
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
            svar: saksbehandlerBegrunnelse,
            setter: settsaksbehandlerBegrunnelse,
            key: 4,
        },
    ];

    const alleFeltErBesvart = (): boolean => {
        return !(
            saksbehandlerBegrunnelse === '' ||
            klagePart === '' ||
            klageKonkret === '' ||
            klagefristOverholdt === '' ||
            klageSignert === ''
        );
    };

    const opprettForm = () => {
        if (alleFeltErBesvart()) {
            settLåst(true);
        }

        const f: IForm = {
            klagePart: klagePart,
            klageKonkret: klageKonkret,
            klagefristOverholdt: klagefristOverholdt,
            klageSignert: klageSignert,
            saksbehandlerBegrunnelse: saksbehandlerBegrunnelse,
        };

        axiosRequest<IForm, IForm>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: f,
        });
    };

    return (
        <FormKravStyling>
            {!låst && (
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
                                        <RadioStyled value={FormVilkår.OPPFYLT}>Ja</RadioStyled>
                                        <RadioStyled value={FormVilkår.IKKE_OPPFYLT}>
                                            Nei
                                        </RadioStyled>
                                    </RadioGroupStyled>
                                ))}
                        </RadioKnapperContainer>
                        <Textarea
                            label={undefined}
                            value={saksbehandlerBegrunnelse}
                            onChange={(e) => settsaksbehandlerBegrunnelse(e.target.value)}
                            size="small"
                            description="Vurdering"
                            maxLength={1500}
                        />
                    </FormKravStylingBody>
                    <FormKravStylingFooter>
                        <ButtonStyled variant="primary" size="medium" onClick={opprettForm}>
                            Lagre
                        </ButtonStyled>
                    </FormKravStylingFooter>
                </>
            )}
            {låst && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={settLåst}
                />
            )}
        </FormKravStyling>
    );
};
