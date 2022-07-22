import * as React from 'react';

import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Tidslinje } from './Tidslinje';
import { StegTypeListe } from '../../../App/typer/fagsak';
import { fullførteSteg, StegHistorikkResultat } from './utils';

export const TidslinjeContainer: React.FC<{ historikkForVisning: IBehandlingshistorikk[] }> = ({
    historikkForVisning,
}) => {
    const historikk = StegHistorikkResultat(historikkForVisning);
    const fullført = fullførteSteg(historikk);

    return (
        <div>
            {StegTypeListe.map((item, index) => (
                <>
                    {fullført.includes(item) ? (
                        <Tidslinje steg={item} førsteObjekt={index == 0} ferdig={true} />
                    ) : (
                        <Tidslinje
                            steg={item}
                            behandlingHistorikk={historikkForVisning.find((obj) => {
                                return obj.steg == item;
                            })}
                            førsteObjekt={index == 0}
                            ferdig={false}
                        />
                    )}
                </>
            ))}
        </div>
    );
};
