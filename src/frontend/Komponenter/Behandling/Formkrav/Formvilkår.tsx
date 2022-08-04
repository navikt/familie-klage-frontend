import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
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
    margin: 0.5rem 1rem 1rem 1rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
    margin: 0rem 1rem 1rem 1rem;
`;

const RadioKnapperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioGroupStyled = styled(RadioGroup)`
    padding: 0.1rem 0;
    margin: 0.5rem 0;
    width: 100%;
`;

const ButtonStyled = styled(Button)`
    margin-right: auto;
`;

const AlertStyled = styled(Alert)`
    margin: 1rem;
    width: 100%;
`;

export const Formvilkår: React.FC<IFormvilkårKomponent> = ({
    settFormkravGyldig,
    låst,
    settLåst,
    formData,
    settFormkravBesvart,
    settFormVilkårData,
}) => {
    const { visAdvarselFormkrav, settVisAdvarselFormkrav, hentBehandling } = useBehandling();

    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const vilkårErGyldig = (): boolean => {
        const svarListe = [
            formData.klagePart,
            formData.klageSignert,
            formData.klageKonkret,
            formData.klagefristOverholdt,
        ];
        return (
            svarListe.filter((svar) => svar !== 'OPPFYLT').length === 0 &&
            formData.saksbehandlerBegrunnelse.length !== 0
        );
    };

    const vilkårErBesvart = (): boolean => {
        const svarListe = [
            formData.klagePart,
            formData.klageSignert,
            formData.klageKonkret,
            formData.klagefristOverholdt,
        ];
        return (
            ((svarListe.includes(VilkårStatus.SKAL_IKKE_VURDERES) &&
                svarListe.includes(VilkårStatus.IKKE_OPPFYLT)) ||
                !svarListe.includes(VilkårStatus.SKAL_IKKE_VURDERES)) &&
            !svarListe.includes(VilkårStatus.IKKE_SATT) &&
            formData.saksbehandlerBegrunnelse !== ''
        );
    };

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const opprettForm = () => {
        if (senderInn) {
            return;
        }
        settSenderInn(true);

        if (vilkårErGyldig()) settFormkravGyldig(true);

        if (vilkårErBesvart()) {
            settFormkravBesvart(true);
        } else {
            settFormkravBesvart(false);
        }
        settLåst(true);
        axiosRequest<IFormVilkår, IFormVilkår>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: formData,
        }).then((res: Ressurs<IFormVilkår>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFormVilkårData((prevState: IFormVilkår) => ({
                    ...prevState,
                    endretTid: res.data.endretTid,
                }));
                settVisAdvarselFormkrav(false);
                nullstillIkkePersisterteKomponenter();
            } else {
                settLåst(false);
                settVisAdvarselFormkrav(true);
            }
            settSenderInn(false);
            hentBehandling.rerun();
        });
    };

    const låsOppFormVilkår = (val: boolean) => {
        settFormkravGyldig(val);
        settLåst(val);
    };

    const radioKnapperLeseListe: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: formData.klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket?',
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

    return (
        <VilkårStyling>
            {!låst && (
                <>
                    <FormKravStylingBody>
                        <RadioKnapperContainer>
                            {radioKnapperLeseListe.map((item: IRadioKnapper, index) => (
                                <RadioGroupStyled
                                    legend={item.spørsmål}
                                    size="small"
                                    onChange={(val: VilkårStatus) => {
                                        settFormVilkårData((prevState: IFormVilkår) => ({
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
                                settFormVilkårData((prevState: IFormVilkår) => ({
                                    ...prevState,
                                    saksbehandlerBegrunnelse: e.target.value,
                                }));
                            }}
                            size="small"
                            description="Vurdering"
                            maxLength={1500}
                        />
                    </FormKravStylingBody>
                    {!senderInn && (
                        <ButtonStyled
                            variant="primary"
                            size="medium"
                            onClick={() => {
                                opprettForm();
                            }}
                        >
                            Lagre
                        </ButtonStyled>
                    )}
                    {visAdvarselFormkrav && (
                        <AlertStyled variant={'error'} size={'medium'}>
                            Noe gikk galt. Prøv å lagre igjen
                        </AlertStyled>
                    )}
                </>
            )}
            {låst && !visAdvarselFormkrav && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={låsOppFormVilkår}
                    saksbehandlerBegrunnelse={formData.saksbehandlerBegrunnelse}
                    endretTid={formData.endretTid}
                    settFormkravGyldig={settFormkravGyldig}
                    settFormVilkårData={settFormVilkårData}
                    senderInn={senderInn}
                    settSenderInn={settSenderInn}
                />
            )}
        </VilkårStyling>
    );
};
