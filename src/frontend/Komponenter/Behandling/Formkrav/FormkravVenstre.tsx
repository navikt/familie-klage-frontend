/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { Heading, BodyLong } from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import navFarger from 'nav-frontend-core';
import IkkeVurdert from '../../../Felles/Ikoner/IkkeVurdert';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { IForm } from './Formkrav';

const FormKravStylingVenstre = styled.div`
    width: 50%;
    padding: 0.5rem 5rem 5rem 5rem;
`;

const IkkeVurdertContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

const IkonTekstRadContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0 0 0.5rem 0;
`;

const IkkeVurdertIkonStyled = styled(IkkeVurdert)`
    margin-right: 1rem;
    margin-left: -0.2rem;
    overflow: visible;
`;

const OppfyltIkonStyled = styled(Oppfylt)`
    margin-right: 1rem;
    margin-left: -0.2rem;
    overflow: visible;
`;

const IkonKategoriGruppe = styled.div`
    display: flex;
    flex-flow: row;
`;

const BodyLongStyled = styled(BodyLong)`
    margin: 0 5rem 1 1.5rem;
`;

const BlåStrek = styled.div`
    border-left: solid 2px ${navFarger.navBlaLighten60};
    margin-left: 0.5rem;
    margin-right: 0.5rem;
`;

const BegrunnelseContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 0.7rem;
`;
const KolonneVenstre = styled.div`
    width: 50%;
    margin: 0 0 0 0;
`;
const KolonneHøyre = styled.div`
    width: 50%;
    margin: 0 0 0 4rem;
`;

const FileContentStyled = styled(FileContent)`
    margin: 0 1.5rem 0 0.1rem;
`;

export const datoFormatering = (dato: Date) => {
    return dato.getDay() + '.' + dato.getMonth() + '.' + dato.getFullYear();
};

interface IFormkravVenstre {
    låst: boolean;
    formkrav: IForm;
}

export const FormkravVenstre: React.FC<{ props: IFormkravVenstre }> = ({ props }) => {
    const vedtaksdato = new Date(props.formkrav.vedtaksdato);
    const klageMottat = new Date(props.formkrav.klageMottat);

    return (
        <FormKravStylingVenstre>
            <IkkeVurdertContainer>
                {!props.låst && <IkkeVurdertIkonStyled heigth={23} width={23} />}
                {props.låst && <OppfyltIkonStyled heigth={23} width={23} />}
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
            </IkkeVurdertContainer>
            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="small">Oppgitt vedtaksdato</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
                <KolonneHøyre>
                    <BodyLongStyled size="small">{datoFormatering(vedtaksdato)} </BodyLongStyled>
                </KolonneHøyre>
            </IkonTekstRadContainer>

            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="small">Klage mottatt</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
                <KolonneHøyre>
                    <BodyLongStyled size="small">{datoFormatering(klageMottat)}</BodyLongStyled>
                </KolonneHøyre>
            </IkonTekstRadContainer>

            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="small">Hva er du uenig i?</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
                <KolonneHøyre>
                    <BodyLongStyled size="small">{props.formkrav.klageÅrsak}</BodyLongStyled>
                </KolonneHøyre>
            </IkonTekstRadContainer>

            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="small">Hvorfor er du uenig?</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
            </IkonTekstRadContainer>
            <BegrunnelseContainer>
                <BlåStrek />
                <BodyLong size="small">{props.formkrav.klageBeskrivelse}</BodyLong>
            </BegrunnelseContainer>
        </FormKravStylingVenstre>
    );
};
