import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useBehandling } from '../../../../App/context/BehandlingContext';

interface ContextValue {
    åpneHenleggBehandlingModal: () => void;
    lukkHenleggBehandlingModal: () => void;
    erHenleggBehandlingModalÅpen: boolean;
    width: `${number}${string}`;
    settWidth: (width: `${number}${string}`) => void;
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

    const [width, settWidth] = useState<`${number}${string}`>(
        HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT
    );

    function åpneHenleggBehandlingModal() {
        settVisHenleggModal(true);
        settWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    function lukkHenleggBehandlingModal() {
        settVisHenleggModal(false);
        settWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    return (
        <HenleggBehandlingModalContext.Provider
            value={{
                åpneHenleggBehandlingModal,
                lukkHenleggBehandlingModal,
                erHenleggBehandlingModalÅpen: visHenleggModal,
                width,
                settWidth,
            }}
        >
            {children}
        </HenleggBehandlingModalContext.Provider>
    );
}
