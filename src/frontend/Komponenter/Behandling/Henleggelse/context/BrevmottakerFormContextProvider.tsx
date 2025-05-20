import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { BrevmottakerFormValues } from '../../Brevmottakere/baks/modal/form/BrevmottakerForm';
import {
    HENLEGG_BEHANDLING_MODAL_WIDTHS,
    useHenleggBehandlingModalContext,
} from './HenleggBehandlingModalContextProvider';
import { useBrevmottakerForm } from '../hooks/useBrevmottakerForm';

interface ContextValue {
    brevmottakerForm: UseFormReturn<BrevmottakerFormValues>;
    onSubmitBrevmottakerForm: SubmitHandler<BrevmottakerFormValues>;
    åpneBrevmottakerForm: () => void;
    lukkBrevmottakerForm: () => void;
    erBrevmottakerFormÅpen: boolean;
}

const BrevmottakerFormContext = createContext<ContextValue | undefined>(undefined);

export const useBrevmottakerFormContext = () => {
    const context = useContext(BrevmottakerFormContext);
    if (context === undefined) {
        throw new Error(
            'BrevmottakerFormContext må brukes innenfor en BrevmottakerFormContextProvider'
        );
    }
    return context;
};

export function BrevmottakerFormContextProvider({ children }: PropsWithChildren) {
    const { brevmottakerForm, onSubmitBrevmottakerForm } = useBrevmottakerForm();
    const { settWidth } = useHenleggBehandlingModalContext();

    const [erBrevmottakerFormÅpen, settErBrevmottakerFormÅpen] = useState<boolean>(false);

    function åpneBrevmottakerForm() {
        settErBrevmottakerFormÅpen(true);
        settWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.UTVIDET);
    }

    function lukkBrevmottakerForm() {
        settErBrevmottakerFormÅpen(false);
        settWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    return (
        <BrevmottakerFormContext.Provider
            value={{
                brevmottakerForm,
                onSubmitBrevmottakerForm,
                åpneBrevmottakerForm,
                lukkBrevmottakerForm,
                erBrevmottakerFormÅpen,
            }}
        >
            {children}
        </BrevmottakerFormContext.Provider>
    );
}
