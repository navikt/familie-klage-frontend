import React from 'react';
import styled from 'styled-components';
import { BodyLong, Heading } from '@navikt/ds-react';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import IkkeOppfylt from '../../../Felles/Ikoner/IkkeOppfylt';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import { alleVilkårOppfylt } from './utils';
import { Behandling } from '../../../App/typer/fagsak';
import Info from '../../../Felles/Ikoner/Info';
import { harVerdi } from '../../../App/utils/utils';

const OppfyltIkonStyled = styled(Oppfylt)`
    margin-left: -0.2rem;
`;

const IkkeVurdertIkonStyled = styled(IkkeOppfylt)`
    margin-left: -0.2rem;
`;

const AdvarselIkonStyled = styled(Advarsel)`
    margin-left: -0.2rem;
`;

const InfoIkonStyled = styled(Info)`
    margin-left: -0.2rem;
`;

const BodyLongStyled = styled(BodyLong)`
    margin: 0 5rem 1 1.5rem;
`;

interface IProps {
    behandling: Behandling;
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
}

export const KlageInfo: React.FC<IProps> = ({ vurderinger, redigeringsmodus }) => {
    const utledetIkon = () => {
        if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
            return <AdvarselIkonStyled heigth={23} width={23} />;
        } else if (
            alleVilkårOppfylt(vurderinger) &&
            harVerdi(vurderinger.saksbehandlerBegrunnelse)
        ) {
            return <OppfyltIkonStyled height={23} width={23} />;
        } else if (alleVilkårOppfylt(vurderinger)) {
            return <InfoIkonStyled heigth={23} width={23} />;
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
                <BodyLongStyled size="small">Ikke tilgjengelig </BodyLongStyled>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyLongStyled size="small">Klage mottatt</BodyLongStyled>
                <BodyLongStyled size="small">Ikke tilgjengelig</BodyLongStyled>
            </>
        </GridTabell>
    );
};
