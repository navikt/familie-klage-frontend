import * as React from 'react';

import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Tidslinje } from './Tidslinje';
import { StegType, StegTypeListe } from '../../../App/typer/fagsak';
import { fullførteSteg, StegHistorikkResultat, finnBehandlinghistorikkFraListe } from './utils';
import { v4 as uuidv4 } from 'uuid';

export const TidslinjeContainer: React.FC<{
    historikkForVisning: IBehandlingshistorikk[];
    aktivtSteg: StegType;
}> = ({ historikkForVisning, aktivtSteg }) => {
    const historikk = StegHistorikkResultat(historikkForVisning);
    const fullført = fullførteSteg(historikk);

    return (
        <div>
            {StegTypeListe.map((item, index) => (
                <div key={uuidv4()}>
                    {fullført.includes(item) ? (
                        <Tidslinje
                            key={uuidv4()}
                            steg={item}
                            behandlingHistorikk={finnBehandlinghistorikkFraListe(
                                historikkForVisning,
                                item
                            )}
                            førsteObjekt={index == 0}
                            aktivtSteg={aktivtSteg == item}
                        />
                    ) : (
                        <Tidslinje
                            key={uuidv4()}
                            steg={item}
                            førsteObjekt={index == 0}
                            aktivtSteg={aktivtSteg == item}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
