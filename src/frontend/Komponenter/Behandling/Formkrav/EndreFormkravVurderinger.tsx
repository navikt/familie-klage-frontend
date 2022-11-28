import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    FagsystemVedtak,
    IFormkravVilkår,
    IFormalkrav,
    Redigeringsmodus,
    VilkårStatus,
    EFormalKravNavn,
} from './typer';
import { Alert, Button, HelpText, Label, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { VedtakSelect } from './VedtakSelect';
import {
    alleVilkårOppfylt,
    alleVilkårTattStillingTil,
    påKlagetVedtakValgt,
} from './validerFormkravUtils';
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

const HjelpeTekst = styled(HelpText)`
    margin-left: 0.5rem;
`;

const HelpTextContainer = styled.div`
    max-width: 35rem;
`;

const VedtakSelectContainer = styled.div`
    margin-bottom: 1rem;
`;

const FritekstFelt = styled(Textarea)`
    margin-top: 1rem;
`;

interface IProps {
    fagsystemVedtak: FagsystemVedtak[];
    feilmelding: string;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vurderinger: IFormkravVilkår;
}

export const EndreFormkravVurderinger: React.FC<IProps> = ({
    fagsystemVedtak,
    feilmelding,
    lagreVurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
}) => {
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const { settIkkePersistertKomponent, nullstillIkkePersistertKomponent } = useApp();

    const [oppdatererVurderinger, settOppdatererVurderinger] = useState<boolean>(false);

    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);
    const alleVilkårUtfylt = alleVilkårTattStillingTil(vurderinger);

    const submitOppdaterteVurderinger = () => {
        if (oppdatererVurderinger) {
            return;
        }
        settOppdatererVurderinger(true);

        const vurderingerSomSkalLagres = alleVilkårErOppfylt
            ? { ...vurderinger, saksbehandlerBegrunnelse: '', brevtekst: undefined }
            : vurderinger;

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
            <VedtakSelectContainer>
                <VedtakSelect
                    settOppdaterteVurderinger={settOppdaterteVurderinger}
                    vedtak={fagsystemVedtak}
                    vurderinger={vurderinger}
                />
            </VedtakSelectContainer>
            {påKlagetVedtakValgt(vurderinger) && (
                <>
                    <RadioGrupperContainer>
                        {radioKnapper.map((item: IFormalkrav, index) => (
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

                                <HjelpeTekst>
                                    <HelpTextInnhold formkrav={item.navn} />
                                </HjelpeTekst>
                            </FlexRow>
                        ))}
                    </RadioGrupperContainer>
                    {!alleVilkårErOppfylt && alleVilkårUtfylt && (
                        <>
                            <Textarea
                                label={'Begrunnelse (intern)'}
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
                            />
                            <FritekstFelt
                                label={
                                    <FlexRow>
                                        <Label>Fritekst til brev</Label>
                                        <HjelpeTekst>
                                            Ut ifra hvilke(t) formkrav som ikke er oppfylt, vil det
                                            automatisk vises en generell tekst i brevet med årsak
                                            til avvisning. I dette fritekstfeltet skrives en mer
                                            detaljert begrunnelse. Hvis klagen skal avvises fordi
                                            det er klaget for sent, så kan teksten for eksempel
                                            inneholde datoen for når vedtaket ble gjort og datoen
                                            for når bruker fremsatte klage.
                                        </HjelpeTekst>
                                    </FlexRow>
                                }
                                value={vurderinger.brevtekst}
                                onChange={(e) => {
                                    settIkkePersistertKomponent('formkravVilkår');
                                    settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
                                        return {
                                            ...prevState,
                                            brevtekst: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </>
                    )}
                </>
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

const HelpTextInnhold: React.FC<{ formkrav: EFormalKravNavn }> = ({ formkrav }) => {
    // switch (formkrav){
    //     case
    // }
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
