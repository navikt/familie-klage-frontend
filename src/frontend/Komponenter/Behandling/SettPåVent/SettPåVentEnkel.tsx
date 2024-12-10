import React, { FC, useCallback, useEffect, useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { styled } from 'styled-components';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { SaksbehandlerVelger } from './SaksbehandlerVelger';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IOppgave, Prioritet } from './IOppgave';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { PrioritetVelger } from './PrioritetVelger';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { FristVelger } from './FristVelger';

const StyledVStack = styled(VStack)`
    background-color: #e6f1f8;
    padding: 2rem;
`;

export const SettPåVentEnkel: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs<IOppgave>());
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    const [prioritet, settPrioritet] = useState<Prioritet | undefined>();
    const [frist, settFrist] = useState<string | undefined>();
    frist;

    const erBehandlingPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;

    const { visSettPåVent, settVisSettPåVent } = useBehandling();

    const { axiosRequest } = useApp();

    const hentOppgaveForBehandling = useCallback(() => {
        axiosRequest<IOppgave, null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/${behandling.id}/oppgave`,
        }).then(settOppgave);
    }, [behandling.id, axiosRequest]);

    useEffect(() => {
        if (oppgave.status === RessursStatus.SUKSESS) {
            settSaksbehandler(oppgave.data.tilordnetRessurs || '');
            settPrioritet(oppgave.data.prioritet || 'NORM');
            settFrist(oppgave.data.fristFerdigstillelse);
        }
    }, [oppgave]);

    useEffect(() => {
        if (visSettPåVent) {
            hentOppgaveForBehandling();
        }
    }, [visSettPåVent, hentOppgaveForBehandling]);

    return visSettPåVent ? (
        <DataViewer response={{ oppgave }}>
            {({ oppgave }) => {
                return (
                    <StyledVStack gap="4">
                        <Heading size={'medium'}>
                            {erBehandlingPåVent ? 'Behandling på vent' : 'Sett behandling på vent'}
                        </Heading>
                        <HStack gap="4">
                            <SaksbehandlerVelger
                                oppgave={oppgave}
                                saksbehandler={saksbehandler}
                                settSaksbehandler={settSaksbehandler}
                                erLesevisning={erBehandlingPåVent}
                            />
                            <PrioritetVelger
                                prioritet={prioritet}
                                settPrioritet={settPrioritet}
                                erLesevisning={erBehandlingPåVent}
                            />
                            <FristVelger
                                oppgave={oppgave}
                                settFrist={settFrist}
                                erLesevisning={erBehandlingPåVent}
                            />
                        </HStack>
                        <HStack justify="end" gap="4">
                            <Button
                                onClick={() => settVisSettPåVent(false)}
                                variant="tertiary"
                                size="small"
                            >
                                Avbryt
                            </Button>
                            <Button variant="primary" size="small">
                                Sett på vent
                            </Button>
                        </HStack>
                    </StyledVStack>
                );
            }}
        </DataViewer>
    ) : null;
};
