import * as React from 'react';
import { FC } from 'react';
import styles from './Fanemeny.module.css';
import { alleSider } from './sider';
import { Fane } from './Fane';
import { Behandling } from '../../../App/typer/fagsak';

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
