import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useBehandling } from '../../../../App/context/BehandlingContext';

interface ContextValue {
    åpneModal: () => void;
    lukkModal: () => void;
    erModalÅpen: boolean;
    modalWidth: `${number}${string}`;
    settModalWidth: (width: `${number}${string}`) => void;
}

const HenleggBehandlingModalContext = createContext<ContextValue | undefined>(undefined);

export const useHenleggBehandlingModalContext = () => {
    const context = useContext(HenleggBehandlingModalContext);
    if (context === undefined) {
        throw new Error(
            'useHenleggBehandlingModalContext må brukes innenfor en HenleggModalModalContextProvider'
        );
    }
    return context;
};

export const HENLEGG_BEHANDLING_MODAL_WIDTHS: Record<string, `${number}${string}`> = {
    DEFAULT: '60rem',
    UTVIDET: '100rem',
};

export function HenleggBehandlingModalContextProvider({ children }: PropsWithChildren) {
    const { visHenleggModal, settVisHenleggModal } = useBehandling();

    const [modalWidth, settModalWidth] = useState<`${number}${string}`>(
        HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT
    );

    function åpneModal() {
        settVisHenleggModal(true);
        settModalWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    function lukkModal() {
        settVisHenleggModal(false);
        settModalWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    return (
        <HenleggBehandlingModalContext.Provider
            value={{
                åpneModal,
                lukkModal,
                erModalÅpen: visHenleggModal,
                modalWidth,
                settModalWidth,
            }}
        >
            {children}
        </HenleggBehandlingModalContext.Provider>
    );
}
