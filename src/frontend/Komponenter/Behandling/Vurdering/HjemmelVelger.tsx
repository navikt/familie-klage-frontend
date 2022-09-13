import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { Hjemmel, IVurdering } from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<IVurdering>>;
    hjemmelValgmuligheter: Record<string, string>;
    hjemmelValgt: Hjemmel;
    endring: (komponentId: string) => void;
}

export const HjemmelVelger: React.FC<IHjemmel> = ({
    settHjemmel,
    hjemmelValgmuligheter,
    hjemmelValgt,
    endring,
}) => {
    const { settVurderingEndret } = useBehandling();
    return (
        <HjemmelStyled>
            <Heading spacing size="medium" level="5">
                Hjemmel
            </Heading>
            <HjemmelInnholdStyled>
                <Select
                    value={hjemmelValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settHjemmel(
                            (tidligereTilstand: IVurdering) =>
                                ({
                                    ...tidligereTilstand,
                                    hjemmel: e.target.value,
                                } as IVurdering)
                        );
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(hjemmelValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {hjemmelValgmuligheter[valg]}
                        </option>
                    ))}
                </Select>
            </HjemmelInnholdStyled>
        </HjemmelStyled>
    );
};
