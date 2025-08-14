import React, { useCallback, useEffect, useState } from 'react';
import styles from './BrevMottakere.module.css';
import { useApp } from '../../../../App/context/AppContext';
import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';
import { Brevmottakere } from '../brevmottakere';
import { DataViewer } from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { BrevmottakereModal } from './BrevmottakereModal';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { MottakerRolle } from '../mottakerRolle';

interface Props {
    behandlingId: string;
}

export const BrevMottakere: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse } = useBehandling();

    const [mottakere, settMottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-klage/api/brevmottaker/${behandlingId}`,
        };
        axiosRequest<Brevmottakere, null>(behandlingConfig).then((res: Ressurs<Brevmottakere>) =>
            settMottakere(res)
        );
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer response={{ mottakere, personopplysningerResponse }}>
            {({ mottakere, personopplysningerResponse }) => (
                <>
                    <BrevMottakereContainer mottakere={mottakere} />
                    <BrevmottakereModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysningerResponse}
                        mottakere={mottakere}
                        kallHentBrevmottakere={hentBrevmottakere}
                    />
                </>
            )}
        </DataViewer>
    );
};

const BrevMottakereContainer: React.FC<{
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
                (org) =>
                    `${org.navnHosOrganisasjon} - ${org.organisasjonsnavn} (${org.organisasjonsnummer})`
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
        <div className={styles.grid}>
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
        </div>
    );
};
