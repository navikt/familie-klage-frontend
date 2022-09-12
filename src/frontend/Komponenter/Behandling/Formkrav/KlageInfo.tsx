import React from 'react';
import styled from 'styled-components';
import { BodyLong, Heading } from '@navikt/ds-react';
import navFarger from 'nav-frontend-core';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { IFormKlage } from './typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import IkkeOppfylt from '../../../Felles/Ikoner/IkkeOppfylt';

const OppfyltIkonStyled = styled(Oppfylt)`
    margin-left: -0.2rem;
`;

const IkkeVurdertIkonStyled = styled(IkkeOppfylt)`
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

interface IFormkravVenstre {
    formkravGyldig: boolean;
    låst: boolean;
    formkrav: IFormKlage;
}

export const KlageInfo: React.FC<IFormkravVenstre> = ({ formkravGyldig, formkrav }) => {
    const { visAdvarselFormkrav } = useBehandling();

    const oppfyltEllerIkkeOppfyltIkon = () => {
        return formkravGyldig && !visAdvarselFormkrav ? (
            <OppfyltIkonStyled heigth={23} width={23} />
        ) : (
            <IkkeVurdertIkonStyled heigth={23} width={23} />
        );
    };

    return (
        <GridTabell>
            <>
                {oppfyltEllerIkkeOppfyltIkon()}
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Oppgitt vedtaksdato</BodyLongStyled>
                <BodyLongStyled size="small">{formkrav.vedtaksDato} </BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Klage mottatt</BodyLongStyled>
                <BodyLongStyled size="small">{formkrav.klageMottatt}</BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Hva er du uenig i?</BodyLongStyled>
                <BodyLongStyled size="small">{formkrav.klageAarsak}</BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Hvorfor er du uenig?</BodyLongStyled>
                <BegrunnelseContainer>
                    <BlåStrek />
                    <BodyLong size="small">{formkrav.klageBeskrivelse}</BodyLong>
                </BegrunnelseContainer>
            </>
        </GridTabell>
    );
};
