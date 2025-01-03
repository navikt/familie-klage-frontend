import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, VStack } from '@navikt/ds-react';

import { RegistrerteBrevmottakere } from './oversikt/RegistrerteBrevmottakere';
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

export function BrevmottakerModalBody({
    behandlingId,
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
    erLesevisning,
}: Props) {
    const [visForm, settVisForm] = useState(brevmottakere.length === 0 && !erLesevisning);

    const finnesBrevmottakerMedDødsbo = finnesBrevmottakerMedMottakertype(
        brevmottakere,
        Mottakertype.DØDSBO
    );

    const erFormSynlig =
        !erLesevisning &&
        !finnesBrevmottakerMedDødsbo &&
        (brevmottakere.length === 0 || (brevmottakere.length === 1 && visForm));

    const erLeggTilNyMottakerKnappSynlig =
        !erLesevisning &&
        !erFormSynlig &&
        !finnesBrevmottakerMedDødsbo &&
        brevmottakere.length === 1;

    return (
        <Modal.Body>
            <VStack gap={'4'}>
                <Alert variant={'info'}>
                    Brev sendes til brukers folkeregistrerte adresse eller annen foretrukken kanal.
                    Legg til mottaker dersom brev skal sendes til utenlandsk adresse, fullmektig,
                    verge eller dødsbo.
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
                        erLesevisning={erLesevisning}
                        lukkForm={() => settVisForm(false)}
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
        </Modal.Body>
    );
}
