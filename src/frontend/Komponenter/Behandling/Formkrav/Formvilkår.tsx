import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { RadioknapperLesemodus } from './RadioKnapperLesemodus';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormVilkår, IFormvilkårKomponent, IRadioKnapper, VilkårStatus } from './utils';

const VilkårStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    margin: 0.5rem 1rem 1 rem 1rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
    margin: 0.5rem 1rem 1 rem 1rem;
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

const RadioGroupStyled = styled(RadioGroup)`
    padding: 0.1rem 0;
    margin: 0.8rem 0;
    width: 100%;
`;

const ButtonStyled = styled(Button)`
    margin-bottom: 0.5rem;
`;

export const Formvilkår: React.FC<IFormvilkårKomponent> = ({
    behandlingId,
    vilkårOppfylt,
    settFormkravGyldig,
    låst,
    settLåst,
}) => {
    const { vilkårTom, settVilkårTom } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const dateString = new Date().toISOString().split('T')[0];
    const formObjekt: IFormVilkår = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        klagePart: VilkårStatus.IKKE_SATT,
        klageKonkret: VilkårStatus.IKKE_SATT,
        klagefristOverholdt: VilkårStatus.IKKE_SATT,
        klageSignert: VilkårStatus.IKKE_SATT,
        saksbehandlerBegrunnelse: '',
        sakSistEndret: dateString,
    };

    const [formData, settFormData] = useState<IFormVilkår>(formObjekt);
    const radioKnapperLeseListe: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: formData.klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket',
            svar: formData.klageKonkret,
            navn: 'klageKonkret',
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: formData.klagefristOverholdt,
            navn: 'klagefristOverholdt',
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: formData.klageSignert,
            navn: 'klageSignert',
        },
    ];

    useEffect(() => {
        if (låst) {
            axiosRequest<IFormVilkår, null>({
                method: 'GET',
                url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
            }).then((res: Ressurs<IFormVilkår>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFormData((prevState) => ({
                        ...prevState,
                        fagsakId: res.data.fagsakId,
                        klagePart: res.data.klagePart,
                        klageKonkret: res.data.klageKonkret,
                        klagefristOverholdt: res.data.klagefristOverholdt,
                        klageSignert: res.data.klageSignert,
                        saksbehandlerBegrunnelse: res.data.saksbehandlerBegrunnelse,
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
                saksbehandlerBegrunnelse: '',
            }));
            settVilkårTom(false);
            settFormkravGyldig(false);
        }
    }, [låst, vilkårTom, axiosRequest, behandlingId, settVilkårTom, settFormkravGyldig]);

    const vilkårErGyldig = (): boolean => {
        const svarListe = [
            formData.klagePart,
            formData.klageSignert,
            formData.klageKonkret,
            formData.klagefristOverholdt,
        ];
        return (
            (svarListe.includes(VilkårStatus.SKAL_IKKE_VURDERES) &&
                svarListe.includes(VilkårStatus.IKKE_OPPFYLT) &&
                !svarListe.includes(VilkårStatus.IKKE_SATT)) ||
            (!svarListe.includes(VilkårStatus.SKAL_IKKE_VURDERES) &&
                !svarListe.includes(VilkårStatus.IKKE_SATT))
        );
    };

    const opprettForm = () => {
        if (vilkårErGyldig()) {
            settFormkravGyldig(true);
            settLåst(true);
        } else {
            settLåst(true);
        }

        axiosRequest<IFormVilkår, IFormVilkår>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: formData,
        }).then((res: Ressurs<IFormVilkår>) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
            }
        });
    };

    const låsOppFormVilkår = (val: boolean) => {
        settFormkravGyldig(val);
        settLåst(val);
    };

    return (
        <VilkårStyling>
            {!vilkårOppfylt && !låst && (
                <>
                    <FormKravStylingBody>
                        <RadioKnapperContainer>
                            {radioKnapperLeseListe.map((item: IRadioKnapper, index) => (
                                <RadioGroupStyled
                                    legend={item.spørsmål}
                                    size="small"
                                    onChange={(val: VilkårStatus) => {
                                        settFormData((prevState) => ({
                                            ...prevState,
                                            [item.navn]: val,
                                        }));
                                        settIkkePersistertKomponent(val);
                                    }}
                                    value={item.svar}
                                    key={index}
                                >
                                    <Radio value={VilkårStatus.OPPFYLT}>Ja</Radio>
                                    <Radio value={VilkårStatus.IKKE_OPPFYLT}>Nei</Radio>
                                    <Radio value={VilkårStatus.SKAL_IKKE_VURDERES}>
                                        Skal ikke vurderes
                                    </Radio>
                                </RadioGroupStyled>
                            ))}
                        </RadioKnapperContainer>
                        <Textarea
                            label={undefined}
                            value={formData.saksbehandlerBegrunnelse}
                            onChange={(e) => {
                                settIkkePersistertKomponent(e.target.value);
                                settFormData((prevState) => ({
                                    ...prevState,
                                    saksbehandlerBegrunnelse: e.target.value,
                                }));
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
                    redigerHandling={låsOppFormVilkår}
                    saksbehandlerBegrunnelse={formData.saksbehandlerBegrunnelse}
                />
            )}
            {låst && !vilkårOppfylt && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={låsOppFormVilkår}
                    saksbehandlerBegrunnelse={formData.saksbehandlerBegrunnelse}
                />
            )}
        </VilkårStyling>
    );
};
