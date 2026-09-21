import { ClockFillIcon, FolderIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import type * as React from 'react';
import { Høyremenyvalg } from './Høyremeny';
import styles from './Valgvisning.module.css';

interface Props {
    settAktiv: (aktivtValg: Høyremenyvalg) => void;
    aktiv: Høyremenyvalg;
}

export const Valgvisning: React.FC<Props> = ({ aktiv, settAktiv }) => (
    <HStack className={styles.container} justify="space-evenly" align="center">
        <button
            type="button"
            className={aktiv === Høyremenyvalg.Historikk ? styles.valgtIkon : styles.ikon}
            onClick={() => settAktiv(Høyremenyvalg.Historikk)}
        >
            <ClockFillIcon aria-hidden fontSize="1.5em" />
            <BodyShort as="span" size={'small'}>
                Historikk
            </BodyShort>
        </button>
        <button
            type="button"
            className={aktiv === Høyremenyvalg.Dokumenter ? styles.valgtIkon : styles.ikon}
            onClick={() => settAktiv(Høyremenyvalg.Dokumenter)}
        >
            <FolderIcon aria-hidden fontSize="1.5em" />
            <BodyShort as="span" size={'small'}>
                Dokumenter
            </BodyShort>
        </button>
    </HStack>
);
