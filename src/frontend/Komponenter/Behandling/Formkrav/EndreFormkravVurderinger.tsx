import React, { Dispatch, SetStateAction, useState } from 'react';
import { IFormkravVilkår, IRadioKnapper, Redigeringsmodus, VilkårStatus } from './typer';
import { Alert, Button, HelpText, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { alleVilkårOppfylt, utledRadioKnapper } from './utils';

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
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 0.5rem;
`;

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledHelpText = styled(HelpText)`
    margin-left: 0.5rem;
`;

const HelpTextContainer = styled.div`
    max-width: 35rem;
`;

interface IProps {
    vurderinger: IFormkravVilkår;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    feilmelding: string;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
}

export const EndreFormkravVurderinger: React.FC<IProps> = ({
    vurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    lagreVurderinger,
    feilmelding,
}) => {
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const { settIkkePersistertKomponent, nullstillIkkePersistertKomponent } = useApp();

    const [oppdatererVurderinger, settOppdatererVurderinger] = useState<boolean>(false);

    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);

    const submitOppdaterteVurderinger = () => {
        if (oppdatererVurderinger) {
            return;
        }
        settOppdatererVurderinger(true);

        const vurderingerSomSkalLagres = alleVilkårErOppfylt
            ? vurderinger
            : { ...vurderinger, saksbehandlerBegrunnelse: '' };

        lagreVurderinger(vurderingerSomSkalLagres).then((res: Ressurs<IFormkravVilkår>) => {
            settOppdatererVurderinger(false);
            if (res.status === RessursStatus.SUKSESS) {
                settOppdaterteVurderinger(vurderingerSomSkalLagres);
                nullstillIkkePersistertKomponent('formkravVilkår');
                settRedigeringsmodus(Redigeringsmodus.VISNING);
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(vurderinger);

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
                    <FlexRow key={index}>
                        <RadioGruppe
                            legend={item.spørsmål}
                            size="medium"
                            onChange={(val: VilkårStatus) => {
                                settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
                                    return {
                                        ...prevState,
                                        [item.navn]: val,
                                    } as IFormkravVilkår;
                                });
                                settIkkePersistertKomponent('formkravVilkår');
                            }}
                            value={item.svar}
                            key={index}
                        >
                            <RadioButton value={VilkårStatus.OPPFYLT}>Ja</RadioButton>
                            <RadioButton value={VilkårStatus.IKKE_OPPFYLT}>Nei</RadioButton>
                        </RadioGruppe>
                        {item.spørsmål === 'Er klagefristen overholdt?' && (
                            <StyledHelpText>
                                <HelpTextInnhold />
                            </StyledHelpText>
                        )}
                    </FlexRow>
                ))}
            </RadioGrupperContainer>
            {alleVilkårErOppfylt && (
                <Textarea
                    label={'Begrunnelse'}
                    value={vurderinger.saksbehandlerBegrunnelse}
                    onChange={(e) => {
                        settIkkePersistertKomponent('formkravVilkår');
                        settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
                            return {
                                ...prevState,
                                saksbehandlerBegrunnelse: e.target.value,
                            };
                        });
                    }}
                    maxLength={1500}
                />
            )}
            {feilmelding && (
                <AlertStripe variant={'error'} size={'medium'}>
                    {feilmelding}
                </AlertStripe>
            )}
            <LagreKnapp htmltype="submit" variant="primary" size="medium">
                Lagre
            </LagreKnapp>
        </form>
    );
};

const HelpTextInnhold: React.FC = () => {
    return (
        <HelpTextContainer>
            <div>
                Selv om fristen for innsendelse av klage har blitt overskredet, kan klagen tas til
                behandling dersom et av følgende kriterier er oppfylt:
            </div>
            <br />
            <div>
                <b>a)</b> Parten eller hans fullmektig ikke kan lastes for å ha oversittet fristen
                eller for å ha drøyd med å klage etterpå
            </div>
            <br />
            <div>
                <b>b)</b> Det av særlige grunner er rimelig at klagen blir prøvd
            </div>
            <br />
            <div>
                Dersom klagen tas til behandling som følge av et slikt unntak, vennligst beskriv
                dette i fritekstfeltet.
            </div>
        </HelpTextContainer>
    );
};
