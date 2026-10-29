import { Select } from '@navikt/ds-react';
import type * as React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styles from './HjemmelSelect.module.css';
import type { Hjemmel } from './hjemmel';
import {
    efHjemlerTilVisningstekst,
    folketrygdHjemmelTilVisningstekst,
    overgangsforskriftenTilVisningstekst,
} from './hjemmel';
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
            {Object.entries(folketrygdHjemmelTilVisningstekst).map(([hjemmel, visningstekst]) => (
                <option value={hjemmel} key={hjemmel}>
                    {visningstekst}
                </option>
            ))}
            <option disabled value="separator">
                ------
            </option>
            {Object.entries(overgangsforskriftenTilVisningstekst).map(([hjemmel, visningstekst]) => (
                <option value={hjemmel} key={hjemmel}>
                    {visningstekst}
                </option>
            ))}
            <option value="UTLAND_EØS">{efHjemlerTilVisningstekst.UTLAND_EØS}</option>
        </Select>
    );
};
