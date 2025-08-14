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
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { DataViewer } from '../../Felles/DataViewer/DataViewer';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { SettPåVent } from './SettPåVent/SettPåVent';
import { EndreBehandlendeEnhetModal } from './EndreBehandlendeEnhet/EndreBehandlendeEnhetModal';
import { HenleggBehandlingModal } from './Henleggelse/HenleggBehandlingModal';

interface Props {
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
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
                <BehandlingContent
                    behandling={behandling}
                    personopplysninger={personopplysningerResponse}
                />
            )}
        </DataViewer>
    );
};

const BehandlingContent: FC<Props> = ({ behandling, personopplysninger }) => {
    const { åpenHøyremeny } = useBehandling();

    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);

    const classNameBehandlingContainer = åpenHøyremeny
        ? styles.behandlingÅpenHøyremeny
        : styles.behandlingLukketHøyremeny;

    const classNameHøyremenyContainer = åpenHøyremeny
        ? styles.åpenHøyremeny
        : styles.lukketHøyremeny;

    return (
        <>
            <ScrollToTop />
            <Visittkort personopplysninger={personopplysninger} behandling={behandling} />
            <div className={styles.container}>
                <div className={classNameBehandlingContainer} id="scroll-topp">
                    <Fanemeny behandling={behandling} />
                    <SettPåVent behandling={behandling} />
                    <EndreBehandlendeEnhetModal behandling={behandling} />
                    <BehandlingRoutes behandling={behandling} />
                    <HenleggBehandlingModal
                        behandling={behandling}
                        personopplysninger={personopplysninger}
                    />
                </div>
                <div className={classNameHøyremenyContainer}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandling={behandling} />
                </div>
            </div>
        </>
    );
};
