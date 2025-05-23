import React, { createContext, PropsWithChildren, useContext, useRef, useState } from 'react';
import { useOnMount } from '../../../../App/hooks/useOnMount';
import {
    erNyBrevmottakerPerson,
    erNyBrevmottakerPersonMedIdent,
    lagNyeBrevmottakere,
    NyBrevmottakerPerson,
    NyBrevmottakerPersonMedIdent,
    NyBrevmottakerPersonUtenIdent,
} from '../../Brevmottakere/nyBrevmottaker';
import { MottakerRolle } from '../../Brevmottakere/mottakerRolle';
import { useHentInitielleBrevmottakere } from '../hooks/useHentInitielleBrevmottakere';
import { Behandling } from '../../../../App/typer/fagsak';

interface ContextValue {
    brevmottakere: NyBrevmottakerPerson[];
    brevmottakereLaster: boolean;
    brevmottakereFeilmelding: string;
    leggTilBrevmottaker: (brevmottaker: NyBrevmottakerPersonUtenIdent) => void;
    slettBrevmottaker: (brevmottaker: NyBrevmottakerPerson) => void;
}

const BrevmottakereContext = createContext<ContextValue | undefined>(undefined);

export const useBrevmottakereContext = () => {
    const context = useContext(BrevmottakereContext);
    if (context === undefined) {
        throw new Error(
            'useBrevmottakereContext må brukes innenfor en BrevmottakereContextProvider'
        );
    }
    return context;
};

interface Props extends PropsWithChildren {
    behandling: Behandling;
}

export function BrevmottakereContextProvider({ behandling, children }: Props) {
    const hentInitielleBrevmottakere = useHentInitielleBrevmottakere();

    const [brevmottakere, settBrevmottakere] = useState<NyBrevmottakerPerson[]>([]);
    const [brevmottakereLaster, settBrevmottakereLaster] = useState<boolean>(false);
    const [brevmottakereFeilmelding, settBrevmottakereFeilmelding] = useState<string>('');

    const bruker = useRef<NyBrevmottakerPersonMedIdent | undefined>(undefined);

    useOnMount(() => {
        settBrevmottakereLaster(true);
        hentInitielleBrevmottakere(behandling.id)
            .then((brevmottakere) => {
                const nyeBrevmottakere = lagNyeBrevmottakere(brevmottakere).filter((brevmottaker) =>
                    erNyBrevmottakerPerson(brevmottaker)
                );
                bruker.current = nyeBrevmottakere
                    .filter((brevmottaker) => erNyBrevmottakerPersonMedIdent(brevmottaker))
                    .find((brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.BRUKER);
                settBrevmottakere(nyeBrevmottakere);
                settBrevmottakereLaster(false);
            })
            .catch((error: Error) => {
                settBrevmottakereFeilmelding(error.message);
                settBrevmottakereLaster(false);
            });
    });

    function leggTilBrevmottaker(nyBrevmottaker: NyBrevmottakerPersonUtenIdent) {
        settBrevmottakere((prev) => {
            if (nyBrevmottaker.mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE) {
                return [
                    ...prev.filter((p) => p.mottakerRolle !== MottakerRolle.BRUKER),
                    nyBrevmottaker,
                ];
            }
            if (nyBrevmottaker.mottakerRolle === MottakerRolle.DØDSBO) {
                return [nyBrevmottaker];
            }
            return [...prev, nyBrevmottaker];
        });
    }

    function slettBrevmottaker(brevmottaker: NyBrevmottakerPerson) {
        settBrevmottakere((prev) => {
            const filtrert = prev.filter((p) => p.mottakerRolle !== brevmottaker.mottakerRolle);
            const erBrukerMedUtenlandskAdresse =
                brevmottaker.mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE;
            const erDødsbo = brevmottaker.mottakerRolle === MottakerRolle.DØDSBO;
            if (bruker.current === undefined) {
                throw Error('Forventet en definert bruker.');
            }
            if (erDødsbo || erBrukerMedUtenlandskAdresse) {
                filtrert.push(bruker.current);
            }
            return [...filtrert];
        });
    }

    return (
        <BrevmottakereContext.Provider
            value={{
                brevmottakere,
                brevmottakereLaster,
                brevmottakereFeilmelding,
                leggTilBrevmottaker,
                slettBrevmottaker,
            }}
        >
            {children}
        </BrevmottakereContext.Provider>
    );
}
