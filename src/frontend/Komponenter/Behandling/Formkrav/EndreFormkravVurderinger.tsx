import React, { useState } from 'react';
import { IFormVilkår, IRadioKnapper, Redigeringsmodus, VilkårStatus } from './typer';
import { Alert, Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { utledRadioKnapper } from './utils';

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
    vurderinger: IFormVilkår;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    lagreVurderinger: (
        vurderinger: IFormVilkår
    ) => Promise<RessursSuksess<IFormVilkår> | RessursFeilet>;
}

export const EndreFormkravVurderinger: React.FC<IProps> = ({
    vurderinger,
    settRedigeringsmodus,
    lagreVurderinger,
}) => {
    const { visAdvarselFormkrav, hentBehandling } = useBehandling();

    const { settIkkePersistertKomponent } = useApp();

    const [oppdatererVurderinger, settOppdatererVurderinger] = useState<boolean>(false);
    const [oppdaterteVurderinger, settOppdaterteVurderinger] = useState<IFormVilkår>(vurderinger);

    const submitOppdaterteVurderinger = () => {
        if (oppdatererVurderinger) {
            return;
        }
        settOppdatererVurderinger(true);

        lagreVurderinger(oppdaterteVurderinger).then((res: Ressurs<IFormVilkår>) => {
            settOppdatererVurderinger(false);
            if (res.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(Redigeringsmodus.VISNING);
                hentBehandling.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(oppdaterteVurderinger);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                submitOppdaterteVurderinger();
            }}
        >
            <RadioGrupperContainer>
                {radioKnapper.map((item: IRadioKnapper, index) => (
                    <RadioGruppe
                        legend={item.spørsmål}
                        size="medium"
                        onChange={(val: VilkårStatus) => {
                            settOppdaterteVurderinger((prevState: IFormVilkår) => {
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
                value={oppdaterteVurderinger.saksbehandlerBegrunnelse}
                onChange={(e) => {
                    settIkkePersistertKomponent(e.target.value);
                    settOppdaterteVurderinger((prevState: IFormVilkår) => {
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
