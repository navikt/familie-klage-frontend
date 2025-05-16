import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Modal, VStack } from '@navikt/ds-react';

import { BrevmottakerForm } from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { BrevmottakerDetaljer } from './BrevmottakerDetaljer';
import {
    BrevmottakerPersonUtenIdent,
    erEnBrevmottakerPersonUtenIdentDødsbo,
} from '../../brevmottaker';
import { NyBrevmottaker } from '../../nyBrevmottaker';
import { SlettbarBrevmottaker } from '../../slettbarBrevmottaker';

type Props = {
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<Awaited<void>>;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<Awaited<void>>;
};

export function BrevmottakerModalBody({
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
}: Props) {
    const [visForm, settVisForm] = useState(brevmottakere.length === 0);

    async function slettBrevmottakerOgVisFormHvisNødvendig(
        slettbarBrevmottaker: SlettbarBrevmottaker
    ): Promise<Awaited<void>> {
        return slettBrevmottaker(slettbarBrevmottaker).then(() => {
            if (brevmottakere.length === 1) {
                settVisForm(true);
            }
        });
    }

    const visLeggTilNyBrevmottakerKnapp =
        !erEnBrevmottakerPersonUtenIdentDødsbo(brevmottakere) &&
        !visForm &&
        brevmottakere.length === 1;

    return (
        <Modal.Body>
            <VStack gap={'4'}>
                <Alert variant={'info'}>
                    Brev sendes til brukers folkeregistrerte adresse eller annen foretrukken kanal.
                    Legg til mottaker dersom brev skal sendes til utenlandsk adresse, fullmektig,
                    verge eller dødsbo.
                </Alert>
                {brevmottakere.map((brevmottaker) => (
                    <BrevmottakerDetaljer
                        key={brevmottaker.id}
                        brevmottaker={brevmottaker}
                        slettBrevmottaker={slettBrevmottakerOgVisFormHvisNødvendig}
                    />
                ))}
                {visForm && (
                    <>
                        <Heading size={'medium'}>Ny brevmottaker</Heading>
                        <BrevmottakerForm
                            personopplysninger={personopplysninger}
                            brevmottakere={brevmottakere}
                            opprettBrevmottaker={opprettBrevmottaker}
                            lukkForm={() => settVisForm(false)}
                        />
                    </>
                )}
                {visLeggTilNyBrevmottakerKnapp && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            size={'small'}
                            icon={<PlusCircleIcon />}
                            onClick={() => settVisForm(true)}
                        >
                            Legg til ny brevmottaker
                        </Button>
                    </div>
                )}
            </VStack>
        </Modal.Body>
    );
}
