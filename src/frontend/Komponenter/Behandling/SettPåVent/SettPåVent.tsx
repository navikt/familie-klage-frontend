import {
    Button,
    DatePicker,
    Heading,
    HStack,
    Select,
    Textarea,
    useDatepicker,
    VStack,
} from '@navikt/ds-react';
import React, { FC } from 'react';
import { styled } from 'styled-components';
import BeskrivelseHistorikk from './BeskrivelseHistorikk';
import { splitBeskrivelser } from './utils';

const StyledVStack = styled(VStack)`
    background-color: #e6f1f8;
    padding: 2rem;
`;

// TODO: Denne verdien må settes til dagens dato. Hentes gjennom state. Kan settes frem og tilbake i tid.
const SettPåVent: FC = () => {
    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: new Date('Aug 23 2019'),
        onDateChange: console.info,
    });

    const beskrivelser = splitBeskrivelser(
        '--- 06.12.2024 10:39 F_Z994431 E_Z994431 (Z994431) ---\nfghgh\n\n--- 06.12.2024 10:36 F_Z994431 E_Z994431 (Z994431) ---\nrtrrwwe\n\n--- 06.12.2024 10:30 F_Z994431 E_Z994431 (Z994431) ---\n4394320483203\n\n--- 06.12.2024 10:30 F_Z994431 E_Z994431 (Z994431) ---\n3494384302\n\n--- 04.12.2024 15:04 F_Z994431 E_Z994431 (Z994431) ---\nOppgave endret frist fra 2024-11-06 til 2024-08-01\n\n--- 04.12.2024 15:04 F_Z994431 E_Z994431 (Z994431) ---\njhhkk\n\n--- 04.12.2024 13:49 F_Z994431 E_Z994431 (Z994431) ---\nOppgave endret frist fra 2024-12-05 til 2024-11-06\n\n--- 04.12.2024 10:51 F_Z994431 E_Z994431 (Z994431) ---\n34344342343\n\n--- 04.12.2024 10:50 (familie-ef-sak) --- \nRevurdering i ny løsning'
    );

    return (
        <StyledVStack gap="4">
            <Heading size="medium">Sett behandling på vent</Heading>
            <HStack gap="4">
                <Select label="Saksbehandler" size="small">
                    <option>Saksbehandler</option>
                </Select>
                <Select label="Prioritet" size="small">
                    <option>Prioritet</option>
                    <option value="høy">Høy</option>
                    <option value="medium">Medium</option>
                    <option value="lav">Lav</option>
                </Select>
                <DatePicker {...datepickerProps}>
                    <DatePicker.Input {...inputProps} label="Velg dato" size="small" />
                </DatePicker>
                <Select label="Mappe" size="small">
                    <option>Mappe</option>
                    <option value="norge">Norge</option>
                    <option value="sverige">Sverige</option>
                    <option value="danmark">Danmark</option>
                </Select>
            </HStack>
            {beskrivelser.length > 0 && <BeskrivelseHistorikk beskrivelser={beskrivelser} />}
            <Textarea label="Beskrivelse" />
            <HStack justify="end" gap="4">
                <Button variant="tertiary" size="small">
                    Avbryt
                </Button>
                <Button variant="primary" size="small">
                    Sett på vent
                </Button>
            </HStack>
        </StyledVStack>
    );
};

export default SettPåVent;
