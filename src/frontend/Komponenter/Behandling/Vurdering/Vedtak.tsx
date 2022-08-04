import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { HjemmelValg, IVurdering, VedtakValg, ÅrsakValg } from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';

const VedtakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const VedtakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IVedtak {
    settVedtak: Dispatch<SetStateAction<IVurdering>>;
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
    const oppdaterVedtak = (nyttValg: string) => {
        settVedtak(
            (tidligereTilstand: IVurdering) =>
                ({
                    ...tidligereTilstand,
                    vedtak: nyttValg,
                    arsak: ÅrsakValg.VELG,
                    hjemmel: HjemmelValg.VELG,
                } as IVurdering)
        );
    };

    const { settVurderingEndret } = useBehandling();
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
                        endring(e.target.value);
                        oppdaterVedtak(e.target.value);
                        settVurderingEndret(true);
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
