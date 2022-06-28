/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { Heading, BodyLong } from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import navFarger from 'nav-frontend-core';
import IkkeVurdert from '../../../Felles/Ikoner/IkkeVurdert';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';

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

interface IFormkravVenstre {
    låst: boolean;
}

export const FormkravVenstre: React.FC<{ props: IFormkravVenstre }> = ({ props }) => {
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
                        <BodyLongStyled size="medium">Oppgitt vedtaksdato</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
                <KolonneHøyre>
                    <BodyLongStyled size="medium">17.06.2022</BodyLongStyled>
                </KolonneHøyre>
            </IkonTekstRadContainer>

            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="medium">Klage mottatt</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
                <KolonneHøyre>
                    <BodyLongStyled size="medium">27.06.2022</BodyLongStyled>
                </KolonneHøyre>
            </IkonTekstRadContainer>

            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="medium">Hva er du uenig i?</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
                <KolonneHøyre>
                    <BodyLongStyled size="medium">Jeg har fått for lite utbetalt</BodyLongStyled>
                </KolonneHøyre>
            </IkonTekstRadContainer>

            <IkonTekstRadContainer>
                <KolonneVenstre>
                    <IkonKategoriGruppe>
                        <FileContentStyled></FileContentStyled>
                        <BodyLongStyled size="medium">Hvorfor er du uenig?</BodyLongStyled>
                    </IkonKategoriGruppe>
                </KolonneVenstre>
            </IkonTekstRadContainer>

            <BegrunnelseContainer>
                <BlåStrek />
                <BodyLong size="medium">
                    Ullamco ut laboris irure excepteur velit nisi occaecat proident. Amet aliquip
                    dolor eu occaecat. Elit sunt occaecat excepteur ea. Quis commodo adipisicing
                    laborum minim. Culpa duis occaecat adipisicing dolor sint cillum. Non in
                    consequat ex esse exercitation cillum Lorem voluptate officia.
                </BodyLong>
            </BegrunnelseContainer>
        </FormKravStylingVenstre>
    );
};
