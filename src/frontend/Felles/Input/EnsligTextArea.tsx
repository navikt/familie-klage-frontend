import { ErrorMessage, Textarea, TextareaProps } from '@navikt/ds-react';
import React from 'react';
import styles from './EnsligTextArea.module.css';

type Props = TextareaProps & { feilmelding?: string };

export const EnsligTextArea: React.FC<Props> = ({ feilmelding, ...props }) => (
    <div>
        <Textarea className={styles.textArea} {...props} />
        <ErrorMessage>{feilmelding}</ErrorMessage>
    </div>
);
