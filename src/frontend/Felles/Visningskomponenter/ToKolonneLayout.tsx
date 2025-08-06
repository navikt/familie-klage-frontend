import React, { ReactNode } from 'react';
import styles from './ToKolonneLayout.module.css';

interface Props {
    children: {
        venstre: ReactNode;
        høyre: ReactNode;
    };
}

export const ToKolonneLayout: React.FC<Props> = ({ children: { venstre, høyre } }) => (
    <div className={styles.container}>
        <div className={styles.kolonne}>{venstre}</div>
        <div className={styles.kolonne}>{høyre}</div>
    </div>
);
