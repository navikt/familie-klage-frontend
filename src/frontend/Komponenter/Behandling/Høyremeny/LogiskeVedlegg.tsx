import { Detail } from '@navikt/ds-react';
import * as React from 'react';
import type { LogiskVedlegg } from '../../../App/typer/dokument';
import styles from './LogiskeVedlegg.module.css';

interface Props {
    logiskeVedlegg: LogiskVedlegg[] | undefined;
}

export const LogiskeVedlegg: React.FC<Props> = ({ logiskeVedlegg }) => (
    <ul className={styles.container}>
        {logiskeVedlegg &&
            logiskeVedlegg.map((logiskVedlegg, index) => (
                <li key={logiskVedlegg.tittel + index}>
                    <Detail>{logiskVedlegg.tittel}</Detail>
                </li>
            ))}
    </ul>
);
