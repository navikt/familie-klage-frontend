import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HStack, Modal, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    BrevmottakerPersonUtenIdentFeltnavn,
    BrevmottakerPersonUtenIdentForm,
    BrevmottakerPersonUtenIdentFormValues,
} from './form/BrevmottakerPersonUtenIdentForm';
import { BrevmottakerDetaljer } from './BrevmottakerDetaljer';
import { erEnBrevmottakerPersonUtenIdentDødsbo, mapTilMottakerRolle } from '../../brevmottaker';
import {
    lagNyBrevmottakerOrganisasjon,
    lagNyBrevmottakerPersonUtenIdent,
    NyBrevmottaker,
    NyBrevmottakerType,
} from '../../nyBrevmottaker';
import { SlettbarBrevmottaker } from '../../slettbarBrevmottaker';
import { useForm } from 'react-hook-form';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';

import {
    Brevmottakere,
    erInstitusjonBrevmottaker,
    hentAlleBrevmottakereSomListe,
    hentManueltOpprettedeBrevmottakere,
} from '../../brevmottakere';
import {
    BrevmottakerOrganisasjonFeltnavn,
    BrevmottakerOrganisasjonForm,
    BrevmottakerOrganisasjonFormValues,
} from './OrganisasjonForm/BrevmottakerOrganisasjonForm';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../../App/context/toggles';
import { uuid4 } from '@sentry/core';

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
    const { toggles } = useToggles();

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

    const brevmottakerOrganisasjonForm = useForm<BrevmottakerOrganisasjonFormValues>({
        defaultValues: {
            [BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER]: '',
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN]: '',
            [BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON]: '',
        },
    });

    const manueltOpprettedeBrevmottakere = hentManueltOpprettedeBrevmottakere(brevmottakere);
    const antallBrevmottakere = manueltOpprettedeBrevmottakere.length;
    const institusjonErBrevmottaker = erInstitusjonBrevmottaker(brevmottakere);

    const [visForm, settVisForm] = useState(manueltOpprettedeBrevmottakere.length === 0);
    const [brevmottakerType, settBrevmottakerType] = useState<NyBrevmottakerType>(
        NyBrevmottakerType.PERSON_UTEN_IDENT
    );

    async function onSubmitBrevmottakerPersonUtenIdentForm(
        brevmottakerFormValues: BrevmottakerPersonUtenIdentFormValues
    ): Promise<Awaited<void>> {
        return opprettBrevmottaker(lagNyBrevmottakerPersonUtenIdent(brevmottakerFormValues))
            .then(() => settVisForm(false))
            .catch((error: Error) =>
                brevmottakerPersonUtenIdentForm.setError('root', { message: error.message })
            );
    }

    async function onSubmitBrevmottakerOrganisasjonForm(
        brevmottakerFormValues: BrevmottakerOrganisasjonFormValues
    ): Promise<Awaited<void>> {
        return opprettBrevmottaker(lagNyBrevmottakerOrganisasjon(brevmottakerFormValues))
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
                        key={uuid4()}
                        brevmottaker={brevmottaker}
                        slettBrevmottaker={slettBrevmottakerOgVisFormHvisNødvendig}
                    />
                ))}
                {visForm && (
                    <>
                        <Heading size={'medium'}>Ny brevmottaker</Heading>
                        {toggles[ToggleName.MANUELL_BREVMOTTAKER_ORGANISASJON] && (
                            <RadioGroup
                                legend={'Mottakertype'}
                                value={brevmottakerType}
                                onChange={settBrevmottakerType}
                            >
                                <HStack gap={'6'}>
                                    <Radio value={NyBrevmottakerType.PERSON_UTEN_IDENT}>
                                        Person
                                    </Radio>
                                    <Radio value={NyBrevmottakerType.ORGANISASJON}>
                                        Organisasjon
                                    </Radio>
                                </HStack>
                            </RadioGroup>
                        )}
                        {
                            {
                                [NyBrevmottakerType.PERSON_MED_IDENT]: null,
                                [NyBrevmottakerType.PERSON_UTEN_IDENT]: (
                                    <BrevmottakerPersonUtenIdentForm
                                        form={brevmottakerPersonUtenIdentForm}
                                        onSubmit={onSubmitBrevmottakerPersonUtenIdentForm}
                                        onCancel={() => settVisForm(false)}
                                        isCancellable={antallBrevmottakere > 0}
                                        valgteMottakerRoller={mapTilMottakerRolle(
                                            hentAlleBrevmottakereSomListe(brevmottakere)
                                        )}
                                    />
                                ),
                                [NyBrevmottakerType.ORGANISASJON]: (
                                    <BrevmottakerOrganisasjonForm
                                        form={brevmottakerOrganisasjonForm}
                                        onSubmit={onSubmitBrevmottakerOrganisasjonForm}
                                        onCancel={() => settVisForm(false)}
                                        isCancellable={antallBrevmottakere > 0}
                                    />
                                ),
                            }[brevmottakerType]
                        }
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
