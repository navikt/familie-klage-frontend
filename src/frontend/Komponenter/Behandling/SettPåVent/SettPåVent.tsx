import {
    Button,
    DatePicker,
    Heading,
    HStack,
    List,
    Select,
    Textarea,
    useDatepicker,
    VStack,
} from '@navikt/ds-react';
import React, { FC } from 'react';
import { styled } from 'styled-components';

const StyledVStack = styled(VStack)`
    background-color: #e6f1f8;
    padding: 2rem;
`;

const SettPåVent: FC = () => {
    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: new Date('Aug 23 2019'),
        onDateChange: console.info,
    });

    return (
        <StyledVStack gap="4">
            <Heading size="medium">Sett behandling på vent</Heading>
            <HStack gap="4">
                <Select label="Saksbehandler" size="small">
                    <option>Saksbehandler</option>
                    <option value="høy">Høy</option>
                    <option value="medium">Medium</option>
                    <option value="lav">Lav</option>
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
            <List as="ul" title="Beskrivelsehistorikk">
                <List.Item>
                    --- 10.08.2022 10:05 System (H223456, 4489) --- Opprettet klagebehandling i ny
                    løsning
                </List.Item>
            </List>
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
