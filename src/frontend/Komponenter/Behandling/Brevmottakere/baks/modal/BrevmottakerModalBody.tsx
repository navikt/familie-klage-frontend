import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Modal, VStack } from '@navikt/ds-react';

import {
    BrevmottakerPersonUtenIdentFeltnavn,
    BrevmottakerPersonUtenIdentForm,
    BrevmottakerPersonUtenIdentFormValues,
} from './form/BrevmottakerPersonUtenIdentForm';
import { BrevmottakerDetaljer } from './BrevmottakerDetaljer';
import { erEnBrevmottakerPersonUtenIdentDødsbo, mapTilMottakerRolle } from '../../brevmottaker';
import { lagNyBrevmottakerPersonUtenIdent, NyBrevmottaker } from '../../nyBrevmottaker';
import { SlettbarBrevmottaker } from '../../slettbarBrevmottaker';
import { useForm } from 'react-hook-form';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';

import {
    Brevmottakere,
    erInstitusjonBrevmottaker,
    hentAlleBrevmottakereSomListe,
    hentManueltOpprettedeBrevmottakere,
} from '../../brevmottakere';

type Props = {
    brevmottakere: Brevmottakere;
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<Awaited<void>>;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<Awaited<void>>;
};

export function BrevmottakerModalBody({
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
}: Props) {
    const brevmottakerPersonUtenIdentForm = useForm<BrevmottakerPersonUtenIdentFormValues>({
        defaultValues: {
            [BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerPersonUtenIdentFeltnavn.NAVN]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]: '',
        },
    });

    const manueltOpprettedeBrevmottakere = hentManueltOpprettedeBrevmottakere(brevmottakere);
    const antallBrevmottakere = manueltOpprettedeBrevmottakere.length;
    const institusjonErBrevmottaker = erInstitusjonBrevmottaker(brevmottakere);

    const [visForm, settVisForm] = useState(manueltOpprettedeBrevmottakere.length === 0);

    async function onSubmitBrevmottakerPersonUtenIdentForm(
        brevmottakerFormValues: BrevmottakerPersonUtenIdentFormValues
    ): Promise<Awaited<void>> {
        return opprettBrevmottaker(lagNyBrevmottakerPersonUtenIdent(brevmottakerFormValues))
            .then(() => settVisForm(false))
            .catch((error: Error) =>
                brevmottakerPersonUtenIdentForm.setError('root', { message: error.message })
            );
    }

    async function slettBrevmottakerOgVisFormHvisNødvendig(
        slettbarBrevmottaker: SlettbarBrevmottaker
    ): Promise<Awaited<void>> {
        return slettBrevmottaker(slettbarBrevmottaker).then(() => {
            if (antallBrevmottakere === 1) {
                settVisForm(true);
            }
        });
    }

    const visLeggTilNyBrevmottakerKnapp =
        !institusjonErBrevmottaker &&
        !erEnBrevmottakerPersonUtenIdentDødsbo(manueltOpprettedeBrevmottakere) &&
        !visForm &&
        antallBrevmottakere === 1;

    return (
        <Modal.Body>
            <VStack gap={'4'}>
                {institusjonErBrevmottaker ? (
                    <Alert variant={'info'}>
                        Brev sendes til institusjon. Legg til mottaker dersom brev skal sendes til
                        fullmektig.
                    </Alert>
                ) : (
                    <Alert variant={'info'}>
                        Brev sendes til brukers folkeregistrerte adresse eller annen foretrukken
                        kanal. Legg til mottaker dersom brev skal sendes til utenlandsk adresse,
                        fullmektig, verge eller dødsbo.
                    </Alert>
                )}
                {manueltOpprettedeBrevmottakere.map((brevmottaker) => (
                    <BrevmottakerDetaljer
                        key={brevmottaker.mottakerRolle}
                        brevmottaker={brevmottaker}
                        slettBrevmottaker={slettBrevmottakerOgVisFormHvisNødvendig}
                    />
                ))}
                {visForm && (
                    <>
                        <Heading size={'medium'}>Ny brevmottaker</Heading>
                        <BrevmottakerPersonUtenIdentForm
                            form={brevmottakerPersonUtenIdentForm}
                            onSubmit={onSubmitBrevmottakerPersonUtenIdentForm}
                            onCancel={() => settVisForm(false)}
                            isCancellable={antallBrevmottakere > 0}
                            valgteMottakerRoller={mapTilMottakerRolle(
                                hentAlleBrevmottakereSomListe(brevmottakere)
                            )}
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
