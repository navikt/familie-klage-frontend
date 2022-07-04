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
    årsakValg: Record<any, string>;
    endring: (komponentId: string) => void;
}

export const Årsak: React.FC<IÅrsak> = ({ settÅrsak, årsakValg, endring }) => {
    return (
        <ÅrsakStyled>
            <Heading spacing size="medium" level="5">
                Årsak
            </Heading>
            <ÅrsakInnholdStyled>
                <Select
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settÅrsak((tidligereTilstand) => ({
                            ...tidligereTilstand,
                            arsak: e.target.value,
                        }));
                    }}
                    hideLabel
                >
                    {Object.keys(årsakValg).map((valg, index) => (
                        <option value={valg} key={index}>
                            {årsakValg[valg]}
                        </option>
                    ))}
                </Select>
            </ÅrsakInnholdStyled>
        </ÅrsakStyled>
    );
};
