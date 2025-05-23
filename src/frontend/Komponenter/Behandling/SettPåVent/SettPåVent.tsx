import React, { FC, useCallback, useEffect, useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { styled } from 'styled-components';
import { Alert, Heading, HStack, Textarea, VStack } from '@navikt/ds-react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { IOppgave, Prioritet } from '../Typer/IOppgave';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { SaksbehandlerVelger } from './SaksbehandlerVelger';
import { PrioritetVelger } from './PrioritetVelger';
import { FristVelger } from './FristVelger';
import { EksisterendeBeskrivelse } from './EksisterendeBeskrivelse';
import { SettPåVentKnappValg } from './SettPåVentKnappValg';
import { MappeVelger } from './MappeVelger';
import { EToast } from '../../../App/typer/toast';
import ScrollToTop from '../../../Felles/ScrollToTop/ScrollToTop';

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
    mappe: number | undefined;
    beskrivelse: string;
    oppgaveVersjon?: number;
};

export const SettPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs<IOppgave>());
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    const [prioritet, settPrioritet] = useState<Prioritet | undefined>();
    const [frist, settFrist] = useState<string | undefined>();
    const [beskrivelse, settBeskrivelse] = useState('');
    const [mappe, settMappe] = useState<number | undefined>();

    const { hentBehandlingshistorikk } = useBehandling();

    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const erBehandlingPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;

    const { visSettPåVent, settVisSettPåVent, hentBehandling, hentAnsvarligSaksbehandler } =
        useBehandling();

    const { axiosRequest, settToast } = useApp();

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
            settMappe(oppgave.data.mappeId);
        }
    }, [oppgave]);

    useEffect(() => {
        if (visSettPåVent) {
            hentOppgaveForBehandling();
        }
    }, [visSettPåVent, hentOppgaveForBehandling]);

    const settPåVent = () => {
        const kanSettePåVent = prioritet && frist;

        if (låsKnapp || !kanSettePåVent) {
            return;
        }

        settLåsKnapp(true);

        if (oppgave.status !== RessursStatus.SUKSESS || !oppgave.data.oppgaveId) {
            settLåsKnapp(false);
            return;
        } else {
            settFeilmelding(undefined);
            axiosRequest<string, SettPåVentRequest>({
                method: 'POST',
                url: `/familie-klage/api/behandling/${behandling.id}/vent`,
                data: {
                    oppgaveId: oppgave.data.oppgaveId,
                    saksbehandler: saksbehandler,
                    prioritet: prioritet,
                    frist: frist,
                    mappe: mappe,
                    beskrivelse: beskrivelse,
                    oppgaveVersjon: oppgave.data.versjon,
                },
            })
                .then((respons: RessursFeilet | RessursSuksess<string>) => {
                    if (respons.status === RessursStatus.SUKSESS) {
                        hentBehandling.rerun();
                        nullstillOppgaveFelt();
                        settVisSettPåVent(false);
                        hentBehandlingshistorikk.rerun();
                        settToast(EToast.BEHANDLING_SATT_PÅ_VENT);
                    } else {
                        settFeilmelding(respons.frontendFeilmelding);
                    }
                })
                .finally(() => {
                    settLåsKnapp(false);
                });
        }
    };

    const taAvVent = () => {
        if (oppgave.status !== RessursStatus.SUKSESS) {
            return;
        } else {
            settFeilmelding(undefined);
            axiosRequest<string, SettPåVentRequest>({
                method: 'POST',
                url: `/familie-klage/api/behandling/${behandling.id}/ta-av-vent`,
            }).then((respons: RessursFeilet | RessursSuksess<string>) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    hentBehandlingshistorikk.rerun();
                    hentAnsvarligSaksbehandler.rerun();
                    settToast(EToast.BEHANDLING_TATT_AV_VENT);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            });
        }
    };

    const nullstillOppgaveFelt = () => {
        settSaksbehandler('');
        settPrioritet(undefined);
        settFrist(undefined);
        settMappe(undefined);
        settBeskrivelse('');
    };

    return visSettPåVent ? (
        <DataViewer response={{ oppgave }}>
            {({ oppgave }) => {
                return (
                    <StyledVStack gap="4">
                        {feilmelding && <Alert variant="error">{feilmelding}</Alert>}
                        <Heading size={'medium'}>
                            {erBehandlingPåVent
                                ? 'Behandling er på vent'
                                : 'Sett behandling på vent'}
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
                                frist={frist}
                                settFrist={settFrist}
                                erLesevisning={erBehandlingPåVent}
                            />
                            <MappeVelger
                                oppgaveEnhet={oppgave.tildeltEnhetsnr}
                                fagsystem={behandling.fagsystem}
                                settMappe={settMappe}
                                valgtMappe={mappe}
                                erLesevisning={erBehandlingPåVent}
                            />
                        </HStack>
                        <EksisterendeBeskrivelse beskrivelse={oppgave.beskrivelse} />
                        {!erBehandlingPåVent && (
                            <Beskrivelse
                                label={'Beskrivelse'}
                                size={'small'}
                                value={beskrivelse}
                                onChange={(e) => settBeskrivelse(e.target.value)}
                            />
                        )}
                        <SettPåVentKnappValg
                            settVisSettPåVent={settVisSettPåVent}
                            erBehandlingPåVent={erBehandlingPåVent}
                            taAvVent={taAvVent}
                            settPåVent={settPåVent}
                            låsKnapp={låsKnapp}
                        />
                        <ScrollToTop />
                    </StyledVStack>
                );
            }}
        </DataViewer>
    ) : null;
};
