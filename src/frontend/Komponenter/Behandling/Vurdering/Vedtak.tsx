import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

const VedtakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const VedtakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IVedtak {
    settVedtak: Dispatch<SetStateAction<string>>;
    vedtakValg: Record<any, string>; // TODO bestem typer (Record<VedtakValg, string>)
}

export const Vedtak: React.FC<IVedtak> = ({ settVedtak, vedtakValg }) => {
    return (
        <VedtakStyled>
            <Heading spacing size="medium" level="5">
                Vedtak
            </Heading>
            <VedtakInnholdStyled>
                <Select
                    label=""
                    size="medium"
                    onChange={(e) => settVedtak(e.target.value)}
                    hideLabel
                >
                    <option value="">Velg</option>
                    {Object.keys(vedtakValg).map((valg) => (
                        <option value={valg}>{vedtakValg[valg]}</option>
                    ))}
                </Select>
            </VedtakInnholdStyled>
        </VedtakStyled>
    );
};
