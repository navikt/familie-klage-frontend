import React, { createContext, PropsWithChildren, useContext } from 'react';
import { IPersonopplysningerFagsakeierOgSøker } from '../typer/personopplysninger';
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
    useSetPersonIdent(personopplysninger.fagsakEier.personIdent);

    return (
        <PersonopplysningerContext.Provider value={personopplysninger}>
            {children}
        </PersonopplysningerContext.Provider>
    );
}
