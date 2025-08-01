import * as React from 'react';
import { Select } from '@navikt/ds-react';
import styles from './HjemmelSelect.module.css';
import { Dispatch, SetStateAction } from 'react';
import { IVurdering } from './vurderingValg';
import {
    Hjemmel,
    alleHjemlerTilVisningstekst,
    folketrygdHjemmelTilVisningstekst,
    baHjemlerTilVisningstekst,
    ksHjemlerTilVisningstekst,
} from './hjemmel';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../App/typer/ressurs';
import { Stønadstype } from '../../../App/typer/stønadstype';
import { useApp } from '../../../App/context/AppContext';

interface Props {
    settHjemmel: Dispatch<SetStateAction<IVurdering>>;
    valgtHjemmel?: Hjemmel;
}

export const HjemmelSelect: React.FC<Props> = ({ settHjemmel, valgtHjemmel }) => {
    const { settIkkePersistertKomponent } = useApp();
    const { behandling, settVurderingEndret } = useBehandling();

    const oppdaterHjemmel = (hjemmel: string) => {
        settIkkePersistertKomponent('hjemmel-select');
        settHjemmel(
            (prevState) =>
                ({
                    ...prevState,
                    hjemmel: hjemmel,
                }) as IVurdering
        );
        settVurderingEndret(true);
    };

    const hjemmelValgmuligheter: Record<string, string> = React.useMemo(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            switch (behandling.data.stønadstype) {
                case Stønadstype.BARNETRYGD:
                    return baHjemlerTilVisningstekst;
                case Stønadstype.KONTANTSTØTTE:
                    return ksHjemlerTilVisningstekst;
                case Stønadstype.BARNETILSYN:
                case Stønadstype.OVERGANGSSTØNAD:
                case Stønadstype.SKOLEPENGER:
                    return folketrygdHjemmelTilVisningstekst;
                default:
                    return alleHjemlerTilVisningstekst;
            }
        }
        return alleHjemlerTilVisningstekst;
    }, [behandling]);

    return (
        <div className={styles.container}>
            <Select
                value={valgtHjemmel}
                label="Hjemmel"
                size="medium"
                onChange={(e) => oppdaterHjemmel(e.target.value)}
            >
                <option value={''}>Velg</option>
                {Object.keys(hjemmelValgmuligheter).map((nøkkel, index) => (
                    <option value={nøkkel} key={index}>
                        {hjemmelValgmuligheter[nøkkel]}
                    </option>
                ))}
            </Select>
        </div>
    );
};
