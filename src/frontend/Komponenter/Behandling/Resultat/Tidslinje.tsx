import * as React from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

export const Tidslinje: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    return (
        <div>
            <div>
                Sak opprettet:
                {formaterIsoDatoTid(behandling.opprettet)}
            </div>
            <div>
                Sak sist oppdatert:
                {formaterIsoDatoTid(behandling.sistEndret)}
            </div>
            <div>
                Status:
                {behandling.resultat}
            </div>
        </div>
    );
};
