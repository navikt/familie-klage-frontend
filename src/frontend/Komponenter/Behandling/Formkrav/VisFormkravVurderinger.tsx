import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { NavdsGlobalColorPurple500 } from '@navikt/ds-tokens/dist/tokens';
import BrukerMedBlyant from '../../../Felles/Ikoner/BrukerMedBlyant';
import {
    IFormalkrav,
    IFormkravVilkår,
    Redigeringsmodus,
    VilkårStatus,
    vilkårStatusTilTekst,
} from './typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { formaterIsoDatoTid, formaterNullableIsoDato } from '../../../App/utils/formatter';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import {
    utledFagsystemVedtakFraPåklagetVedtak,
    utledRadioKnapper,
    vedtakstidspunktTilVisningstekst,
} from './utils';
import { Delete, Edit } from '@navikt/ds-icons';
import { PåklagetVedtakstype, påklagetVedtakstypeTilTekst } from '../../../App/typer/fagsak';
import {
    alleVilkårOppfylt,
    begrunnelseUtfylt,
    brevtekstUtfylt,
    påKlagetVedtakValgt,
    utledIkkeUtfylteVilkår,
} from './validerFormkravUtils';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';

export const RadSentrertVertikalt = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const VisFormkravContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const SpørsmålContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-left: 0.4rem solid ${NavdsGlobalColorPurple500};
    padding-left: 2rem;
`;

const SvarElement = styled.ul`
    padding: 0;
    font-size: 1rem;
    list-style-type: none;
`;

const Spørsmål = styled.li`
    padding: 0rem 0;
    width: 40%;
    font-weight: bold;
`;

const Svar = styled.li`
    padding: 0.5rem 0;
    width: 13rem;
`;

const VilkårIkon = styled.div`
    margin: 0 1.5rem 0 -0.7rem;
`;

const BrukerMedBlyantIkon = styled(BrukerMedBlyant)`
    overflow: visible;
`;

const FritekstWrapper = styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
    margin-right: auto;
`;

const StyledAlert = styled(Alert)`
    margin-top: 1rem;
    align-self: flex-start;
    padding-right: 5rem;
`;

interface IProps {
    fagsystemVedtak: FagsystemVedtak[];
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vurderinger: IFormkravVilkår;
}

export const VisFormkravVurderinger: React.FC<IProps> = ({
    fagsystemVedtak,
    lagreVurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
}) => {
    const { behandlingErRedigerbar, hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const { påklagetVedtakstype, vedtaksdatoInfotrygd } = vurderinger.påklagetVedtak;
    const navigate = useNavigate();
    const [nullstillerVurderinger, settNullstillerVurderinger] = useState<boolean>(false);

    const nullstillVurderinger = () => {
        if (nullstillerVurderinger) {
            return;
        }
        settNullstillerVurderinger(true);

        const nullstilteVurderinger: IFormkravVilkår = {
            ...vurderinger,
            klagePart: VilkårStatus.IKKE_SATT,
            klageKonkret: VilkårStatus.IKKE_SATT,
            klagefristOverholdt: VilkårStatus.IKKE_SATT,
            klageSignert: VilkårStatus.IKKE_SATT,
            saksbehandlerBegrunnelse: undefined,
            brevtekst: undefined,
            påklagetVedtak: {
                påklagetVedtakstype: PåklagetVedtakstype.IKKE_VALGT,
            },
        };

        lagreVurderinger(nullstilteVurderinger).then((res: Ressurs<IFormkravVilkår>) => {
            settNullstillerVurderinger(false);
            if (res.status === RessursStatus.SUKSESS) {
                settOppdaterteVurderinger(nullstilteVurderinger);
                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(vurderinger);
    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);
    const påKlagetVedtakErValgt = påKlagetVedtakValgt(vurderinger);
    const harBegrunnelse = begrunnelseUtfylt(vurderinger);
    const harBrevtekst = brevtekstUtfylt(vurderinger);
    const manglerFritekster = !harBrevtekst || !harBegrunnelse;
    const ikkeUtfylteVilkår = utledIkkeUtfylteVilkår(vurderinger);

    const manglerUtfylling =
        ikkeUtfylteVilkår.length > 0 ||
        !påKlagetVedtakErValgt ||
        (!alleVilkårErOppfylt && manglerFritekster);

    const utledUrlSuffiks = (): string => {
        if (!behandlingErRedigerbar) {
            return '';
        }
        if (manglerUtfylling) {
            return '';
        }
        return alleVilkårErOppfylt ? 'vurdering' : 'brev';
    };

    const gjeldendeFagsystemVedtak = utledFagsystemVedtakFraPåklagetVedtak(
        fagsystemVedtak,
        vurderinger.påklagetVedtak
    );
    const gjelderInfotrygd = påklagetVedtakstype === PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING;

    const urlSuffiks = utledUrlSuffiks();

    return (
        <VisFormkravContainer>
            <Header>
                <RadSentrertVertikalt>
                    <VilkårIkon>
                        <BrukerMedBlyantIkon heigth={23} width={23} />
                    </VilkårIkon>
                    <Heading spacing size={'medium'}>
                        {alleVilkårErOppfylt ? 'Vilkår oppfylt' : 'Vilkår ikke oppfylt'}
                    </Heading>
                </RadSentrertVertikalt>
                {behandlingErRedigerbar && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            icon={<Edit />}
                            onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                        >
                            <span>Rediger</span>
                        </Button>
                        <Button
                            onClick={() => nullstillVurderinger()}
                            variant={'tertiary'}
                            icon={<Delete />}
                        >
                            <span>Slett</span>
                        </Button>
                    </div>
                )}
            </Header>
            <SpørsmålContainer>
                Sist endret - {formaterIsoDatoTid(vurderinger.endretTid)}
                <SvarElement>
                    <Spørsmål>Vedtak som er påklaget</Spørsmål>
                    <Svar>
                        {gjeldendeFagsystemVedtak ? (
                            <div>
                                <div>{gjeldendeFagsystemVedtak.behandlingstype}</div>
                                <div>
                                    {gjeldendeFagsystemVedtak.resultat} -{' '}
                                    {vedtakstidspunktTilVisningstekst(gjeldendeFagsystemVedtak)}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div>{påklagetVedtakstypeTilTekst[påklagetVedtakstype]}</div>
                                <div>
                                    {gjelderInfotrygd
                                        ? formaterNullableIsoDato(vedtaksdatoInfotrygd)
                                        : ''}
                                </div>
                            </div>
                        )}
                    </Svar>
                </SvarElement>
                {radioKnapper.map((knapp: IFormalkrav, index) => (
                    <SvarElement key={index}>
                        <Spørsmål>{knapp.spørsmål}</Spørsmål>
                        <Svar>{vilkårStatusTilTekst[knapp.svar]}</Svar>
                    </SvarElement>
                ))}
                {!alleVilkårErOppfylt && (
                    <>
                        <SvarElement>
                            <Spørsmål>Begrunnelse (intern)</Spørsmål>
                            <Svar>
                                <FritekstWrapper>
                                    {vurderinger.saksbehandlerBegrunnelse}
                                </FritekstWrapper>
                            </Svar>
                        </SvarElement>
                        <SvarElement>
                            <Spørsmål>Fritekst til brev</Spørsmål>
                            <Svar>
                                <FritekstWrapper>{vurderinger.brevtekst}</FritekstWrapper>
                            </Svar>
                        </SvarElement>
                    </>
                )}
                {urlSuffiks && (
                    <LagreKnapp
                        variant="primary"
                        size="medium"
                        onClick={() =>
                            navigate(`/behandling/${vurderinger.behandlingId}/${urlSuffiks}`)
                        }
                    >
                        Fortsett
                    </LagreKnapp>
                )}
            </SpørsmålContainer>
            {manglerUtfylling && (
                <StyledAlert variant={'error'}>
                    <Label>Følgende vilkår er ikke utfylt:</Label>
                    <ul>
                        {!påKlagetVedtakErValgt && <li>Ikke valgt påklaget vedtak</li>}
                        {ikkeUtfylteVilkår.map((vilkår) => {
                            return (
                                <li>
                                    <BodyShort key={vilkår.navn}>{vilkår.spørsmål}</BodyShort>
                                </li>
                            );
                        })}
                        {!harBegrunnelse && <li>Begrunnelse er ikke utfylt</li>}
                        {!harBrevtekst && <li>Fritekst til brev er ikke utfylt</li>}
                    </ul>
                </StyledAlert>
            )}
        </VisFormkravContainer>
    );
};
