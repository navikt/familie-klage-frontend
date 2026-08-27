import { CopyButton } from '@navikt/ds-react';
import React from 'react';
import { formaterFødselsnummer } from '../../App/utils/formatter';
import styles from './KopierbartNullableFødselsnummer.module.css';

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
