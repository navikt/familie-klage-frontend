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
    const { behandlingErRedigerbar, personopplysningerResponse: personopplysninger } =
        useBehandling();
    const { toggles } = useToggles();

    const [brevmottakere, settBrevmottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());

    async function hentBrevmottakere(): Promise<boolean> {
        settBrevmottakere(byggHenterRessurs());
        return await axiosRequest<Brevmottakere, null>({
            method: 'GET',
            url: `${API_BASE_URL}/${behandlingId}`,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottakere>) => {
            if (ressurs.status !== RessursStatus.SUKSESS) {
                settBrevmottakere(byggFeiletRessurs('Feil oppstod ved henting av brevmottakere.'));
                return Promise.resolve(false);
            }
            settBrevmottakere(ressurs);
            return Promise.resolve(true);
        });
    }

    async function opprettBrevmottaker(nyBrevmottaker: NyBrevmottaker): Promise<boolean> {
        return await axiosRequest<Brevmottakere, NyBrevmottaker>({
            url: `${API_BASE_URL}/${behandlingId}`,
            method: 'POST',
            data: nyBrevmottaker,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottakere>) => {
            if (ressurs.status !== RessursStatus.SUKSESS) {
                return Promise.resolve(false);
            }
            settBrevmottakere(ressurs);
            return Promise.resolve(true);
        });
    }

    async function slettBrevmottaker(slettbarBrevmottaker: SlettbarBrevmottaker): Promise<boolean> {
        return await axiosRequest<Brevmottakere, SlettbarBrevmottaker>({
            method: 'DELETE',
            url: `${API_BASE_URL}/${behandlingId}`,
            data: slettbarBrevmottaker,
        }).then((ressurs: RessursFeilet | RessursSuksess<Brevmottakere>) => {
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
                                behandlingId={behandlingId}
                                personopplysninger={personopplysninger}
                                brevmottakere={brevmottakerePersonUtenIdent}
                                opprettBrevmottaker={opprettBrevmottaker}
                                slettBrevmottaker={slettBrevmottaker}
                                erLesevisning={!behandlingErRedigerbar}
                            />
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
}
