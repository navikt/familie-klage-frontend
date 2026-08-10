import type { PropsWithChildren } from 'react';
import React, { createContext, useContext } from 'react';
import type { IPersonopplysningerFagsakeierOgSøker } from '../typer/personopplysninger';
import { useSetPersonIdent } from '../hooks/useSetPersonIdent';

const PersonopplysningerContext = createContext<IPersonopplysningerFagsakeierOgSøker | undefined>(
    undefined
);

export const usePersonopplysningerContext = (): IPersonopplysningerFagsakeierOgSøker => {
    const context = useContext(PersonopplysningerContext);
    if (context === undefined) {
        throw new Error(
            'usePersonopplysningerContext må brukes innenfor en PersonopplysningerContext'
        );
    }
    return context;
};

interface Props extends PropsWithChildren {
    personopplysninger: IPersonopplysningerFagsakeierOgSøker;
}

export function PersonopplysningerContextProvider({ personopplysninger, children }: Props) {
    useSetPersonIdent(personopplysninger);

    return (
        <PersonopplysningerContext.Provider value={personopplysninger}>
            {children}
        </PersonopplysningerContext.Provider>
    );
}
