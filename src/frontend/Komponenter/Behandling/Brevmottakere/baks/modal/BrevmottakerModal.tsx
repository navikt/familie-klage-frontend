import React from 'react';
import { Modal } from '@navikt/ds-react';
import { useApp } from '../../../../../App/context/AppContext';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { BrevmottakerModalBody } from './BrevmottakerModalBody';
import { BrevmottakerModalFooter } from './BrevmottakerModalFooter';
import { BrevmottakerPersonUtenIdent } from '../../brevmottaker';
import { NyBrevmottaker } from '../../nyBrevmottaker';
import { SlettbarBrevmottaker } from '../../slettbarBrevmottaker';

type Props = {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<boolean>;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<boolean>;
    erLesevisning: boolean;
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
    behandlingId,
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
    erLesevisning,
}: Props) {
    const { visBrevmottakereModal, settVisBrevmottakereModal } = useApp();
    return (
        <Modal
            open={visBrevmottakereModal}
            onClose={() => settVisBrevmottakereModal(false)}
            header={{ heading: utledHeading(brevmottakere.length, erLesevisning), size: 'medium' }}
            width={'40rem'}
            portal={true}
        >
            {visBrevmottakereModal && (
                <>
                    <BrevmottakerModalBody
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        brevmottakere={brevmottakere}
                        opprettBrevmottaker={opprettBrevmottaker}
                        slettBrevmottaker={slettBrevmottaker}
                        erLesevisning={erLesevisning}
                    />
                    <BrevmottakerModalFooter />
                </>
            )}
        </Modal>
    );
}
