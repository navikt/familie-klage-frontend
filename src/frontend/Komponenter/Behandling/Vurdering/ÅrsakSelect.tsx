import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Select } from '@navikt/ds-react';
import styles from './ÅrsakSelect.module.css';
import { IVurdering, ÅrsakOmgjøring, årsakValgTilTekst } from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Fagsystem } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';

interface Props {
    settÅrsak: Dispatch<SetStateAction<IVurdering>>;
    årsakValgt?: ÅrsakOmgjøring;
    fagsystem: Fagsystem;
}

export const ÅrsakSelect: React.FC<Props> = ({ settÅrsak, årsakValgt, fagsystem }) => {
    const { settIkkePersistertKomponent } = useApp();
    const { settVurderingEndret } = useBehandling();

    const omgjøringsårsaker = Object.values(ÅrsakOmgjøring).filter((årsak) => {
        return fagsystem === Fagsystem.EF ? årsak !== ÅrsakOmgjøring.IKKE_UTREDET_NOK : true;
    });

    const oppdaterÅrsak = (årsak: string) => {
        settIkkePersistertKomponent('årsak-select');
        settÅrsak(
            (prevState: IVurdering) =>
                ({
                    ...prevState,
                    årsak: årsak,
                }) as IVurdering
        );
        settVurderingEndret(true);
    };

    return (
        <div className={styles.container}>
            <Select
                value={årsakValgt}
                label="Årsak"
                size="medium"
                onChange={(e) => oppdaterÅrsak(e.target.value)}
            >
                <option value={''}>Velg</option>
                {Object.values(omgjøringsårsaker).map((valg, index) => (
                    <option value={valg} key={index}>
                        {årsakValgTilTekst[valg]}
                    </option>
                ))}
            </Select>
        </div>
    );
};
