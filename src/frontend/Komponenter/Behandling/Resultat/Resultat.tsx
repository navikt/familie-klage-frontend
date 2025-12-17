import * as React from 'react';
import { useEffect } from 'react';
import styles from './Resultat.module.css';
import { Tidslinje } from './Tidslinje';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AnkeVisning } from './AnkeVisning';
import { FeilregistrertVisning } from './FeilregistrertVisning';
import { GjenopptakVisning } from './GjenopptakVisning';

export const Resultat: React.FC = () => {
    const { behandling, hentBehandling, behandlingHistorikk } = useBehandling();

    useEffect(() => {
        hentBehandling.rerun();
    }, [hentBehandling]);

    return (
        <DataViewer response={{ behandling, behandlingHistorikk }}>
            {({ behandling, behandlingHistorikk }) => (
                <>
                    <div className={styles.headingContainer}>
                        <Heading spacing size="large" level="5">
                            Resultat
                        </Heading>
                        <FeilregistrertVisning behandling={behandling} />
                        <AnkeVisning behandling={behandling} />
                        <GjenopptakVisning behandling={behandling} />
                    </div>
                    <div className={styles.tidslinjeContainer}>
                        <Tidslinje
                            behandling={behandling}
                            behandlingHistorikk={behandlingHistorikk}
                        />
                    </div>
                </>
            )}
        </DataViewer>
    );
};
