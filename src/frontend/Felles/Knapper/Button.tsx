import React from 'react';
import { Button as NavButton, ButtonProps as Props } from '@navikt/ds-react';
import styles from './Button.module.css';

export const Button: React.FC<Props> = (props) => (
    <NavButton className={styles.button} {...props}>
        {props.children}
    </NavButton>
);
