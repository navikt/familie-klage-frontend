import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { HjemmelValg, IVurdering, ÅrsakValg } from './vurderingValg';

const VedtakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const VedtakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IVedtak {
    settVedtak: Dispatch<SetStateAction<any>>;
    vedtakValg: Record<string, string>;
    endring: (komponentId: string) => void;
}

export const Vedtak: React.FC<IVedtak> = ({ settVedtak, vedtakValg, endring }) => {
    const oppdaterVedtak = (nyttValg: string) => {
        settVedtak((tidligereTilstand: IVurdering) => ({
            ...tidligereTilstand,
            vedtak: nyttValg,
            arsak: ÅrsakValg.VELG,
            hjemmel: HjemmelValg.VELG,
        }));
    };

    return (
        <VedtakStyled>
            <Heading spacing size="medium" level="5">
                Vedtak
            </Heading>
            <VedtakInnholdStyled>
                <Select
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        oppdaterVedtak(e.target.value);
                    }}
                    hideLabel
                >
                    {Object.keys(vedtakValg).map((valg, index) => (
                        <option value={valg} key={index}>
                            {vedtakValg[valg]}
                        </option>
                    ))}
                </Select>
            </VedtakInnholdStyled>
        </VedtakStyled>
    );
};
