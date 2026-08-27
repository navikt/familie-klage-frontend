import type { ButtonProps as Props } from '@navikt/ds-react';
import { Button as NavButton } from '@navikt/ds-react';
import React from 'react';
import styles from './Button.module.css';

export const Button: React.FC<Props> = props => (
    <NavButton className={styles.button} {...props}>
        {props.children}
    </NavButton>
);
