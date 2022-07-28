import * as React from 'react';
import { Heading, BodyLong, Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ikon } from './Ikon';

const FormkravOppsummeringStyled = styled.div`
    display: flex;
    margin: 2rem 4rem 2rem 4rem;
`;

const BegrunnelseStyled = styled.div`
    margin-left: 6rem;
`;

const OppfyltStyled = styled.div`
    display: flex;
`;

const FeilVedtaksresultatStyled = styled.div`
    display: flex;
    margin-top: 1rem;
`;

interface IFormkravOppsummering {
    oppfylt: number;
    muligOppfylt: number;
    begrunnelse: string;
    feilmelding: string;
    formkravGodkjent: boolean;
}

export const FormkravOppsummering: React.FC<IFormkravOppsummering> = ({
    oppfylt,
    muligOppfylt,
    formkravGodkjent,
    begrunnelse,
    feilmelding,
}) => {
    return (
        <FormkravOppsummeringStyled>
            <div>
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
                {formkravGodkjent ? (
                    <OppfyltStyled>
                        <BodyLong size="small">
                            {oppfylt} av {muligOppfylt} oppfylt
                        </BodyLong>
                        <Ikon>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Z"
                                fill="#007C2E"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="m17.047 7.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z"
                                fill="#fff"
                            />
                        </Ikon>
                    </OppfyltStyled>
                ) : (
                    <>
                        <BodyLong size="small">
                            {oppfylt} av {muligOppfylt} oppfylt
                        </BodyLong>
                        <FeilVedtaksresultatStyled>
                            <Alert variant="error" size="medium">
                                {feilmelding}
                            </Alert>
                        </FeilVedtaksresultatStyled>
                    </>
                )}
            </div>
            <BegrunnelseStyled>
                <Heading spacing size="medium" level="5">
                    Begrunnelse
                </Heading>
                <BodyLong size="small">{begrunnelse}</BodyLong>
            </BegrunnelseStyled>
        </FormkravOppsummeringStyled>
    );
};
