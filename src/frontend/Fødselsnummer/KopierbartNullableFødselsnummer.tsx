import React from 'react';
import styles from './KopierbartNullableFødselsnummer.module.css';
import { CopyButton } from '@navikt/ds-react';
import { formaterFødselsnummer } from '../App/utils/formatter';

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string }> = ({
    fødselsnummer,
}) => (
    <span className={styles.container}>
        <span>{formaterFødselsnummer(fødselsnummer)}</span>
        <CopyButton
            size={'xsmall'}
            copyText={fødselsnummer}
            variant={'action'}
            activeText={'kopiert'}
        />
    </span>
);
