import React from 'react';
import { Modal } from '@navikt/ds-react';
import { useApp } from '../../../../../App/context/AppContext';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { BrevmottakerModalBody } from './BrevmottakerModalBody';
import { BrevmottakerModalFooter } from './BrevmottakerModalFooter';
import { BrevmottakerPersonUtenIdent } from '../../brevmottaker';
import { NyBrevmottaker } from '../../nyBrevmottaker';
import { SlettbarBrevmottaker } from '../../slettbarBrevmottaker';
import { useBehandling } from '../../../../../App/context/BehandlingContext';

type Props = {
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
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
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
}: Props) {
    const { visBrevmottakereModal, settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    return (
        <Modal
            open={visBrevmottakereModal}
            onClose={() => settVisBrevmottakereModal(false)}
            header={{
                heading: utledHeading(brevmottakere.length, !behandlingErRedigerbar),
                size: 'medium',
            }}
            width={'40rem'}
            portal={true}
        >
            {visBrevmottakereModal && (
                <>
                    <BrevmottakerModalBody
                        personopplysninger={personopplysninger}
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
