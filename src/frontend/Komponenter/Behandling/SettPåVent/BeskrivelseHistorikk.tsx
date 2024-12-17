import React, { FC, useState } from 'react';
import { Button, List } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { styled } from 'styled-components';

const StyledButton = styled(Button)`
    width: fit-content;
`;

export interface BeskrivelseHistorikkInnslag {
    endringDato: string;
    endringDetaljer: string[];
}

const BeskrivelseHistorikk: FC<{ beskrivelser: BeskrivelseHistorikkInnslag[] }> = ({
    beskrivelser,
}) => {
    const [visAlleBeskrivelser, setVisAlleBeskrivelser] = useState(false);

    const toggleVisAlleBeskrivelser = () => {
        setVisAlleBeskrivelser(!visAlleBeskrivelser);
    };

    const visteBeskrivelser = visAlleBeskrivelser ? beskrivelser : beskrivelser.slice(0, 4);

    return (
        <>
            {beskrivelser.length > 0 && (
                <List as="ul" title="Beskrivelsehistorikk" size="small">
                    {visteBeskrivelser.map((beskrivelse, index) => (
                        <List.Item key={index}>
                            <strong>{beskrivelse.endringDato}</strong>
                            <ul>
                                {beskrivelse.endringDetaljer.map((detail, detailIndex) => (
                                    <li key={detailIndex}>{detail}</li>
                                ))}
                            </ul>
                        </List.Item>
                    ))}
                </List>
            )}
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
