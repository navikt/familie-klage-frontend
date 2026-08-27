import { Alert } from '@navikt/ds-react';
import type { FC } from 'react';
import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import {
    PersonopplysningerContextProvider,
    usePersonopplysningerContext,
} from '../../App/context/PersonopplysningerContext';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import type { Behandling } from '../../App/typer/fagsak';
import { DataViewer } from '../../Felles/DataViewer/DataViewer';
import { ScrollToTop } from '../../Felles/ScrollToTop/ScrollToTop';
import { Visittkort } from '../../Felles/Visittkort/Visittkort';
import styles from './BehandlingContainer.module.css';
import { BehandlingRoutes } from './BehandlingRoutes';
import { EndreBehandlendeEnhetModal } from './EndreBehandlendeEnhet/EndreBehandlendeEnhetModal';
import { Fanemeny } from './Fanemeny/Fanemeny';
import { HenleggBehandlingModal } from './Henleggelse/HenleggBehandlingModal';
import { Høyremeny } from './Høyremeny/Høyremeny';
import { SettPåVent } from './SettPåVent/SettPåVent';

interface Props {
    behandling: Behandling;
}

export const BehandlingContainer: FC = () => {
    const behandlingId = useParams<{ behandlingId: string }>().behandlingId as string;
    return (
        <BehandlingProvider key={behandlingId}>
            <BehandlingOverbygg />
        </BehandlingProvider>
    );
};

const BehandlingOverbygg: FC = () => {
    const { personopplysningerResponse, behandling } = useBehandling();

    useEffect(() => {
        document.title = 'Klagebehandling';
    }, []);

    return (
        <DataViewer response={{ behandling, personopplysningerResponse }}>
            {({ behandling, personopplysningerResponse }) => (
                <PersonopplysningerContextProvider personopplysninger={personopplysningerResponse}>
                    <BehandlingContent behandling={behandling} />
                </PersonopplysningerContextProvider>
            )}
        </DataViewer>
    );
};

const BehandlingContent: FC<Props> = ({ behandling }) => {
    const { åpenHøyremeny } = useBehandling();
    const { fagsakEier } = usePersonopplysningerContext();

    useSetValgtFagsakId(behandling.fagsakId);

    const classNameBehandlingContainer = åpenHøyremeny
        ? styles.behandlingÅpenHøyremeny
        : styles.behandlingLukketHøyremeny;

    const classNameHøyremenyContainer = åpenHøyremeny
        ? styles.åpenHøyremeny
        : styles.lukketHøyremeny;

    return (
        <>
            <ScrollToTop />
            <Visittkort behandling={behandling} />
            <div className={styles.container}>
                <div className={classNameBehandlingContainer} id="scroll-topp">
                    <Fanemeny behandling={behandling} />
                    {!fagsakEier.harFullmaktTilgang && (
                        <Alert variant={'warning'} style={{ marginBottom: '1rem' }}>
                            Har ikke tilgang til å hente fullmaktopplysninger for denne personen.
                        </Alert>
                    )}
                    <SettPåVent behandling={behandling} />
                    <EndreBehandlendeEnhetModal behandling={behandling} />
                    <BehandlingRoutes behandling={behandling} />
                    <HenleggBehandlingModal behandling={behandling} />
                </div>
                <div className={classNameHøyremenyContainer}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandling={behandling} />
                </div>
            </div>
        </>
    );
};
