import * as React from 'react';
import { useEffect, useState } from 'react';
import { Valgvisning } from './Valgvisning';
import { Historikk } from './Historikk';
import { Dokumenter } from './Dokumenter';
import styles from './Høyremeny.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandling } from '../../../App/typer/fagsak';
import { BehandlingInfo } from './BehandlingInfo';

interface Props {
    behandling: Behandling;
    åpenHøyremeny: boolean;
}

export enum Høyremenyvalg {
    Historikk = 'Historikk',
    Dokumenter = 'Dokumenter',
}

export const Høyremeny: React.FC<Props> = ({ åpenHøyremeny, behandling }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Historikk);
    const { settÅpenHøyremeny, behandlingErRedigerbar } = useBehandling();

    useEffect(() => {
        if (behandlingErRedigerbar) {
            settAktivtvalg(Høyremenyvalg.Historikk);
        }
    }, [behandling, behandlingErRedigerbar]);

    return (
        <>
            {åpenHøyremeny ? (
                <>
                    <div className={styles.container}>
                        <button
                            className={styles.toggleOpen}
                            onClick={() => {
                                settÅpenHøyremeny(!åpenHøyremeny);
                            }}
                        >
                            <ChevronRightIcon className={styles.pilHøyre} />
                        </button>

                        <BehandlingInfo behandling={behandling} />

                        <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                        <Dokumenter hidden={aktivtValg !== Høyremenyvalg.Dokumenter} />
                        <Historikk hidden={aktivtValg !== Høyremenyvalg.Historikk} />
                    </div>
                </>
            ) : (
                <button
                    className={styles.toggleOpen}
                    onClick={() => {
                        settÅpenHøyremeny(!åpenHøyremeny);
                    }}
                >
                    <ChevronLeftIcon className={styles.pilVenstre} />
                </button>
            )}
        </>
    );
};
