import React from 'react';

import { HenleggBehandlingModalInnhold } from './HenleggBehandlingModalInnhold';
import { Modal } from '@navikt/ds-react';
import {
    HenleggBehandlingModalContextProvider,
    useHenleggBehandlingModalContext,
} from './context/HenleggBehandlingModalContextProvider';
import { BrevmottakereContextProvider } from './context/BrevmottakereContextProvider';
import { Behandling } from '../../../App/typer/fagsak';

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
