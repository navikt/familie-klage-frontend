import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { NavdsGlobalColorPurple500 } from '@navikt/ds-tokens/dist/tokens';
import BrukerMedBlyant from '../../../Felles/Ikoner/BrukerMedBlyant';
import {
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
import { alleVilkårOppfylt, utledIkkeUtfylteVilkår, utledRadioKnapper } from './utils';
import { harVerdi } from '../../../App/utils/utils';
import { Delete, Edit } from '@navikt/ds-icons';

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
    width: 40%;
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
    saksbehandlerBegrunnelse: string;
    endretTid: string;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    vurderinger: IFormkravVilkår;
}

export const VisFormkravVurderinger: React.FC<IProps> = ({
    saksbehandlerBegrunnelse,
    endretTid,
    settRedigeringsmodus,
    lagreVurderinger,
    vurderinger,
    settOppdaterteVurderinger,
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
    const manglerBegrunnelse = !harVerdi(vurderinger.saksbehandlerBegrunnelse);
    const ikkeUtfylteVilkår = utledIkkeUtfylteVilkår(vurderinger);

    const utledUrlPostfix = (): string => {
        if (!behandlingErRedigerbar) {
            return '';
        }
        if (ikkeUtfylteVilkår.length > 0) {
            return '';
        }
        if (manglerBegrunnelse) {
            return '';
        }
        return alleVilkårErOppfylt ? 'vurdering' : 'brev';
    };

    const urlPostfix = utledUrlPostfix();

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
                {radioKnapper.map((item: IRadioKnapper, index) => (
                    <SvarElement key={index}>
                        <Spørsmål>{item.spørsmål}</Spørsmål>
                        <Svar>{vilkårStatusTilTekst[item.svar]}</Svar>
                    </SvarElement>
                ))}
                <SvarElement>
                    <Spørsmål>Begrunnelse</Spørsmål>
                    <Svar>{saksbehandlerBegrunnelse}</Svar>
                </SvarElement>
                {urlPostfix && (
                    <LagreKnapp
                        variant="primary"
                        size="medium"
                        onClick={() =>
                            navigate(`/behandling/${hentBehandlingIdFraUrl()}/${urlPostfix}`)
                        }
                    >
                        Fortsett
                    </LagreKnapp>
                )}
            </SpørsmålContainer>
            {ikkeUtfylteVilkår.length > 0 && (
                <StyledAlert variant={'error'}>
                    <Label>Følgende vilkår er ikke utfylt:</Label>
                    <ul>
                        {ikkeUtfylteVilkår.map((vilkår) => {
                            return (
                                <li>
                                    <BodyShort key={vilkår.navn}>{vilkår.spørsmål}</BodyShort>
                                </li>
                            );
                        })}
                        {manglerBegrunnelse && <li>Begrunnelse er ikke utfylt</li>}
                    </ul>
                </StyledAlert>
            )}
        </VisFormkravContainer>
    );
};
