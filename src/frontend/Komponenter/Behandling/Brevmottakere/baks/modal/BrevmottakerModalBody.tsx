import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Modal, VStack } from '@navikt/ds-react';

import {
    BrevmottakerFeltnavn,
    BrevmottakerForm,
    BrevmottakerFormValues,
} from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
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
    hentBrevmottakerPersonUtenIdenter,
} from '../../brevmottakere';

type Props = {
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottakere;
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<Awaited<void>>;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<Awaited<void>>;
};

export function BrevmottakerModalBody({
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
}: Props) {
    const form = useForm<BrevmottakerFormValues>({
        defaultValues: {
            [BrevmottakerFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerFeltnavn.NAVN]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerFeltnavn.POSTNUMMER]: '',
            [BrevmottakerFeltnavn.POSTSTED]: '',
        },
    });

    const brevmottakerPersonUtenIdenter = hentBrevmottakerPersonUtenIdenter(brevmottakere);
    const antallBrevmottakere = brevmottakerPersonUtenIdenter.length;
    const institusjonErBrevmottaker = erInstitusjonBrevmottaker(brevmottakere);

    const [visForm, settVisForm] = useState(brevmottakerPersonUtenIdenter.length === 0);

    async function onSubmitBrevmottakerForm(
        brevmottakerFormValues: BrevmottakerFormValues
    ): Promise<Awaited<void>> {
        return opprettBrevmottaker(lagNyBrevmottakerPersonUtenIdent(brevmottakerFormValues))
            .then(() => settVisForm(false))
            .catch((error: Error) => form.setError('root', { message: error.message }));
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
        !erEnBrevmottakerPersonUtenIdentDødsbo(brevmottakerPersonUtenIdenter) &&
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
                {brevmottakerPersonUtenIdenter.map((brevmottaker) => (
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
                            form={form}
                            onSubmit={onSubmitBrevmottakerForm}
                            onCancel={() => settVisForm(false)}
                            isCancellable={antallBrevmottakere > 0}
                            personopplysninger={personopplysninger}
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
