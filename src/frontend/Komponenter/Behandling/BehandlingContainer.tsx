import * as React from 'react';
import { FC, useEffect } from 'react';
import { Høyremeny } from './Høyremeny/Høyremeny';
import styles from './BehandlingContainer.module.css';
import { Fanemeny } from './Fanemeny/Fanemeny';
import { BehandlingRoutes } from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import { Visittkort } from '../../Felles/Visittkort/Visittkort';
import { Behandling } from '../../App/typer/fagsak';
import { ScrollToTop } from '../../Felles/ScrollToTop/ScrollToTop';
import { DataViewer } from '../../Felles/DataViewer/DataViewer';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { SettPåVent } from './SettPåVent/SettPåVent';
import { EndreBehandlendeEnhetModal } from './EndreBehandlendeEnhet/EndreBehandlendeEnhetModal';
import { HenleggBehandlingModal } from './Henleggelse/HenleggBehandlingModal';
import { PersonopplysningerContextProvider } from '../../App/context/PersonopplysningerContext';

interface Props {
    behandling: Behandling;
}

export const BehandlingContainer: FC = () => (
    <BehandlingProvider>
        <BehandlingOverbygg />
    </BehandlingProvider>
);

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
