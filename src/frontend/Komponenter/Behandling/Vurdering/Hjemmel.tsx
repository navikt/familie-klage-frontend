import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { HjemmelValg, IVurdering } from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<any>>;
    hjemmelValgmuligheter: Record<string, string>;
    hjemmelValgt: HjemmelValg;
    endring: (komponentId: string) => void;
}

export const Hjemmel: React.FC<IHjemmel> = ({
    settHjemmel,
    hjemmelValgmuligheter,
    hjemmelValgt,
    endring,
}) => {
    const { settVurderingEndret, settBrevSteg, settResultatSteg } = useBehandling();
    return (
        <HjemmelStyled>
            <Heading spacing size="medium" level="5">
                Hjemmel
            </Heading>
            <HjemmelInnholdStyled>
                <Select
                    defaultValue={HjemmelValg.VELG}
                    value={hjemmelValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        settBrevSteg(false);
                        settResultatSteg(false);
                        endring(e.target.value);
                        settHjemmel((tidligereTilstand: IVurdering) => ({
                            ...tidligereTilstand,
                            hjemmel: e.target.value,
                        }));
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
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
