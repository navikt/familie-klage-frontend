import * as React from 'react';
import styles from './Fane.module.css';
import { NavLink } from 'react-router-dom';
import { ISide } from './sider';
import { useApp } from '../../../App/context/AppContext';
import { BodyShort } from '@navikt/ds-react';
import { utledRedirectUrl } from '../utils';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { utledFaneErLåst } from './utils';

interface Props {
    side: ISide;
    behandling: Behandling;
    behandlingId: string;
    index: number;
}

export const Fane: React.FC<Props> = ({ side, behandling, behandlingId, index }) => {
    const { gåTilUrl, valgtSide } = useApp();
    const { formkravOppfylt } = useBehandling();

    const faneErLåst = utledFaneErLåst(side, behandling, formkravOppfylt);

    if (faneErLåst) {
        return (
            <BodyShort className={styles.tekst} size={'small'}>
                {index + 1}. {side.navn}
            </BodyShort>
        );
    }

    const nåværendeSide = valgtSide
        ? valgtSide.split('/').at(-1)
        : utledRedirectUrl(behandling.steg);

    const nåværendeFaneErValgt = nåværendeSide === side.href;

    return (
        <NavLink
            className={
                nåværendeFaneErValgt ? styles.valgtNavigasjonslenke : styles.navigasjonslenke
            }
            key={side.navn}
            to={`/behandling/${behandlingId}/${side.href}`}
            onClick={(e) => {
                e.preventDefault();
                gåTilUrl(`/behandling/${behandlingId}/${side.href}`);
            }}
        >
            <BodyShort className={styles.lenkeTekst} size={'small'}>
                {index + 1}. {side.navn}
            </BodyShort>
        </NavLink>
    );
};
