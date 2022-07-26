import * as React from 'react';

import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Tidslinje } from './Tidslinje';
import { StegType, StegTypeListe } from '../../../App/typer/fagsak';
import { fullførteSteg, StegHistorikkResultat, finnBehandlinghistorikkFraListe } from './utils';

export const TidslinjeContainer: React.FC<{
    historikkForVisning: IBehandlingshistorikk[];
    aktivtSteg: StegType;
}> = ({ historikkForVisning, aktivtSteg }) => {
    const historikk = StegHistorikkResultat(historikkForVisning);
    const fullført = fullførteSteg(historikk);

    return (
        <div>
            {StegTypeListe.map((item, index) => (
                <>
                    {fullført.includes(item) ? (
                        <Tidslinje
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
                            steg={item}
                            førsteObjekt={index == 0}
                            aktivtSteg={aktivtSteg == item}
                        />
                    )}
                </>
            ))}
        </div>
    );
};
