import React, { useState } from 'react';
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
import { Button, Heading } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { alleVilkårOppfylt, utledRadioKnapper } from './utils';
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

const BrukerMedBlyantStyled = styled(BrukerMedBlyant)`
    overflow: visible;
`;

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
    margin-right: auto;
`;

interface IProps {
    saksbehandlerBegrunnelse: string;
    endretTid: string;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
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
}) => {
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
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
                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                hentBehandling.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(vurderinger);
    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);

    const urlPostfix = (): string => {
        if (!behandlingErRedigerbar) {
            return '';
        }
        return alleVilkårErOppfylt ? 'vurdering' : 'brev';
    };

    return (
        <VisFormkravContainer>
            <Header>
                <RadSentrertVertikalt>
                    <VilkårIkon>
                        <BrukerMedBlyantStyled heigth={23} width={23} />
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
                            navigate(`/behandling/${hentBehandlingIdFraUrl()}/${urlPostfix()}`)
                        }
                    >
                        Fortsett
                    </LagreKnapp>
                )}
            </SpørsmålContainer>
        </VisFormkravContainer>
    );
};
