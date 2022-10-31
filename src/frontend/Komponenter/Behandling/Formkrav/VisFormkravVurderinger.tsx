import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { NavdsGlobalColorPurple500 } from '@navikt/ds-tokens/dist/tokens';
import BrukerMedBlyant from '../../../Felles/Ikoner/BrukerMedBlyant';
import {
    FagsystemVedtak,
    IFormkravVilkår,
    IRadioKnapper,
    Redigeringsmodus,
    VilkårStatus,
    vilkårStatusTilTekst,
} from './typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { utledFagsystemVedtakFraPåklagetVedtak, utledRadioKnapper } from './utils';
import { Delete, Edit } from '@navikt/ds-icons';
import { PåklagetVedtakstype, påklagetVedtakstypeTilTekst } from '../../../App/typer/fagsak';
import {
    alleVilkårOppfylt,
    begrunnelseUtfylt,
    påKlagetVedtakValgt,
    utledIkkeUtfylteVilkår,
} from './validerFormkravUtils';

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
    endretTid: string;
    fagsystemVedtak: FagsystemVedtak[];
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    saksbehandlerBegrunnelse: string;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vurderinger: IFormkravVilkår;
}

export const VisFormkravVurderinger: React.FC<IProps> = ({
    endretTid,
    fagsystemVedtak,
    lagreVurderinger,
    saksbehandlerBegrunnelse,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
}) => {
    const { behandlingErRedigerbar, hentBehandling, hentBehandlingshistorikk } = useBehandling();
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
            saksbehandlerBegrunnelse: '',
            påklagetVedtak: {
                ...vurderinger.påklagetVedtak,
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
    const ikkeUtfylteVilkår = utledIkkeUtfylteVilkår(vurderinger);

    const utledUrlSuffiks = (): string => {
        if (!behandlingErRedigerbar) {
            return '';
        }
        if (!påKlagetVedtakErValgt) {
            return '';
        }
        if (ikkeUtfylteVilkår.length > 0) {
            return '';
        }
        if (alleVilkårErOppfylt && !harBegrunnelse) {
            return '';
        }
        return alleVilkårErOppfylt ? 'vurdering' : 'brev';
    };

    const gjeldendeFagsystemVedtak = utledFagsystemVedtakFraPåklagetVedtak(
        fagsystemVedtak,
        vurderinger.påklagetVedtak
    );

    const urlSuffiks = utledUrlSuffiks();

    const manglerUtfylling =
        ikkeUtfylteVilkår.length > 0 ||
        !påKlagetVedtakErValgt ||
        (alleVilkårErOppfylt && !harBegrunnelse);

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
                Sist endret - {formaterIsoDatoTid(endretTid)}
                <SvarElement>
                    <Spørsmål>Vedtak som er påklaget</Spørsmål>
                    <Svar>
                        {gjeldendeFagsystemVedtak ? (
                            <div>
                                {gjeldendeFagsystemVedtak.behandlingstype}
                                <br />
                                {gjeldendeFagsystemVedtak.resultat} -{' '}
                                {formaterIsoDatoTid(gjeldendeFagsystemVedtak.vedtakstidspunkt)}
                            </div>
                        ) : (
                            påklagetVedtakstypeTilTekst[
                                vurderinger.påklagetVedtak.påklagetVedtakstype
                            ]
                        )}
                    </Svar>
                </SvarElement>
                {radioKnapper.map((knapp: IRadioKnapper, index) => (
                    <SvarElement key={index}>
                        <Spørsmål>{knapp.spørsmål}</Spørsmål>
                        <Svar>{vilkårStatusTilTekst[knapp.svar]}</Svar>
                    </SvarElement>
                ))}
                {alleVilkårErOppfylt && (
                    <SvarElement>
                        <Spørsmål>Begrunnelse</Spørsmål>
                        <Svar>{saksbehandlerBegrunnelse}</Svar>
                    </SvarElement>
                )}
                {urlSuffiks && (
                    <LagreKnapp
                        variant="primary"
                        size="medium"
                        onClick={() =>
                            navigate(`/behandling/${hentBehandlingIdFraUrl()}/${urlSuffiks}`)
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
                    </ul>
                </StyledAlert>
            )}
        </VisFormkravContainer>
    );
};
