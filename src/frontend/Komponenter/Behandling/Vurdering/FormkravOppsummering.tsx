import * as React from 'react';
import { BodyLong, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ikon } from './Ikon';
import { IFormkravVilkår, VilkårStatus } from '../Formkrav/typer';

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

interface IFormkravOppsummering {
    formkrav: IFormkravVilkår;
    alleVilkårOppfylt: boolean;
}

export const FormkravOppsummering: React.FC<IFormkravOppsummering> = ({
    formkrav,
    alleVilkårOppfylt,
}) => {
    const formkravStatuser = [
        formkrav.klagePart,
        formkrav.klageKonkret,
        formkrav.klageSignert,
        formkrav.klagefristOverholdt,
    ];
    const antallOppfylt = formkravStatuser.filter(
        (formkravstatus) => formkravstatus === VilkårStatus.OPPFYLT
    ).length;
    return (
        <FormkravOppsummeringStyled>
            <div>
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
                {alleVilkårOppfylt && (
                    <OppfyltStyled>
                        <BodyLong size="small">
                            {antallOppfylt} av {formkravStatuser.length} oppfylt
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
                )}
                {!alleVilkårOppfylt && (
                    <>
                        <BodyLong size="small">
                            {antallOppfylt} av {formkravStatuser.length} oppfylt
                        </BodyLong>
                    </>
                )}
            </div>
            <BegrunnelseStyled>
                <Heading spacing size="medium" level="5">
                    Begrunnelse
                </Heading>
                <BodyLong size="small">{formkrav.saksbehandlerBegrunnelse}</BodyLong>
            </BegrunnelseStyled>
        </FormkravOppsummeringStyled>
    );
};
