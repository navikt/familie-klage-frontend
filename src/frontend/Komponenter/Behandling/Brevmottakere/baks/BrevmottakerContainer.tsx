import React, { useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../../App/typer/ressurs';
import { BrevmottakerModal } from './modal/BrevmottakerModal';
import { BrevmottakerPanel } from './panel/BrevmottakerPanel';
import { useOnMount } from '../../../../App/hooks/useOnMount';
import { Box, Skeleton } from '@navikt/ds-react';
import { Brevmottakere } from '../brevmottakere';
import { erBrevmottakerPersonUtenIdent } from '../brevmottaker';
import { NyBrevmottaker } from '../nyBrevmottaker';
import { SlettbarBrevmottaker } from '../slettbarBrevmottaker';
import { useToggles } from '../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../App/context/toggles';

const API_BASE_URL = `/familie-klage/api/brevmottaker`;

type Props = {
    behandlingId: string;
};

export function BrevmottakerContainer({ behandlingId }: Props) {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse: personopplysninger } = useBehandling();
    const { toggles } = useToggles();

    const [brevmottakere, settBrevmottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());

    async function hentBrevmottakere(): Promise<Awaited<void>> {
        settBrevmottakere(byggHenterRessurs());
        return await axiosRequest<Brevmottakere, null>({
            method: 'GET',
            url: `${API_BASE_URL}/${behandlingId}`,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottakere>) => {
            if (ressurs.status === RessursStatus.SUKSESS) {
                settBrevmottakere(ressurs);
                return Promise.resolve();
            } else {
                settBrevmottakere(byggFeiletRessurs(ressurs.frontendFeilmelding));
                return Promise.reject(new Error(ressurs.frontendFeilmelding));
            }
        });
    }

    async function opprettBrevmottaker(nyBrevmottaker: NyBrevmottaker): Promise<Awaited<void>> {
        return await axiosRequest<Brevmottakere, NyBrevmottaker>({
            url: `${API_BASE_URL}/${behandlingId}`,
            method: 'POST',
            data: nyBrevmottaker,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottakere>) => {
            if (ressurs.status === RessursStatus.SUKSESS) {
                settBrevmottakere(ressurs);
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(ressurs.frontendFeilmelding));
            }
        });
    }

    async function slettBrevmottaker(
        slettbarBrevmottaker: SlettbarBrevmottaker
    ): Promise<Awaited<void>> {
        return await axiosRequest<Brevmottakere, SlettbarBrevmottaker>({
            method: 'DELETE',
            url: `${API_BASE_URL}/${behandlingId}`,
            data: slettbarBrevmottaker,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottakere>) => {
            if (ressurs.status === RessursStatus.SUKSESS) {
                settBrevmottakere(ressurs);
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(ressurs.frontendFeilmelding));
            }
        });
    }

    useOnMount(() =>
        hentBrevmottakere().catch(() => {
            // Do nothing...
        })
    );

    if (brevmottakere.status === RessursStatus.HENTER) {
        return (
            <Box background={'surface-info-subtle'} width={'100%'}>
                <Skeleton
                    width={'100%'}
                    height={150}
                    variant={'rectangle'}
                    title={'Laster brevmottakere'}
                />
            </Box>
        );
    }

    return (
        <DataViewer response={{ brevmottakere, personopplysninger }}>
            {({ brevmottakere, personopplysninger }) => {
                const brevmottakerePersonUtenIdent = brevmottakere.personer.filter(
                    (brevmottakerPerson) => erBrevmottakerPersonUtenIdent(brevmottakerPerson)
                );
                return (
                    <>
                        <BrevmottakerPanel brevmottakere={brevmottakere} />
                        {toggles[ToggleName.leggTilBrevmottakerBaks] && (
                            <BrevmottakerModal
                                personopplysninger={personopplysninger}
                                brevmottakere={brevmottakerePersonUtenIdent}
                                opprettBrevmottaker={opprettBrevmottaker}
                                slettBrevmottaker={slettBrevmottaker}
                            />
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
}
