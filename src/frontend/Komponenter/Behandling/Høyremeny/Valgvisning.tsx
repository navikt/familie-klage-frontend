import * as React from 'react';
import styles from './Valgvisning.module.css';
import { Høyremenyvalg } from './Høyremeny';
import { ClockFillIcon, FolderIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

interface Props {
    settAktiv: (aktivtValg: Høyremenyvalg) => void;
    aktiv: Høyremenyvalg;
}

export const Valgvisning: React.FC<Props> = ({ aktiv, settAktiv }) => (
    <HStack className={styles.container} justify="space-evenly" align="center">
        <div
            tabIndex={0}
            className={aktiv === Høyremenyvalg.Historikk ? styles.valgtIkon : styles.ikon}
            role={'button'}
            onClick={() => settAktiv(Høyremenyvalg.Historikk)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    settAktiv(Høyremenyvalg.Historikk);
                }
            }}
        >
            <ClockFillIcon aria-label="Historikk" fontSize="1.5em" />
            <BodyShort size={'small'}>Historikk</BodyShort>
        </div>
        <div
            tabIndex={0}
            className={aktiv === Høyremenyvalg.Dokumenter ? styles.valgtIkon : styles.ikon}
            role={'button'}
            onClick={() => settAktiv(Høyremenyvalg.Dokumenter)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    settAktiv(Høyremenyvalg.Dokumenter);
                }
            }}
        >
            <FolderIcon aria-label="Dokumentoversikt" fontSize="1.5em" />
            <BodyShort size={'small'}>Dokumenter</BodyShort>
        </div>
    </HStack>
);
