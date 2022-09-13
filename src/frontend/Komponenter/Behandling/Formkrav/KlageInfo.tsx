import React from 'react';
import styled from 'styled-components';
import { BodyLong, Heading } from '@navikt/ds-react';
import navFarger from 'nav-frontend-core';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { IFormkravVilkår, IKlageInfo, Redigeringsmodus } from './typer';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import IkkeOppfylt from '../../../Felles/Ikoner/IkkeOppfylt';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import { alleVilkårOppfylt } from './utils';

const OppfyltIkonStyled = styled(Oppfylt)`
    margin-left: -0.2rem;
`;

const IkkeVurdertIkonStyled = styled(IkkeOppfylt)`
    margin-left: -0.2rem;
`;

const AdvarselIkonStyled = styled(Advarsel)`
    margin-left: -0.2rem;
`;

const BodyLongStyled = styled(BodyLong)`
    margin: 0 5rem 1 1.5rem;
`;

const BlåStrek = styled.div`
    border-left: solid 2px ${navFarger.navBlaLighten60};
    margin-right: 0.5rem;
`;

const BegrunnelseContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

interface IProps {
    klageInfo: IKlageInfo;
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
}

export const KlageInfo: React.FC<IProps> = ({ klageInfo, vurderinger, redigeringsmodus }) => {
    const utledetIkon = () => {
        if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
            return <AdvarselIkonStyled heigth={23} width={23} />;
        } else if (alleVilkårOppfylt(vurderinger)) {
            return <OppfyltIkonStyled heigth={23} width={23} />;
        }
        return <IkkeVurdertIkonStyled heigth={23} width={23} />;
    };

    return (
        <GridTabell>
            <>
                {utledetIkon()}
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Oppgitt vedtaksdato</BodyLongStyled>
                <BodyLongStyled size="small">{klageInfo.vedtaksDato} </BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Klage mottatt</BodyLongStyled>
                <BodyLongStyled size="small">{klageInfo.klageMottatt}</BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Hva er du uenig i?</BodyLongStyled>
                <BodyLongStyled size="small">{klageInfo.klageAarsak}</BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Hvorfor er du uenig?</BodyLongStyled>
                <BegrunnelseContainer>
                    <BlåStrek />
                    <BodyLong size="small">{klageInfo.klageBeskrivelse}</BodyLong>
                </BegrunnelseContainer>
            </>
        </GridTabell>
    );
};
