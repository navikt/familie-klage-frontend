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
import { Brevmottaker } from './brevmottaker';
import { OpprettBrevmottakerDto } from './opprettBrevmottakerDto';
import { useOnMount } from '../../../../App/hooks/useOnMount';
import { Box, Skeleton } from '@navikt/ds-react';

const API_BASE_URL = `/familie-klage/api/brevmottaker`;

type Props = {
    behandlingId: string;
};

export function BrevmottakerContainer({ behandlingId }: Props) {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse: personopplysninger } = useBehandling();
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<Brevmottaker[]>>(byggTomRessurs());

    async function hentBrevmottakere(): Promise<boolean> {
        // TODO : Dette kan gjøres bedre med react-query
        settBrevmottakere(byggHenterRessurs());
        return await axiosRequest<Brevmottaker[], null>({
            method: 'GET',
            url: `${API_BASE_URL}/${behandlingId}`,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottaker[]>) => {
            if (ressurs.status !== RessursStatus.SUKSESS) {
                settBrevmottakere(byggFeiletRessurs('Feil oppstod ved henting av brevmottakere.'));
                return Promise.resolve(false);
            }
            settBrevmottakere(ressurs);
            return Promise.resolve(true);
        });
    }

    async function opprettBrevmottaker(
        opprettBrevmottakerDto: OpprettBrevmottakerDto
    ): Promise<boolean> {
        // TODO : Dette kan gjøres bedre med react-query
        return await axiosRequest<Brevmottaker[], OpprettBrevmottakerDto>({
            url: `${API_BASE_URL}/${behandlingId}`,
            method: 'POST',
            data: opprettBrevmottakerDto,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottaker[]>) => {
            if (ressurs.status !== RessursStatus.SUKSESS) {
                return Promise.resolve(false);
            }
            settBrevmottakere(ressurs);
            return Promise.resolve(true);
        });
    }

    async function slettBrevmottakere(brevmottakerId: string): Promise<boolean> {
        // TODO : Dette kan gjøres bedre med react-query
        return await axiosRequest<Brevmottaker[], null>({
            method: 'DELETE',
            url: `${API_BASE_URL}/${behandlingId}/${brevmottakerId}`,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottaker[]>) => {
            if (ressurs.status !== RessursStatus.SUKSESS) {
                return Promise.resolve(false);
            }
            settBrevmottakere(ressurs);
            return Promise.resolve(true);
        });
    }

    useOnMount(() => hentBrevmottakere());

    if (brevmottakere.status === RessursStatus.HENTER) {
        return (
            <Box background={'surface-info-subtle'} width={'100%'} maxWidth={'1000px'}>
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
            {({ brevmottakere, personopplysninger }) => (
                <>
                    <BrevmottakerPanel brevmottakere={brevmottakere} />
                    <BrevmottakerModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        brevmottakere={brevmottakere}
                        opprettBrevmottaker={opprettBrevmottaker}
                        slettBrevmottaker={slettBrevmottakere}
                        erLesevisning={false}
                    />
                </>
            )}
        </DataViewer>
    );
}
