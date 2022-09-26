import * as React from 'react';
import { useEffect, useState } from 'react';

import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { TidslinjeHorisontal } from './TidslinjeHorisontal';
import { TidslinjeVertikal } from './TidslinjeVertikal';
import { StegType } from '../../../App/typer/fagsak';
import { finnBehandlinghistorikkFraListe, fullførteSteg, StegHistorikkResultat } from './utils';
import styled from 'styled-components';

const StegTypeListe: StegType[] = [
    StegType.FORMKRAV,
    StegType.VURDERING,
    StegType.BREV,
    StegType.OVERFØRING_TIL_KABAL,
    StegType.KABAL_VENTER_SVAR,
    StegType.BEHANDLING_FERDIGSTILT,
];

const HorisontalTidslinjeContainer = styled.div`
    margin-top: 20vh;
    display: grid;
    grid-template-columns: repeat(
        ${StegTypeListe.length},
        minmax(9rem, calc(100% / ${StegTypeListe.length}))
    );
`;

const VertikalTidslinjeContainer = styled.div`
    margin-top: 2rem;
`;

export const TidslinjeContainer: React.FC<{
    historikkForVisning: IBehandlingshistorikk[];
    aktivtSteg: StegType;
}> = ({ historikkForVisning, aktivtSteg }) => {
    const historikk = StegHistorikkResultat(historikkForVisning);
    const fullført = fullførteSteg(historikk);

    const [skjermStørrelse, settSkjermstørrelse] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => settSkjermstørrelse(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return (
        <>
            {skjermStørrelse > 1282 ? (
                <HorisontalTidslinjeContainer>
                    {StegTypeListe.map((item, index) => (
                        <div key={index}>
                            {fullført.includes(item) ? (
                                <TidslinjeHorisontal
                                    key={index}
                                    steg={item}
                                    behandlingHistorikk={finnBehandlinghistorikkFraListe(
                                        historikkForVisning,
                                        item
                                    )}
                                    førsteObjekt={index === 0}
                                    sisteObjekt={index + 1 === StegTypeListe.length}
                                    aktivtSteg={aktivtSteg == item}
                                />
                            ) : (
                                <TidslinjeHorisontal
                                    key={index}
                                    steg={item}
                                    førsteObjekt={index === 0}
                                    sisteObjekt={index + 1 === StegTypeListe.length}
                                    aktivtSteg={aktivtSteg === item}
                                />
                            )}
                        </div>
                    ))}
                </HorisontalTidslinjeContainer>
            ) : (
                <VertikalTidslinjeContainer>
                    {StegTypeListe.map((item, index) => (
                        <div key={index}>
                            {fullført.includes(item) ? (
                                <TidslinjeVertikal
                                    key={index}
                                    steg={item}
                                    behandlingHistorikk={finnBehandlinghistorikkFraListe(
                                        historikkForVisning,
                                        item
                                    )}
                                    førsteObjekt={index === 0}
                                    aktivtSteg={aktivtSteg == item}
                                />
                            ) : (
                                <TidslinjeVertikal
                                    key={index}
                                    steg={item}
                                    førsteObjekt={index === 0}
                                    aktivtSteg={aktivtSteg === item}
                                />
                            )}
                        </div>
                    ))}
                </VertikalTidslinjeContainer>
            )}
        </>
    );
};
