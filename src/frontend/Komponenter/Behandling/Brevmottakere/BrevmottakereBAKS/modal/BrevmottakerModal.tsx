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
    const { settVisBrevmottakereModal, visBrevmottakereModal } = useApp();
    const [visSkjema, settVisSkjema] = useState(false);

    const finnesBrevmottakerMedDødsbo = finnesBrevmottakerMedMottakertype(
        brevmottakere,
        Mottakertype.DØDSBO
    );

    const erSkjemaSynlig =
        visBrevmottakereModal &&
        !finnesBrevmottakerMedDødsbo &&
        ((brevmottakere.length === 0 && !erLesevisning) ||
            (brevmottakere.length === 1 && visSkjema));

    const visLeggTilKnapp =
        brevmottakere.length === 1 && !erLesevisning && !finnesBrevmottakerMedDødsbo;

    function lukkModal() {
        settVisBrevmottakereModal(false);
        settVisSkjema(false);
    }

    return (
        <Modal
            open={visBrevmottakereModal}
            onClose={lukkModal}
            header={{ heading: utledHeading(brevmottakere.length, erLesevisning), size: 'medium' }}
            width={'35rem'}
            portal={true}
        >
            <Modal.Body>
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
                    {erSkjemaSynlig ? (
                        <BrevmottakerForm
                            behandlingId={behandlingId}
                            personopplysninger={personopplysninger}
                            brevmottakere={brevmottakere}
                            erLesevisning={false}
                            lukkModal={lukkModal}
                            opprettBrevmottaker={opprettBrevmottaker}
                        />
                    ) : (
                        <VStack gap={'6'} marginBlock={'2 4'}>
                            {finnesBrevmottakerMedDødsbo && (
                                <Alert variant={'info'} inline={true}>
                                    Ved dødsbo kan kun en brevmottaker legges til.
                                </Alert>
                            )}
                            {visLeggTilKnapp && (
                                <div>
                                    <Button
                                        variant={'tertiary'}
                                        size={'small'}
                                        icon={<PlusCircleIcon />}
                                        onClick={() => settVisSkjema(true)}
                                    >
                                        Legg til ny mottaker
                                    </Button>
                                </div>
                            )}
                            <div>
                                <Button size={'medium'} onClick={lukkModal}>
                                    Lukk vindu
                                </Button>
                            </div>
                        </VStack>
                    )}
                </VStack>
            </Modal.Body>
        </Modal>
    );
}
