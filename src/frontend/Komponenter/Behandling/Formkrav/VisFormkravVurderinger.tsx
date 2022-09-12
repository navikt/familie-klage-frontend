import React from 'react';
import styled from 'styled-components';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import RedigerBlyant from '../../../Felles/Ikoner/RedigerBlyant';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import navFarger from 'nav-frontend-core';
import BrukerMedBlyant from '../../../Felles/Ikoner/BrukerMedBlyant';
import {
    IFormVilkår,
    IRadioKnapper,
    IVilkårNullstill,
    VilkårStatus,
    vilkårStatusTilTekst,
} from './typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button, Heading } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

export const RadSentrertVertikalt = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 0 3rem 0 0;
`;

const VilkårHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
    border-left: 0.4rem solid ${navFarger.navLillaLighten20};
    padding-left: 2rem;
    margin-bottom: 1rem;
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

const ButtonStyled = styled(Button)`
    margin-right: auto;
`;

const AlertStyled = styled(Alert)`
    margin: 1rem;
    width: 100%;
`;

interface IProps {
    radioKnapper: IRadioKnapper[];
    redigerHandling: (value: boolean) => void;
    saksbehandlerBegrunnelse: string;
    endretTid: string;
    settFormVilkårData: (value: IFormVilkår) => void;
    settFormkravGyldig: (value: boolean) => void;
    senderInn: boolean;
    settSenderInn: (value: boolean) => void;
}

export const VisFormkravVurderinger: React.FC<IProps> = ({
    radioKnapper,
    redigerHandling,
    saksbehandlerBegrunnelse,
    endretTid,
    settFormVilkårData,
    settFormkravGyldig,
}) => {
    const { settFormkravLåst, formkravGyldig, formkravBesvart, behandlingErRedigerbar } =
        useBehandling();
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    const slettHandling = () => {
        const nullstilteVilkår: IVilkårNullstill = {
            behandlingId: hentBehandlingIdFraUrl(),
            klagePart: VilkårStatus.IKKE_SATT,
            klageKonkret: VilkårStatus.IKKE_SATT,
            klagefristOverholdt: VilkårStatus.IKKE_SATT,
            klageSignert: VilkårStatus.IKKE_SATT,
            saksbehandlerBegrunnelse: '',
        };

        settFormVilkårData((prevState: IFormVilkår) => ({
            ...prevState,
            klagePart: VilkårStatus.IKKE_SATT,
            klageKonkret: VilkårStatus.IKKE_SATT,
            klagefristOverholdt: VilkårStatus.IKKE_SATT,
            klageSignert: VilkårStatus.IKKE_SATT,
            saksbehandlerBegrunnelse: '',
        }));
        settFormkravGyldig(false);

        axiosRequest<IFormVilkår, IVilkårNullstill>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: nullstilteVilkår,
        });
        settFormkravLåst(false);
    };

    return (
        <FormKravStyling>
            <VilkårHeader>
                <RadSentrertVertikalt>
                    <VilkårIkon>
                        <BrukerMedBlyantStyled heigth={23} width={23} />
                    </VilkårIkon>
                    <Heading spacing size={'medium'}>
                        {formkravGyldig ? 'Vilkår oppfylt' : 'Vilkår ikke oppfylt'}
                    </Heading>
                </RadSentrertVertikalt>
                {behandlingErRedigerbar && (
                    <div>
                        <LenkeKnapp onClick={() => redigerHandling(false)}>
                            <RedigerBlyant withDefaultStroke={false} width={19} heigth={19} />
                            <span>Rediger</span>
                        </LenkeKnapp>
                        <LenkeKnapp onClick={() => slettHandling()}>
                            <SlettSøppelkasse withDefaultStroke={false} width={19} heigth={19} />
                            <span>Slett</span>
                        </LenkeKnapp>
                    </div>
                )}
            </VilkårHeader>
            <FormKravStylingBody>
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
            </FormKravStylingBody>
            {formkravGyldig && formkravBesvart && behandlingErRedigerbar && (
                <ButtonStyled
                    variant="primary"
                    size="medium"
                    onClick={() => navigate(`/behandling/${hentBehandlingIdFraUrl()}/vurdering`)}
                >
                    Fortsett
                </ButtonStyled>
            )}
            {!formkravGyldig && formkravBesvart && behandlingErRedigerbar && (
                <ButtonStyled
                    variant="primary"
                    size="medium"
                    onClick={() => navigate(`/behandling/${hentBehandlingIdFraUrl()}/brev`)}
                >
                    Fortsett
                </ButtonStyled>
            )}
            {formkravGyldig && formkravBesvart && behandlingErRedigerbar && (
                <AlertStyled variant={'success'} size={'medium'}>
                    Du har lagret vilkår.
                </AlertStyled>
            )}
            {!formkravGyldig && formkravBesvart && behandlingErRedigerbar && (
                <AlertStyled variant={'info'} size={'medium'}>
                    Du har lagret vilkår som ikke oppfylt.
                </AlertStyled>
            )}
            {!formkravGyldig && !formkravBesvart && behandlingErRedigerbar && (
                <AlertStyled variant={'warning'} size={'medium'}>
                    Noen vilkår er ikke besvart.
                </AlertStyled>
            )}
        </FormKravStyling>
    );
};
