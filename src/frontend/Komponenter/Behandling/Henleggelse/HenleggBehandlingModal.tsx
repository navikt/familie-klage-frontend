import { Modal } from '@navikt/ds-react';
import React from 'react';
import type { Behandling } from '../../../App/typer/fagsak';
import { BrevmottakereContextProvider } from './context/BrevmottakereContextProvider';
import {
    HenleggBehandlingModalContextProvider,
    useHenleggBehandlingModalContext,
} from './context/HenleggBehandlingModalContextProvider';
import { HenleggBehandlingModalInnhold } from './HenleggBehandlingModalInnhold';

interface Props {
    behandling: Behandling;
}

export function HenleggBehandlingModal({ behandling }: Props) {
    return (
        <HenleggBehandlingModalContextProvider>
            <HenleggBehandlingModalMedContext behandling={behandling} />
        </HenleggBehandlingModalContextProvider>
    );
}

function HenleggBehandlingModalMedContext({ behandling }: Props) {
    const { modalWidth, erModalÅpen, lukkModal } = useHenleggBehandlingModalContext();
    return (
        <Modal
            header={{ heading: 'Henlegg behandling', closeButton: true }}
            open={erModalÅpen}
            onClose={lukkModal}
            aria-label={'Velg årsak til henleggelse av behandlingen'}
            width={modalWidth}
        >
            {erModalÅpen && (
                <BrevmottakereContextProvider behandling={behandling}>
                    <HenleggBehandlingModalInnhold behandling={behandling} />
                </BrevmottakereContextProvider>
            )}
        </Modal>
    );
}
