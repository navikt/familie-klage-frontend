import { Modal } from '@navikt/ds-react';
import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import type { Brevmottakere } from '../../brevmottakere';
import { hentManueltOpprettedeBrevmottakere } from '../../brevmottakere';
import type { NyBrevmottaker } from '../../nyBrevmottaker';
import type { SlettbarBrevmottaker } from '../../slettbarBrevmottaker';
import { BrevmottakerModalBody } from './BrevmottakerModalBody';
import { BrevmottakerModalFooter } from './BrevmottakerModalFooter';

type Props = {
    brevmottakere: Brevmottakere;
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<Awaited<void>>;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<Awaited<void>>;
};

function utledHeading(antallMottakere: number, erLesevisning: boolean): string {
    if (erLesevisning) {
        return antallMottakere === 1 ? 'Brevmottaker' : 'Brevmottakere';
    }
    if (antallMottakere === 0) {
        return 'Legg til brevmottaker';
    }
    return antallMottakere === 1 ? 'Legg til eller fjern brevmottaker' : 'Brevmottakere';
}

export function BrevmottakerModal({
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
}: Props) {
    const { visBrevmottakereModal, settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const manueltOpprettedeBrevmottaker = hentManueltOpprettedeBrevmottakere(brevmottakere);

    return (
        <Modal
            open={visBrevmottakereModal}
            onClose={() => settVisBrevmottakereModal(false)}
            header={{
                heading: utledHeading(
                    manueltOpprettedeBrevmottaker.length,
                    !behandlingErRedigerbar
                ),
                size: 'medium',
            }}
            width={'40rem'}
            portal={true}
        >
            {visBrevmottakereModal && (
                <>
                    <BrevmottakerModalBody
                        brevmottakere={brevmottakere}
                        opprettBrevmottaker={opprettBrevmottaker}
                        slettBrevmottaker={slettBrevmottaker}
                    />
                    <BrevmottakerModalFooter />
                </>
            )}
        </Modal>
    );
}
