import React, { createContext, PropsWithChildren, useContext } from 'react';
import { IPersonopplysninger } from '../typer/personopplysninger';
import { useSetPersonIdent } from '../hooks/useSetPersonIdent';

const PersonopplysningerContext = createContext<IPersonopplysninger | undefined>(undefined);

export const usePersonopplysningerContext = (): IPersonopplysninger => {
    const context = useContext(PersonopplysningerContext);
    if (context === undefined) {
        throw new Error(
            'usePersonopplysningerContext må brukes innenfor en PersonopplysningerContext'
        );
    }
    return context;
};

interface Props extends PropsWithChildren {
    personopplysninger: IPersonopplysninger;
}

export function PersonopplysningerContextProvider({ personopplysninger, children }: Props) {
    useSetPersonIdent(personopplysninger.personIdent);

    return (
        <PersonopplysningerContext.Provider value={personopplysninger}>
            {children}
        </PersonopplysningerContext.Provider>
    );
}
