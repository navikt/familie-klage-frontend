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
import React, { FC, useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import BeskrivelseHistorikk from './BeskrivelseHistorikk';
import { splitBeskrivelser } from './utils';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { IOppgave } from './IOppgave';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';

const StyledVStack = styled(VStack)`
    background-color: #e6f1f8;
    padding: 2rem;
`;

// TODO: Denne verdien må settes til dagens dato. Hentes gjennom state. Kan settes frem og tilbake i tid.
const SettPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    saksbehandler;

    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: new Date('Aug 23 2019'),
        onDateChange: console.info,
    });

    // const erBehandlingPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;

    const beskrivelser = splitBeskrivelser(
        '--- 06.12.2024 10:39 F_Z994431 E_Z994431 (Z994431) ---\nfghgh\n\n--- 06.12.2024 10:36 F_Z994431 E_Z994431 (Z994431) ---\nrtrrwwe\n\n--- 06.12.2024 10:30 F_Z994431 E_Z994431 (Z994431) ---\n4394320483203\n\n--- 06.12.2024 10:30 F_Z994431 E_Z994431 (Z994431) ---\n3494384302\n\n--- 04.12.2024 15:04 F_Z994431 E_Z994431 (Z994431) ---\nOppgave endret frist fra 2024-11-06 til 2024-08-01\n\n--- 04.12.2024 15:04 F_Z994431 E_Z994431 (Z994431) ---\njhhkk\n\n--- 04.12.2024 13:49 F_Z994431 E_Z994431 (Z994431) ---\nOppgave endret frist fra 2024-12-05 til 2024-11-06\n\n--- 04.12.2024 10:51 F_Z994431 E_Z994431 (Z994431) ---\n34344342343\n\n--- 04.12.2024 10:50 (familie-ef-sak) --- \nRevurdering i ny løsning'
    );

    const { axiosRequest } = useApp();

    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs<IOppgave>());

    const { visSettPåVent } = useBehandling();

    const hentOppgaveForBehandling = useCallback(() => {
        axiosRequest<IOppgave, null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandling.id}/oppgave`,
        }).then(settOppgave);
    }, [behandling.id, axiosRequest]);

    useEffect(() => {
        if (oppgave.status === RessursStatus.SUKSESS) {
            settSaksbehandler(oppgave.data.tilordnetRessurs || '');
        }
    }, [oppgave]);

    useEffect(() => {
        hentOppgaveForBehandling();
    }, [visSettPåVent, hentOppgaveForBehandling]);

    return (
        <StyledVStack gap="4">
            <Heading size="medium">Sett behandling på vent</Heading>
            <HStack gap="4">
                <Select label="" size="small">
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
