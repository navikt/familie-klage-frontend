import { Alert, BodyShort, Button, HStack, Label, Tooltip, VStack } from '@navikt/ds-react';
import type { AxiosRequestConfig } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import type { Ressurs } from '../../../../App/typer/ressurs';
import { byggTomRessurs } from '../../../../App/typer/ressurs';
import { DataViewer } from '../../../../Felles/DataViewer/DataViewer';
import type { Brevmottakere } from '../brevmottakere';
import { MottakerRolle } from '../mottakerRolle';
import { BrevmottakereModal } from './BrevmottakereModal';

interface Props {
    behandlingId: string;
    genererBrev: () => void;
}

export const BrevMottakere: React.FC<Props> = ({ behandlingId, genererBrev }) => {
    const { axiosRequest } = useApp();

    const [brevMottakere, settBrevMottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/brevmottaker/${behandlingId}`,
        };
        axiosRequest<Brevmottakere, null>(behandlingConfig).then((res: Ressurs<Brevmottakere>) =>
            settBrevMottakere(res)
        );
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer response={{ brevMottakere }}>
            {({ brevMottakere }) => (
                <>
                    <BrevMottakerPanel mottakere={brevMottakere} />
                    <BrevmottakereModal
                        behandlingId={behandlingId}
                        mottakere={brevMottakere}
                        hentBrevmottakere={hentBrevmottakere}
                        genererBrev={genererBrev}
                    />
                </>
            )}
        </DataViewer>
    );
};

const BrevMottakerPanel: React.FC<{
    mottakere: Brevmottakere;
}> = ({ mottakere }) => {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const utledNavnPåMottakere = (brevMottakere: Brevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                person => `${person.navn} (${person.mottakerRolle.toLowerCase()})`
            ),
            ...brevMottakere.organisasjoner.map(
                org => `${org.navnHosOrganisasjon} -(${org.organisasjonsnummer})`
            ),
        ];
    };

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const brukerErBrevmottaker = mottakere.personer.find(
        person => person.mottakerRolle === MottakerRolle.BRUKER
    );

    return flereBrevmottakereErValgt || !brukerErBrevmottaker ? (
        <Alert variant={'info'}>
            <VStack gap={'space-8'}>
                <HStack justify="space-between" style={{ margin: '0.25rem 0 0.25rem 0' }}>
                    <Label>Brevmottakere:</Label>
                    {behandlingErRedigerbar && (
                        <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                            <Button
                                variant={'tertiary'}
                                onClick={() => settVisBrevmottakereModal(true)}
                                style={{ padding: '0' }}
                            >
                                Legg til/endre brevmottakere
                            </Button>
                        </Tooltip>
                    )}
                </HStack>
                {navn.map((navn, index) => (
                    <BodyShort key={navn + index}>{navn}</BodyShort>
                ))}
            </VStack>
        </Alert>
    ) : (
        <HStack gap="space-16" align="center">
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map(navn => navn)}</BodyShort>
            {behandlingErRedigerbar && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <Button
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                        style={{ padding: '0' }}
                    >
                        Legg til/endre brevmottakere
                    </Button>
                </Tooltip>
            )}
        </HStack>
    );
};
