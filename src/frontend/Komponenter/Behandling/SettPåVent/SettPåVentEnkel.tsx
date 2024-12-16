import React, { FC, useCallback, useEffect, useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { styled } from 'styled-components';
import { Button, Heading, HStack, Textarea, VStack } from '@navikt/ds-react';
import { SaksbehandlerVelger } from './SaksbehandlerVelger';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { IOppgave, Prioritet } from './IOppgave';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { PrioritetVelger } from './PrioritetVelger';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { FristVelger } from './FristVelger';
import BeskrivelseHistorikk from './BeskrivelseHistorikk';
import { splitBeskrivelser } from './utils';

const StyledVStack = styled(VStack)`
    background-color: #e6f1f8;
    padding: 2rem;
`;

const Beskrivelse = styled(Textarea)`
    max-width: 60rem;
`;

type SettPåVentRequest = {
    oppgaveId: number;
    saksbehandler: string;
    prioritet: Prioritet;
    frist: string;
    beskrivelse: string;
};

export const SettPåVentEnkel: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs<IOppgave>());
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    const [prioritet, settPrioritet] = useState<Prioritet | undefined>();
    const [frist, settFrist] = useState<string | undefined>();
    const [beskrivelse, settBeskrivelse] = useState('');

    const erBehandlingPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;

    const { visSettPåVent, settVisSettPåVent, hentBehandling } = useBehandling();

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

    const settPåVent = () => {
        const kanSettePåVent = prioritet && frist;

        if (!kanSettePåVent) {
            return;
        }

        if (oppgave.status !== RessursStatus.SUKSESS || !oppgave.data.oppgaveId) {
            // TODO: Noe feilmelding og error håndtering.
            return;
        } else {
            axiosRequest<string, SettPåVentRequest>({
                method: 'POST',
                url: `/familie-klage/api/behandling/${behandling.id}/vent`,
                data: {
                    oppgaveId: oppgave.data.oppgaveId,
                    saksbehandler: saksbehandler,
                    prioritet: prioritet,
                    frist: frist,
                    beskrivelse: beskrivelse,
                },
            })
                .then((respons: RessursFeilet | RessursSuksess<string>) => {
                    if (respons.status === RessursStatus.SUKSESS) {
                        console.log('HEI! Det funket, woohoo!');
                        hentBehandling.rerun();
                        settVisSettPåVent(false);
                    } else {
                        // TODO: Noe feilet, gjør noe med feilen.
                    }
                })
                .finally(() => {
                    // TODO: Noe låsknapp greier.
                });
        }
    };

    const taAvVent = () => {
        if (oppgave.status !== RessursStatus.SUKSESS) {
            return;
        } else {
            axiosRequest<string, SettPåVentRequest>({
                method: 'POST',
                url: `/familie-klage/api/behandling/${behandling.id}/ta-av-vent`,
            }).then((respons: RessursFeilet | RessursSuksess<string>) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    nullstillOppgaveFelt();
                }
            });
        }
    };

    const nullstillOppgaveFelt = () => {
        settSaksbehandler('');
        settPrioritet(undefined);
        settFrist(undefined);
        settBeskrivelse('');
    };

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
                        <BeskrivelseHistorikk
                            beskrivelser={
                                oppgave.beskrivelse ? splitBeskrivelser(oppgave?.beskrivelse) : [] // TODO: Kanskje fikse dette idk.
                            }
                        />
                        {!erBehandlingPåVent && (
                            <Beskrivelse
                                label={'Beskrivelse'}
                                size={'small'}
                                value={beskrivelse}
                                onChange={(e) => settBeskrivelse(e.target.value)}
                            />
                        )}

                        {/*TODO: Flytt inn, kanskje lag komponent.*/}
                        <HStack justify="end" gap="4">
                            <Button
                                onClick={() => settVisSettPåVent(false)}
                                variant="tertiary"
                                size="small"
                            >
                                Avbryt
                            </Button>
                            {erBehandlingPåVent ? (
                                <Button onClick={taAvVent} variant="primary" size="small">
                                    Ta av vent
                                </Button>
                            ) : (
                                <Button onClick={settPåVent} variant="primary" size="small">
                                    Sett på vent
                                </Button>
                            )}
                        </HStack>
                    </StyledVStack>
                );
            }}
        </DataViewer>
    ) : null;
};
