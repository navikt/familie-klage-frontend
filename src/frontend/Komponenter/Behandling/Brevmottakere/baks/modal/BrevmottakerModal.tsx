import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, VStack } from '@navikt/ds-react';

import { RegistrerteBrevmottakere } from './oversikt/RegistrerteBrevmottakere';
import { useApp } from '../../../../../App/context/AppContext';
import { BrevmottakerForm } from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { Brevmottaker, finnesBrevmottakerMedMottakertype } from '../brevmottaker';
import { Mottakertype } from '../mottakertype';
import { OpprettBrevmottakerDto } from '../opprettBrevmottakerDto';

type Props = {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
    opprettBrevmottaker: (opprettBrevmottakerDto: OpprettBrevmottakerDto) => void;
    slettBrevmottaker: (brevmottakerId: string) => void;
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
    const [visForm, settVisForm] = useState(false);

    const finnesBrevmottakerMedDødsbo = finnesBrevmottakerMedMottakertype(
        brevmottakere,
        Mottakertype.DØDSBO
    );

    const erFormSynlig =
        !erLesevisning &&
        (brevmottakere.length === 0 ||
            (brevmottakere.length === 1 && !finnesBrevmottakerMedDødsbo && visForm));

    const erLeggTilNyMottakerKnappSynlig =
        !erLesevisning &&
        !erFormSynlig &&
        !finnesBrevmottakerMedDødsbo &&
        brevmottakere.length === 1;

    function lukkModal() {
        settVisBrevmottakereModal(false);
    }

    return (
        <Modal
            open={visBrevmottakereModal}
            onClose={lukkModal}
            header={{ heading: utledHeading(brevmottakere.length, erLesevisning), size: 'medium' }}
            width={'40rem'}
            portal={true}
        >
            <Modal.Body>
                {visBrevmottakereModal && (
                    <VStack gap={'4'}>
                        <Alert variant={'info'}>
                            Brev sendes til brukers folkeregistrerte adresse eller annen foretrukken
                            kanal. Legg til mottaker dersom brev skal sendes til utenlandsk adresse,
                            fullmektig, verge eller dødsbo.
                        </Alert>
                        <RegistrerteBrevmottakere
                            brevmottakere={brevmottakere}
                            slettBrevmottaker={slettBrevmottaker}
                            erLesevisning={erLesevisning}
                        />
                        {erFormSynlig && (
                            <BrevmottakerForm
                                behandlingId={behandlingId}
                                personopplysninger={personopplysninger}
                                brevmottakere={brevmottakere}
                                erLesevisning={false}
                                lukkModal={lukkModal}
                                opprettBrevmottaker={opprettBrevmottaker}
                            />
                        )}
                        {erLeggTilNyMottakerKnappSynlig && (
                            <div>
                                <Button
                                    variant={'tertiary'}
                                    size={'small'}
                                    icon={<PlusCircleIcon />}
                                    onClick={() => settVisForm(true)}
                                >
                                    Legg til ny mottaker
                                </Button>
                            </div>
                        )}
                    </VStack>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={'tertiary'} size={'medium'} onClick={lukkModal}>
                    Lukk vindu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
