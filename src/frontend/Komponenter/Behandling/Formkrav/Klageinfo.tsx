/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { Heading, BodyLong } from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import navFarger from 'nav-frontend-core';
import IkkeVurdert from '../../../Felles/Ikoner/IkkeVurdert';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { IFormKlage } from './utils';
import { useBehandling } from '../../../App/context/BehandlingContext';

const FormkravStyling = styled.div`
    width: 50%;
    margin: 0.5rem 1rem 1rem 1rem;
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
    display: inline-grid;
    grid-template-columns: [symbol] 2.2rem [tekst] auto;
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
    formkravGyldig: boolean;
    låst: boolean;
    formkrav: IFormKlage;
}
export const Klageinfo: React.FC<IFormkravVenstre> = ({ formkravGyldig, formkrav }) => {
    const { visAdvarselFormkrav } = useBehandling();
    return (
        <FormkravStyling>
            <IkkeVurdertContainer>
                {formkravGyldig && !visAdvarselFormkrav ? (
                    <OppfyltIkonStyled heigth={23} width={23} />
                ) : (
                    <IkkeVurdertIkonStyled heigth={23} width={23} />
                )}
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
                    <BodyLongStyled size="small">{formkrav.vedtaksDato} </BodyLongStyled>
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
                    <BodyLongStyled size="small">{formkrav.klageMottatt}</BodyLongStyled>
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
                    <BodyLongStyled size="small">{formkrav.klageAarsak}</BodyLongStyled>
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
                <BodyLong size="small">{formkrav.klageBeskrivelse}</BodyLong>
            </BegrunnelseContainer>
        </FormkravStyling>
    );
};
