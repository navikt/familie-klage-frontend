import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { HjemmelValg, IVurdering, VedtakValg, ÅrsakValg } from './vurderingValg';

const VedtakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const VedtakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IVedtak {
    settVedtak: Dispatch<SetStateAction<any>>;
    vedtakValgt: VedtakValg;
    vedtakValgmuligheter: Record<string, string>;
    endring: (komponentId: string) => void;
}

export const Vedtak: React.FC<IVedtak> = ({
    settVedtak,
    vedtakValgt,
    vedtakValgmuligheter,
    endring,
}) => {
    return (
        <VedtakStyled>
            <Heading spacing size="medium" level="5">
                Vedtak
            </Heading>
            <VedtakInnholdStyled>
                <Select
                    value={vedtakValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        console.log(e.target.value);
                        endring(e.target.value);
                        settVedtak((tidligereTilstand: IVurdering) => ({
                            ...tidligereTilstand,
                            vedtak: e.target.value,
                        }));
                    }}
                    hideLabel
                >
                    {Object.keys(vedtakValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {vedtakValgmuligheter[valg]}
                        </option>
                    ))}
                </Select>
            </VedtakInnholdStyled>
        </VedtakStyled>
    );
};
