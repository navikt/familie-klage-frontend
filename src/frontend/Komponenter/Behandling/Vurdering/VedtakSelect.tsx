import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Select } from '@navikt/ds-react';
import styles from './VedtakSelect.module.css';
import { IVurdering, VedtakValg, vedtakValgTilTekst } from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';

interface Props {
    settVedtak: Dispatch<SetStateAction<IVurdering>>;
    valgtVedtak?: VedtakValg;
}

export const VedtakSelect: React.FC<Props> = ({ settVedtak, valgtVedtak }) => {
    const { settIkkePersistertKomponent } = useApp();
    const { settVurderingEndret } = useBehandling();

    const oppdaterVedtak = (vedtak: string) => {
        settIkkePersistertKomponent('vedtak-select');
        settVedtak(
            (prevState: IVurdering) =>
                ({
                    ...prevState,
                    vedtak: vedtak,
                    årsak: undefined,
                    hjemmel: undefined,
                }) as IVurdering
        );
        settVurderingEndret(true);
    };

    return (
        <Select
            value={valgtVedtak}
            label="Vedtak"
            size="medium"
            onChange={(e) => oppdaterVedtak(e.target.value)}
            className={styles.select}
        >
            <option value={''}>Velg</option>
            {Object.keys(vedtakValgTilTekst).map((valg, index) => (
                <option value={valg} key={index}>
                    {vedtakValgTilTekst[valg as VedtakValg]}
                </option>
            ))}
        </Select>
    );
};
