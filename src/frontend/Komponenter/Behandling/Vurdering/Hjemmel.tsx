import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

const ÅrsakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const ÅrsakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<any>>;
    hjemmelValg: Record<any, string>; // TODO bestem typer (Record<HjemmelValg, string>)
}

export const Hjemmel: React.FC<IHjemmel> = ({ settHjemmel, hjemmelValg }) => {
    return (
        <ÅrsakStyled>
            <Heading spacing size="medium" level="5">
                Hjemmel
            </Heading>
            <ÅrsakInnholdStyled>
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
                    {Object.keys(hjemmelValg).map((valg) => (
                        <option value={valg}>{hjemmelValg[valg]}</option>
                    ))}
                </Select>
            </ÅrsakInnholdStyled>
        </ÅrsakStyled>
    );
};
