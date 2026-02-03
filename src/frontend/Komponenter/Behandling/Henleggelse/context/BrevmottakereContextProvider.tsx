import React, { createContext, PropsWithChildren, useContext, useRef, useState } from 'react';
import { useOnMount } from '../../../../App/hooks/useOnMount';
import {
    erNyBrevmottakerPersonMedIdent,
    lagNyeBrevmottakere,
    NyBrevmottaker,
    NyBrevmottakerPerson,
    NyBrevmottakerPersonMedIdent,
    NyBrevmottakerPersonUtenIdent,
} from '../../Brevmottakere/nyBrevmottaker';
import { MottakerRolle } from '../../Brevmottakere/mottakerRolle';
import { useHentInitielleBrevmottakere } from '../hooks/useHentInitielleBrevmottakere';
import { Behandling } from '../../../../App/typer/fagsak';

interface ContextValue {
    brevmottakere: NyBrevmottaker[];
    laster: boolean;
    feilmelding: string;
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

    const [brevmottakere, settBrevmottakere] = useState<NyBrevmottaker[]>([]);
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>('');

    const bruker = useRef<NyBrevmottakerPersonMedIdent | undefined>(undefined);

    useOnMount(() => {
        settLaster(true);
        hentInitielleBrevmottakere(behandling.id)
            .then((brevmottakere) => {
                const nyeBrevmottakere = lagNyeBrevmottakere(brevmottakere);
                bruker.current = nyeBrevmottakere
                    .filter(erNyBrevmottakerPersonMedIdent)
                    .find((brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.BRUKER);
                settBrevmottakere(nyeBrevmottakere);
                settLaster(false);
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
                settLaster(false);
            });
    });

    function leggTilBrevmottaker(nyBrevmottaker: NyBrevmottakerPersonUtenIdent) {
        settBrevmottakere((prev) => {
            if (nyBrevmottaker.mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE) {
                const newState = [...prev];
                const index = newState.findIndex((p) => p.mottakerRolle === MottakerRolle.BRUKER);
                newState[index] = nyBrevmottaker;
                return newState;
            }
            if (nyBrevmottaker.mottakerRolle === MottakerRolle.DØDSBO) {
                return [nyBrevmottaker];
            }
            return [...prev, nyBrevmottaker];
        });
    }

    function slettBrevmottaker(brevmottaker: NyBrevmottakerPerson) {
        settBrevmottakere((prev) => {
            const erBrukerMedUtenlandskAdresse =
                brevmottaker.mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE;
            const erDødsbo = brevmottaker.mottakerRolle === MottakerRolle.DØDSBO;
            if (erDødsbo || erBrukerMedUtenlandskAdresse) {
                if (bruker.current === undefined) {
                    throw Error('Forventet en definert bruker.');
                }
                const newState = [...prev];
                const index = newState.findIndex(
                    (p) => p.mottakerRolle === brevmottaker.mottakerRolle
                );
                newState[index] = bruker.current;
                return newState;
            }
            return prev.filter((p) => p.mottakerRolle !== brevmottaker.mottakerRolle);
        });
    }

    return (
        <BrevmottakereContext.Provider
            value={{
                brevmottakere,
                laster,
                feilmelding,
                leggTilBrevmottaker,
                slettBrevmottaker,
            }}
        >
            {children}
        </BrevmottakereContext.Provider>
    );
}
