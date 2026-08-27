import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import * as React from 'react';
import { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import type { Behandling } from '../../../App/typer/fagsak';
import { BehandlingInfo } from './BehandlingInfo';
import { Dokumenter } from './Dokumenter';
import { Historikk } from './Historikk';
import styles from './Høyremeny.module.css';
import { Valgvisning } from './Valgvisning';

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
    const { settÅpenHøyremeny } = useBehandling();

    return (
        <>
            {åpenHøyremeny ? (
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
