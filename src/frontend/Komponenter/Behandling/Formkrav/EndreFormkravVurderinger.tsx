import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    EFormalKravType,
    FormkravFristUnntak,
    IFormalkrav,
    IFormkravVilkår,
    Redigeringsmodus,
    VilkårStatus,
} from './typer';
import {
    Alert,
    BodyLong,
    Button,
    HelpText,
    Label,
    Radio,
    RadioGroup,
    Textarea,
} from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { VedtakSelect } from './VedtakSelect';
import {
    alleVilkårOppfylt,
    alleVilkårTattStillingTil,
    klagefristUnntakErValgtOgOppfylt,
    påKlagetVedtakValgt,
} from './validerFormkravUtils';
import {
    evaluerOmFelterSkalTilbakestilles,
    skalViseKlagefristUnntak,
    utledRadioKnapper,
} from './utils';
import KlagefristUnntak from './KlagefristUnntak';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { Fagsystem, PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';

const RadioGrupperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioGruppe = styled(RadioGroup)`
    margin-bottom: 1rem;
`;

const RadioButton = styled(Radio)`
    margin: -0.6rem -0.6rem -0.6rem 0;
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
    fagsystem: Fagsystem;
    klagebehandlingsresultater: Klagebehandlingsresultat[];
}

export const EndreFormkravVurderinger: React.FC<IProps> = ({
    fagsystemVedtak,
    feilmelding,
    lagreVurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
    fagsystem,
    klagebehandlingsresultater,
}) => {
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const { settIkkePersistertKomponent, nullstillIkkePersistertKomponent } = useApp();

    const [oppdatererVurderinger, settOppdatererVurderinger] = useState<boolean>(false);

    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);
    const klageFristUnntakErOppfylt = klagefristUnntakErValgtOgOppfylt(
        vurderinger.klagefristOverholdtUnntak
    );

    const skalViseKlagefristUnntakOppfyltBegrunnelseOgBrevtekst =
        alleVilkårErOppfylt && klageFristUnntakErOppfylt;

    const alleVilkårUtfylt = alleVilkårTattStillingTil(vurderinger);
    const ikkePåklagetVedtak =
        vurderinger.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.UTEN_VEDTAK;

    const submitOppdaterteVurderinger = () => {
        if (oppdatererVurderinger) {
            return;
        }
        settOppdatererVurderinger(true);

        const vurderingerSomSkalLagres = evaluerOmFelterSkalTilbakestilles(vurderinger);

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

    const skalViseHjelpetekst = (type: EFormalKravType) => {
        return type != EFormalKravType.KLAGEFRIST_OVERHOLDT;
    };

    const fritekstHjelpetekst = (): string => {
        const standardFritekstHjelpetekst =
            'Ut ifra hvilke(t) formkrav som ikke er oppfylt, vil det automatisk vises en generell tekst i brevet med årsak til avvisning. ' +
            'I dette fritekstfeltet skrives en mer detaljert begrunnelse. ' +
            'Hvis klagen skal avvises fordi det er klaget for sent, så kan teksten for eksempel inneholde datoen for når vedtaket ble gjort og datoen for når bruker fremsatte klage';

        switch (fagsystem) {
            case Fagsystem.EF:
                return standardFritekstHjelpetekst;
            case Fagsystem.BA:
            case Fagsystem.KS:
                if (skalViseKlagefristUnntakOppfyltBegrunnelseOgBrevtekst) {
                    return 'I dette fritekstfeltet skrives en begrunnelse for hvorfor du vurderer at unntak for klagefristen er oppfylt. Det du skriver vil hentes inn til oversendelsesbrevet.';
                } else {
                    return standardFritekstHjelpetekst;
                }
        }
    };

    const skalViseBegrunnelseOgBrevtekst = (): boolean => {
        switch (fagsystem) {
            case Fagsystem.EF:
                return (!alleVilkårErOppfylt && alleVilkårUtfylt) || ikkePåklagetVedtak;
            case Fagsystem.BA:
            case Fagsystem.KS:
                return (
                    ((!alleVilkårErOppfylt ||
                        skalViseKlagefristUnntakOppfyltBegrunnelseOgBrevtekst) &&
                        alleVilkårUtfylt) ||
                    ikkePåklagetVedtak
                );
        }
    };

    const skalNullstilleKlagefristOverholdtUnntak = (
        formalkrav: IFormalkrav,
        vilkårStatus: VilkårStatus
    ): boolean => {
        return (
            formalkrav.type == EFormalKravType.KLAGEFRIST_OVERHOLDT &&
            vilkårStatus == VilkårStatus.OPPFYLT
        );
    };

    const oppdaterVurderinger = (formalkrav: IFormalkrav, vilkårStatus: VilkårStatus) => {
        settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
            if (skalNullstilleKlagefristOverholdtUnntak(formalkrav, vilkårStatus)) {
                return {
                    ...prevState,
                    [formalkrav.navn]: vilkårStatus,
                    klagefristOverholdtUnntak: FormkravFristUnntak.IKKE_SATT,
                } as IFormkravVilkår;
            }
            return {
                ...prevState,
                [formalkrav.navn]: vilkårStatus,
            } as IFormkravVilkår;
        });
        settIkkePersistertKomponent('formkravVilkår');
    };

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
                    fagsystem={fagsystem}
                    klagebehandlingsresultater={klagebehandlingsresultater}
                />
            </VedtakSelectContainer>
            {påKlagetVedtakValgt(vurderinger) && (
                <>
                    {vurderinger.påklagetVedtak.påklagetVedtakstype !==
                        PåklagetVedtakstype.UTEN_VEDTAK && (
                        <RadioGrupperContainer>
                            {radioKnapper.map((formalkrav: IFormalkrav, index: number) => (
                                <>
                                    <FlexRow key={index}>
                                        <RadioGruppe
                                            legend={formalkrav.spørsmål}
                                            size="medium"
                                            onChange={(val: VilkårStatus) => {
                                                oppdaterVurderinger(formalkrav, val);
                                            }}
                                            value={formalkrav.svar}
                                            key={index}
                                        >
                                            <RadioButton value={VilkårStatus.OPPFYLT}>
                                                Ja
                                            </RadioButton>
                                            <RadioButton value={VilkårStatus.IKKE_OPPFYLT}>
                                                Nei
                                            </RadioButton>
                                        </RadioGruppe>

                                        {skalViseHjelpetekst(formalkrav.type) && (
                                            <HelpTextContainer>
                                                <HjelpeTekst>
                                                    <HelpTextInnhold formkrav={formalkrav.type} />
                                                </HjelpeTekst>
                                            </HelpTextContainer>
                                        )}
                                    </FlexRow>
                                    {skalViseKlagefristUnntak(formalkrav) && (
                                        <KlagefristUnntak
                                            settOppdaterteVurderinger={settOppdaterteVurderinger}
                                            unntakVurdering={vurderinger.klagefristOverholdtUnntak}
                                        />
                                    )}
                                </>
                            ))}
                        </RadioGrupperContainer>
                    )}
                    {skalViseBegrunnelseOgBrevtekst() && (
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
                                        <HjelpeTekst>{fritekstHjelpetekst()}</HjelpeTekst>
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

const HelpTextInnhold: React.FC<{ formkrav: EFormalKravType }> = ({ formkrav }) => {
    switch (formkrav) {
        case EFormalKravType.KLAGE_SIGNERT:
            return (
                <>
                    <BodyLong spacing>
                        Klagen skal som hovedregel være skriftlig og underskrevet av klageren, eller
                        av klagers fullmektig.
                    </BodyLong>
                    <BodyLong>
                        Klager som er sendt inn via tjenester som krever personlig innlogging, for
                        eksempel gjennom digitalt klageskjema eller Ditt NAV, har godkjent digital
                        signatur. Hvis klagen er sendt inn per post, må den være signert av klager
                        eller dens fullmektig. Hvis klagen mangler signatur, må vi innhente dette
                        før klagen kan behandles.
                    </BodyLong>
                </>
            );
        case EFormalKravType.KLAGEFRIST_OVERHOLDT:
            return (
                <>
                    <BodyLong spacing>
                        Selv om fristen for innsendelse av klage har blitt overskredet, kan klagen
                        tas til behandling dersom et av følgende kriterier er oppfylt:
                    </BodyLong>
                    <BodyLong spacing>
                        <strong>a)</strong> Parten eller hans fullmektig ikke kan lastes for å ha
                        oversittet fristen eller for å ha drøyd med å klage etterpå
                    </BodyLong>
                    <BodyLong spacing>
                        <strong>b)</strong> Det av særlige grunner er rimelig at klagen blir prøvd
                    </BodyLong>
                    <BodyLong>
                        Dersom klagen tas til behandling som følge av et slikt unntak, vennligst
                        beskriv dette i fritekstfeltet.
                    </BodyLong>
                </>
            );
        case EFormalKravType.KLAGER_ER_PART:
            return (
                <>
                    <BodyLong spacing>
                        Parten er den som vedtaket retter seg mot, eller den som saken gjelder.
                    </BodyLong>
                    <BodyLong spacing>
                        Parten har rett til å få bistand fra en advokat, verge eller annen
                        fullmektig. Fullmektig som ikke er advokat, må som hovedregel legge frem en
                        skriftlig fullmakt.
                    </BodyLong>
                    <BodyLong>
                        Hvis det ikke foreligger fullmakt, må fullmakt innhentes før klagen kan
                        behandles.
                    </BodyLong>
                </>
            );
        case EFormalKravType.KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK:
            return (
                <>
                    <BodyLong spacing>
                        I klagen må det stå hvilket vedtak det klages på, og hvorfor klager er uenig
                        i vedtaket.
                    </BodyLong>
                    <BodyLong>
                        Hvis klagen ikke inneholder konkrete opplysninger, som for eksempel «Jeg er
                        uenig i vedtaket» eller «Jeg klager på vedtaket», må vi gå i dialog med
                        klager for å få vite hva klagen gjelder før saken kan behandles.
                    </BodyLong>
                </>
            );
    }
};
