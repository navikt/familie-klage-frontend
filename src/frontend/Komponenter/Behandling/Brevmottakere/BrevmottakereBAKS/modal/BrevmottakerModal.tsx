import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, VStack } from '@navikt/ds-react';

import { RegistrerteBrevmottakere } from './oversikt/RegistrerteBrevmottakere';
import { useApp } from '../../../../../App/context/AppContext';
import { BrevmottakerForm } from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import {
    Brevmottaker,
    finnesBrevmottakerMedMottakertype,
    OpprettBrevmottakerDto,
} from '../brevmottaker';
import { Mottakertype } from '../mottakertype';

const LeggTilKnapp = styled(Button)`
    margin-top: 1rem;
`;

const LukkKnapp = styled(Button)`
    margin-top: 2rem;
`;

type Props = {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
    opprettBrevmottaker: (brevmottaker: OpprettBrevmottakerDto) => void;
    slettBrevmottaker: (brevmottakerId: string) => void;
    erLesevisning: boolean;
};

function utledHeading(antallMottakere: number, erLesevisning: boolean) {
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
            portal
        >
            <Modal.Body>
                <VStack gap={'4'}>
                    <Alert variant="info">
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
                        <>
                            {finnesBrevmottakerMedDødsbo && (
                                <Alert variant={'info'} inline={true}>
                                    Ved dødsbo kan kun en brevmottaker legges til.
                                </Alert>
                            )}
                            {visLeggTilKnapp && (
                                <div>
                                    <LeggTilKnapp
                                        variant={'tertiary'}
                                        size={'small'}
                                        icon={<PlusCircleIcon />}
                                        onClick={() => settVisSkjema(true)}
                                    >
                                        Legg til ny mottaker
                                    </LeggTilKnapp>
                                </div>
                            )}
                            <div>
                                <LukkKnapp onClick={lukkModal}>Lukk vindu</LukkKnapp>
                            </div>
                        </>
                    )}
                </VStack>
            </Modal.Body>
        </Modal>
    );
}
