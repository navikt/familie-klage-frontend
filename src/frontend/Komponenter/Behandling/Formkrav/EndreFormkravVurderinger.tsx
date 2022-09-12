import React, { useState } from 'react';
import { IFormVilkår, IRadioKnapper, VilkårStatus } from './typer';
import { Alert, Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';

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
`;

const RadioGrupperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioGruppe = styled(RadioGroup)`
    margin-bottom: 1rem;
`;

const RadioButton = styled(Radio)`
    margin: -0.6rem -0.6rem -0.6rem 0rem;
`;

const LagreKnapp = styled(Button)`
    margin-top: 2rem;
    padding: 0.75rem 1.5rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 0.5rem;
`;

interface IProps {
    radioKnapper: IRadioKnapper[];
    settFormkravGyldig: (value: boolean) => void;
    låst: boolean;
    settLåst: (value: boolean) => void;
    formData: IFormVilkår;
    settFormkravBesvart: (value: boolean) => void;
    settFormVilkårData: (value: IFormVilkår) => void;
}

export const EndreFormkravVurderinger: React.FC<IProps> = ({
    radioKnapper,
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

    return (
        <form
            onSubmit={() => {
                opprettForm();
            }}
        >
            <RadioGrupperContainer>
                {radioKnapper.map((item: IRadioKnapper, index) => (
                    <RadioGruppe
                        legend={item.spørsmål}
                        size="medium"
                        onChange={(val: VilkårStatus) => {
                            settFormVilkårData((prevState: IFormVilkår) => {
                                return {
                                    ...prevState,
                                    [item.navn]: val,
                                } as IFormVilkår;
                            });
                            settIkkePersistertKomponent(val);
                        }}
                        value={item.svar}
                        key={index}
                    >
                        <RadioButton value={VilkårStatus.OPPFYLT}>Ja</RadioButton>
                        <RadioButton value={VilkårStatus.IKKE_OPPFYLT}>Nei</RadioButton>
                        <RadioButton value={VilkårStatus.SKAL_IKKE_VURDERES}>
                            Skal ikke vurderes
                        </RadioButton>
                    </RadioGruppe>
                ))}
            </RadioGrupperContainer>
            <Textarea
                label={'Vurdering'}
                value={formData.saksbehandlerBegrunnelse}
                onChange={(e) => {
                    settIkkePersistertKomponent(e.target.value);
                    settFormVilkårData((prevState: IFormVilkår) => {
                        return {
                            ...prevState,
                            saksbehandlerBegrunnelse: e.target.value,
                        };
                    });
                }}
                maxLength={1500}
            />
            <LagreKnapp htmlType="submit" variant="primary" size="medium">
                Lagre
            </LagreKnapp>
            {visAdvarselFormkrav && (
                <AlertStripe variant={'error'} size={'medium'}>
                    Noe gikk galt. Prøv å lagre igjen
                </AlertStripe>
            )}
        </form>
    );
};
