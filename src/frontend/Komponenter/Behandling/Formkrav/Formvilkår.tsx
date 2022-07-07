import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { RadioknapperLesemodus } from './RadioKnapperLesemodus';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IForm, IFormvilkår, IRadioKnapper, VilkårStatus, vilkårStatusTilTekst } from './utils';

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

export const Formvilkår: React.FC<IFormvilkår> = ({
    behandlingId,
    vilkårOppfylt,
    settVilkårOppfylt,
    låst,
    settLåst,
}) => {
    const { vilkårTom, settVilkårTom } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const [saksbehandlerBegrunnelse, settsaksbehandlerBegrunnelse] = useState('');

    const formObjekt: IForm = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksdato: '',
        klageMottatt: '',
        klageÅrsak: '',
        klageBeskrivelse: '',
        klagePart: VilkårStatus.IKKE_SATT,
        klageKonkret: VilkårStatus.IKKE_SATT,
        klagefristOverholdt: VilkårStatus.IKKE_SATT,
        klageSignert: VilkårStatus.IKKE_SATT,
        saksbehandlerBegrunnelse: '',
        sakSistEndret: '',
    };

    const [formData, settFormData] = useState<IForm>(formObjekt);
    const radioKnapperLeseListe: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: formData.klagePart,
            navn: 'klagePart',
            key: 0,
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket',
            svar: formData.klageKonkret,
            navn: 'klageKonkret',
            key: 1,
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: formData.klagefristOverholdt,
            navn: 'klagefristOverholdt',
            key: 2,
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: formData.klageSignert,
            navn: 'klageSignert',
            key: 3,
        },
    ];

    useEffect(() => {
        if (låst) {
            axiosRequest<IForm, null>({
                method: 'GET',
                url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
            }).then((res: Ressurs<IForm>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFormData((prevState) => ({
                        ...prevState,
                        fagsakId: res.data.fagsakId,
                        klageMottatt: res.data.klageMottatt,
                        klageÅrsak: res.data.klageÅrsak,
                        klageBeskrivelse: res.data.klageBeskrivelse,
                        klagePart: res.data.klagePart,
                        klageKonkret: res.data.klageKonkret,
                        klagefristOverholdt: res.data.klagefristOverholdt,
                        klageSignert: res.data.klageSignert,
                        saksbehandlerBegrunnelse: res.data.saksbehandlerBegrunnelse,
                        vedtaksdato: res.data.vedtaksdato,
                    }));
                }
            });
        }
        if (vilkårTom) {
            settFormData((prevState) => ({
                ...prevState,
                klagePart: VilkårStatus.IKKE_SATT,
                klageKonkret: VilkårStatus.IKKE_SATT,
                klagefristOverholdt: VilkårStatus.IKKE_SATT,
                klageSignert: VilkårStatus.IKKE_SATT,
            }));
            settsaksbehandlerBegrunnelse('');
            settVilkårTom(false);
            settVilkårOppfylt(false);
        }
    }, [låst, vilkårTom, axiosRequest, behandlingId, settVilkårTom, settVilkårOppfylt]);

    const alleFeltErBesvart = (): boolean => {
        return !(
            saksbehandlerBegrunnelse === '' ||
            formData.klagePart === VilkårStatus.IKKE_SATT ||
            formData.klageKonkret === VilkårStatus.IKKE_SATT ||
            formData.klagefristOverholdt === VilkårStatus.IKKE_SATT ||
            formData.klageSignert === VilkårStatus.IKKE_SATT
        );
    };

    const opprettForm = () => {
        if (alleFeltErBesvart()) {
            settVilkårOppfylt(true);
        } else {
            settLåst(true);
        }

        axiosRequest<IForm, IForm>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: formData,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
            }
        });
    };

    return (
        <FormKravStyling>
            {!vilkårOppfylt && !låst && (
                <>
                    <FormKravStylingBody>
                        <RadioKnapperContainer>
                            {radioKnapperLeseListe
                                .filter((item: IRadioKnapper) => item.spørsmål !== 'Begrunnelse')
                                .map((item: IRadioKnapper) => (
                                    <RadioGroupStyled
                                        legend={item.spørsmål}
                                        size="small"
                                        onChange={(val: VilkårStatus) => {
                                            console.log(item.svar);
                                            console.log(val);
                                            settFormData((prevState) => ({
                                                ...prevState,
                                                [item.navn]: val,
                                            }));
                                            settIkkePersistertKomponent(val);
                                        }}
                                        value={item.svar}
                                        key={item.key}
                                    >
                                        <RadioStyled value={VilkårStatus.OPPFYLT}>Ja</RadioStyled>
                                        <RadioStyled value={VilkårStatus.IKKE_OPPFYLT}>
                                            Nei
                                        </RadioStyled>
                                    </RadioGroupStyled>
                                ))}
                        </RadioKnapperContainer>
                        <Textarea
                            label={undefined}
                            value={saksbehandlerBegrunnelse}
                            onChange={(e) => {
                                settsaksbehandlerBegrunnelse(e.target.value);
                                settIkkePersistertKomponent(e.target.value);
                            }}
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
            {vilkårOppfylt && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={settVilkårOppfylt}
                    saksbehandlerBegrunnelse={saksbehandlerBegrunnelse}
                />
            )}
            {låst && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={settLåst}
                    saksbehandlerBegrunnelse={saksbehandlerBegrunnelse}
                />
            )}
        </FormKravStyling>
    );
};
