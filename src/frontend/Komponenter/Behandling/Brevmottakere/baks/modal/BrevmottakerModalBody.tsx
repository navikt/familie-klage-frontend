import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, VStack } from '@navikt/ds-react';

import { BrevmottakerForm } from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { Brevmottaker } from '../brevmottaker';
import { OpprettBrevmottakerDto } from '../opprettBrevmottakerDto';
import { BrevmottakerDetaljer } from './BrevmottakerDetaljer';

type Props = {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
    opprettBrevmottaker: (opprettBrevmottakerDto: OpprettBrevmottakerDto) => Promise<boolean>;
    slettBrevmottaker: (brevmottakerId: string) => Promise<boolean>;
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
    const [visForm, settVisForm] = useState(brevmottakere.length === 0);

    async function slettBrevmottakerOgVisFormHvisNødvendig(
        brevmottakerId: string
    ): Promise<boolean> {
        // TODO : Dette kan gjøres bedre med react-query
        const erSuksess = await slettBrevmottaker(brevmottakerId);
        if (erSuksess && brevmottakere.length === 1) {
            settVisForm(true);
        }
        return Promise.resolve(erSuksess);
    }

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
                        erLesevisning={erLesevisning}
                    />
                ))}
                {visForm && (
                    <BrevmottakerForm
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        brevmottakere={brevmottakere}
                        erLesevisning={erLesevisning}
                        lukkForm={() => settVisForm(false)}
                        opprettBrevmottaker={opprettBrevmottaker}
                    />
                )}
                {!visForm && brevmottakere.length === 1 && (
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
