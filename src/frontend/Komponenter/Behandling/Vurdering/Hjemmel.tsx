import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<any>>;
    hjemmelValg: Record<any, string>; // TODO bestem typer (Record<HjemmelValg, string>)
}

export const Hjemmel: React.FC<IHjemmel> = ({ settHjemmel, hjemmelValg }) => {
    return (
        <HjemmelStyled>
            <Heading spacing size="medium" level="5">
                Hjemmel
            </Heading>
            <HjemmelInnholdStyled>
                <Select
                    label=""
                    size="medium"
                    onChange={(e) =>
                        settHjemmel((tidligereTilstand) => ({
                            ...tidligereTilstand,
                            hjemmel: e.target.value,
                        }))
                    }
                    hideLabel
                >
                    {Object.keys(hjemmelValg).map((valg, index) => (
                        <option value={valg} key={index}>
                            {hjemmelValg[valg]}
                        </option>
                    ))}
                </Select>
            </HjemmelInnholdStyled>
        </HjemmelStyled>
    );
};
