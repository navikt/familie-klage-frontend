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

interface IÅrsak {
    settÅrsak: Dispatch<SetStateAction<any>>;
    årsakValg: Record<any, string>; // TODO bestem typer (Record<ÅrsakValg, string>)
}

export const Årsak: React.FC<IÅrsak> = ({ settÅrsak, årsakValg }) => {
    return (
        <ÅrsakStyled>
            <Heading spacing size="medium" level="5">
                Årsak
            </Heading>
            <ÅrsakInnholdStyled>
                <Select
                    label=""
                    size="medium"
                    onChange={(e) =>
                        settÅrsak((tidligereTilstand) => ({
                            ...tidligereTilstand,
                            årsak: e.target.value,
                        }))
                    }
                    hideLabel
                >
                    {Object.keys(årsakValg).map((valg) => (
                        <option value={valg}>{årsakValg[valg]}</option>
                    ))}
                </Select>
            </ÅrsakInnholdStyled>
        </ÅrsakStyled>
    );
};
