import React, { FC, useState } from 'react';
import { Button, List } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { styled } from 'styled-components';

const StyledButton = styled(Button)`
    width: fit-content;
`;

const BeskrivelseHistorikk: FC<{ beskrivelser: string[] }> = ({ beskrivelser }) => {
    const [visAlleBeskrivelser, setVisAlleBeskrivelser] = useState(false);

    const toggleVisAlleBeskrivelser = () => {
        setVisAlleBeskrivelser(!visAlleBeskrivelser);
    };

    const visteBeskrivelser = visAlleBeskrivelser ? beskrivelser : beskrivelser.slice(0, 4);

    return (
        <>
            <List as="ul" title="Beskrivelsehistorikk">
                {visteBeskrivelser.map((beskrivelse, index) => (
                    <List.Item key={index}>{beskrivelse}</List.Item>
                ))}
            </List>
            {beskrivelser.length > 4 && (
                <StyledButton
                    icon={visAlleBeskrivelser ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    variant="tertiary"
                    size="xsmall"
                    onClick={toggleVisAlleBeskrivelser}
                >
                    {visAlleBeskrivelser ? 'Skjul beskrivelsen' : 'Se hele beskrivelsen'}
                </StyledButton>
            )}
        </>
    );
};

export default BeskrivelseHistorikk;
