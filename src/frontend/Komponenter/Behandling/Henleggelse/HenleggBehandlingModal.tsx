import React from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';

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
    personopplysninger: IPersonopplysninger;
}

export function HenleggBehandlingModal({ behandling, personopplysninger }: Props) {
    return (
        <HenleggBehandlingModalContextProvider>
            <HenleggBehandlingModalMedContext
                behandling={behandling}
                personopplysninger={personopplysninger}
            />
        </HenleggBehandlingModalContextProvider>
    );
}

function HenleggBehandlingModalMedContext({ behandling, personopplysninger }: Props) {
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
                    <HenleggBehandlingModalInnhold
                        behandling={behandling}
                        personopplysninger={personopplysninger}
                    />
                </BrevmottakereContextProvider>
            )}
        </Modal>
    );
}
