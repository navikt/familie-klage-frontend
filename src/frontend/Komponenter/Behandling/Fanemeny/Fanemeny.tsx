import type { FC } from 'react';
import * as React from 'react';
import type { Behandling } from '../../../App/typer/fagsak';
import { Fane } from './Fane';
import styles from './Fanemeny.module.css';
import { alleSider } from './sider';

interface Props {
    behandling: Behandling;
}

export const Fanemeny: FC<Props> = ({ behandling }) => (
    <div className={styles.stickyContainer}>
        <div className={styles.fanemeny}>
            {alleSider.map((side, index) => (
                <Fane
                    side={side}
                    behandling={behandling}
                    behandlingId={behandling.id}
                    index={index}
                    key={index}
                />
            ))}
        </div>
    </div>
);
