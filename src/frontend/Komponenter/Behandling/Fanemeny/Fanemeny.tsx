import * as React from 'react';
import { FC } from 'react';
import styles from './Fanemeny.module.css';
import { alleSider, ISide, SideNavn } from './sider';
import Fane from './Fane';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilRekkefølge,
    StegType,
} from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';

interface Props {
    behandling: Behandling;
}

export const Fanemeny: FC<Props> = ({ behandling }) => {
    const { formkravOppfylt } = useBehandling();
    const faneErLåst = (side: ISide, steg: StegType): boolean => {
        if (side.navn === SideNavn.VURDERING) {
            return !formkravOppfylt;
        }
        if (side.navn === SideNavn.BREV && behandling.resultat === BehandlingResultat.HENLAGT) {
            return true;
        }
        return side.rekkefølge > behandlingStegTilRekkefølge[steg];
    };

    return (
        <div className={styles.stickyContainer}>
            <div className={styles.fanemeny}>
                {alleSider.map((side, index) => (
                    <Fane
                        side={side}
                        behandlingId={behandling.id}
                        index={index}
                        deaktivert={faneErLåst(side, behandling.steg)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};
