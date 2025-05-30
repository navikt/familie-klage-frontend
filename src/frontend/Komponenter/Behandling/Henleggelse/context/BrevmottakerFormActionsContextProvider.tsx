import React, { createContext, PropsWithChildren, useContext } from 'react';

interface ContextValue {
    visForm: () => void;
    skjulForm: () => void;
}

const BrevmottakerFormActionsContext = createContext<ContextValue | undefined>(undefined);

export const useBrevmottakerFormActionsContext = () => {
    const context = useContext(BrevmottakerFormActionsContext);
    if (context === undefined) {
        throw new Error(
            'useBrevmottakerFormActionsContext må brukes innenfor en BrevmottakerFormActionsContextProvider'
        );
    }
    return context;
};

interface Props extends PropsWithChildren {
    value: {
        visForm: () => void;
        skjulForm: () => void;
    };
}

export function BrevmottakerFormActionsContextProvider({ value, children }: Props) {
    return (
        <BrevmottakerFormActionsContext.Provider value={value}>
            {children}
        </BrevmottakerFormActionsContext.Provider>
    );
}
