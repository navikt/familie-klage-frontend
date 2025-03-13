import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { IVurdering, ÅrsakOmgjøring, årsakValgTilTekst } from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';

const ÅrsakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const ÅrsakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IÅrsak {
    settÅrsak: Dispatch<SetStateAction<IVurdering>>;
    årsakValgt?: ÅrsakOmgjøring;
    årsakValgmuligheter: ÅrsakOmgjøring[];
    endring: (komponentId: string) => void;
}

export const Årsak: React.FC<IÅrsak> = ({
    settÅrsak,
    årsakValgt,
    årsakValgmuligheter,
    endring,
}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { settVurderingEndret } = useBehandling();
    return (
        <ÅrsakStyled>
            <Heading spacing size="medium" level="5">
                Årsak
            </Heading>
            <ÅrsakInnholdStyled>
                <Select
                    value={årsakValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settÅrsak(
                            (tidligereTilstand: IVurdering) =>
                                ({
                                    ...tidligereTilstand,
                                    årsak: e.target.value,
                                }) as IVurdering
                        );
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.values(årsakValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {årsakValgTilTekst[valg]}
                        </option>
                    ))}
                </Select>
            </ÅrsakInnholdStyled>
        </ÅrsakStyled>
    );
};
