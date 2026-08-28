import { Select } from '@navikt/ds-react';
import type { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styles from './HjemmelSelect.module.css';
import type { FolketrygdHjemmel, Hjemmel } from './hjemmel';
import { folketrygdHjemmelTilVisningstekst } from './hjemmel';
import type { IVurdering } from './vurderingValg';

interface Props {
    settHjemmel: Dispatch<SetStateAction<IVurdering>>;
    valgtHjemmel: Hjemmel | '';
}

export const HjemmelSelect: React.FC<Props> = ({ settHjemmel, valgtHjemmel }) => {
    const { settIkkePersistertKomponent } = useApp();
    const { settVurderingEndret } = useBehandling();

    const oppdaterHjemmel = (hjemmel: string) => {
        settIkkePersistertKomponent('hjemmel-select');
        settHjemmel(
            prevState =>
                ({
                    ...prevState,
                    hjemmel: hjemmel,
                }) as IVurdering
        );
        settVurderingEndret(true);
    };

    return (
        <Select
            value={valgtHjemmel}
            label="Hjemmel"
            size="medium"
            onChange={e => oppdaterHjemmel(e.target.value)}
            className={styles.select}
        >
            <option value={''} disabled>
                Velg
            </option>
            {Object.keys(folketrygdHjemmelTilVisningstekst).map((nøkkel, index) => (
                <option value={nøkkel} key={index}>
                    {folketrygdHjemmelTilVisningstekst[nøkkel as FolketrygdHjemmel]}
                </option>
            ))}
        </Select>
    );
};
