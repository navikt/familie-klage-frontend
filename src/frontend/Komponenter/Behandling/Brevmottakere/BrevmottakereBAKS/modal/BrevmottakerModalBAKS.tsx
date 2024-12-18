import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, VStack } from '@navikt/ds-react';

import { BrevmottakerTabell } from './tabell/BrevmottakerTabell';
import { useApp } from '../../../../../App/context/AppContext';
import { BrevmottakerForm } from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { Brevmottaker, OpprettBrevmottakerDto, utledHeading } from '../brevmottaker';
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

export function BrevmottakerModalBAKS({
    behandlingId,
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
    erLesevisning,
}: Props) {
    const { settVisBrevmottakereModal, visBrevmottakereModal } = useApp();
    const [visSkjema, settVisSkjema] = useState(false);

    const erBrevmottakerMedDødsbo = brevmottakere
        .map((brevmottaker) => brevmottaker.mottakertype)
        .some((mottakertype) => Mottakertype.DØDSBO === mottakertype);

    const erSkjemaSynlig =
        visBrevmottakereModal &&
        !erBrevmottakerMedDødsbo &&
        ((brevmottakere.length === 0 && !erLesevisning) ||
            (brevmottakere.length === 1 && visSkjema));

    const lukkModal = () => {
        settVisBrevmottakereModal(false);
        settVisSkjema(false);
    };

    const visLeggTilKnapp =
        brevmottakere.length === 1 && !erLesevisning && !erBrevmottakerMedDødsbo;

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
                    <BrevmottakerTabell
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
                            {erBrevmottakerMedDødsbo && (
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
