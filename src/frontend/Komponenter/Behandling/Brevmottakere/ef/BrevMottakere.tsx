import React, { useCallback, useEffect, useState } from 'react';
import styles from './BrevMottakere.module.css';
import { useApp } from '../../../../App/context/AppContext';
import { Alert, BodyShort, Button, HStack, Label, Tooltip } from '@navikt/ds-react';
import { Brevmottakere } from '../brevmottakere';
import { DataViewer } from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { BrevmottakereModal } from './BrevmottakereModal';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { MottakerRolle } from '../mottakerRolle';
import { AxiosRequestConfig } from 'axios';

interface Props {
    behandlingId: string;
    genererBrev: () => void;
}

export const BrevMottakere: React.FC<Props> = ({ behandlingId, genererBrev }) => {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse } = useBehandling();

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
        <DataViewer response={{ personopplysningerResponse, brevMottakere }}>
            {({ personopplysningerResponse, brevMottakere }) => (
                <>
                    <BrevMottakerPanel mottakere={brevMottakere} />
                    <BrevmottakereModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysningerResponse}
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
                (person) => `${person.navn} (${person.mottakerRolle.toLowerCase()})`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) => `${org.navnHosOrganisasjon} -(${org.organisasjonsnummer})`
            ),
        ];
    };

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const brukerErBrevmottaker = mottakere.personer.find(
        (person) => person.mottakerRolle === MottakerRolle.BRUKER
    );

    return flereBrevmottakereErValgt || !brukerErBrevmottaker ? (
        <Alert variant={'info'}>
            <div className={styles.informasjonHeader}>
                <Label>Brevmottakere:</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <Button
                            className={styles.button}
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/endre brevmottakere
                        </Button>
                    </Tooltip>
                )}
            </div>
            <ul>
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    ) : (
        <HStack gap="4" align="center">
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            {behandlingErRedigerbar && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <Button
                        className={styles.button}
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                    >
                        Legg til/endre brevmottakere
                    </Button>
                </Tooltip>
            )}
        </HStack>
    );
};
