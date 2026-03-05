import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Heading,
    HStack,
    Modal,
    Radio,
    RadioGroup,
    Skeleton,
    VStack,
} from '@navikt/ds-react';
import {
    HENLEGG_BEHANDLING_FORM_ID,
    HenleggBehandlingFeltnavn,
    HenleggBehandlingForm,
    HenleggBehandlingFormServerErrors,
} from './HenleggBehandlingForm';
import { BrevmottakerPersonUtenIdentForm } from '../Brevmottakere/baks/modal/form/BrevmottakerPersonUtenIdentForm';
import { HenlagtÅrsak } from './domain/henlagtÅrsak';
import { ForhåndsvisBrevLenke } from './ForhåndsvisBrevLenke';
import { mapTilMottakerRolle, NyBrevmottakerType } from '../Brevmottakere/nyBrevmottaker';
import { SendManueltBrevAdvarsel } from './SendManueltBrevAdvarsel';
import { BrevmottakereBox } from './BrevmottakereBox';
import { useHenleggBehandlingModalContext } from './context/HenleggBehandlingModalContextProvider';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';
import { useHenleggBehandlingForm } from './hooks/useHenleggBehandlingForm';
import { useBrevmottakerPersonUtenIdentForm } from './hooks/useBrevmottakerPersonUtenIdentForm';
import { BrevmottakerFormActionsContextProvider } from './context/BrevmottakerFormActionsContextProvider';
import { Divider } from '../../../Felles/Divider/Divider';
import { ToggleName } from '../../../App/context/toggles';
import { useToggles } from '../../../App/context/TogglesContext';
import { BrevmottakerOrganisasjonForm } from '../Brevmottakere/baks/modal/OrganisasjonForm/BrevmottakerOrganisasjonForm';
import { useBrevmottakerOrganisasjonForm } from './hooks/useBrevmottakerOrganisasjonForm';

interface Props {
    behandling: Behandling;
}

export function HenleggBehandlingModalInnhold({ behandling }: Props) {
    const { lukkModal } = useHenleggBehandlingModalContext();
    const { toggles } = useToggles();

    const { brevmottakere, laster, feilmelding } = useBrevmottakereContext();

    const {
        form: henleggBehandlingForm,
        actions: {
            submitForm: submitHenleggBehandlingForm,
            visBrevmottakerForm,
            skjulBrevmottakerForm,
        },
        metadata: { erBrevmottakerFormSynlig },
    } = useHenleggBehandlingForm(behandling);

    const {
        form: brevmottakerPersonUtenIdentForm,
        actions: { submitForm: onSubmitBrevmottakerPersonUtenIdentForm },
    } = useBrevmottakerPersonUtenIdentForm(skjulBrevmottakerForm);

    const {
        form: brevmottakerOrganisasjonForm,
        actions: { submitForm: onSubmitBrevmottakerOrganisasjonForm },
    } = useBrevmottakerOrganisasjonForm(skjulBrevmottakerForm);

    const henlagtÅrsak = henleggBehandlingForm.watch(HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK);
    const sendBrevOmTrukketKlage = henleggBehandlingForm.watch(
        HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE
    );

    const skalViseBrevmottakereBox =
        henlagtÅrsak === HenlagtÅrsak.TRUKKET_TILBAKE && !!sendBrevOmTrukketKlage;
    const skalViseSendManueltBrevAdvarsel =
        behandling.fagsystem === Fagsystem.EF && henlagtÅrsak === HenlagtÅrsak.TRUKKET_TILBAKE;

    const onHenleggBehandlingSubmitError = HenleggBehandlingFormServerErrors.onSubmitError.lookup(
        henleggBehandlingForm.formState.errors
    );

    const [brevmottakerType, settBrevmottakerType] = useState<NyBrevmottakerType>(
        NyBrevmottakerType.PERSON_UTEN_IDENT
    );

    if (laster) {
        return (
            <>
                <Modal.Body>
                    <VStack gap={'5'} as={'div'} height={'10rem'} paddingBlock={'6 0'}>
                        <Skeleton variant={'rectangle'} width={'50%'} height={'1.65rem'} />
                        <Skeleton variant={'rectangle'} width={'50%'} height={'1.65rem'} />
                        <Skeleton variant={'rectangle'} width={'50%'} height={'1.65rem'} />
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'tertiary'} onClick={lukkModal}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </>
        );
    }

    if (feilmelding) {
        return (
            <>
                <Modal.Body>
                    <Alert variant={'error'}>{feilmelding}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'tertiary'} onClick={lukkModal}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </>
        );
    }

    return (
        <BrevmottakerFormActionsContextProvider
            value={{ visForm: visBrevmottakerForm, skjulForm: skjulBrevmottakerForm }}
        >
            <Modal.Body>
                <VStack gap={'4'}>
                    <Divider />
                    <HStack as={'div'} justify={'space-between'}>
                        <Box as={'div'} width={erBrevmottakerFormSynlig ? '45%' : '100%'}>
                            <VStack gap={'4'}>
                                {skalViseSendManueltBrevAdvarsel && <SendManueltBrevAdvarsel />}
                                <HenleggBehandlingForm
                                    form={henleggBehandlingForm}
                                    onSubmit={submitHenleggBehandlingForm}
                                    fagsystem={behandling.fagsystem}
                                />
                                {skalViseBrevmottakereBox && (
                                    <BrevmottakereBox behandling={behandling} />
                                )}
                                {sendBrevOmTrukketKlage && (
                                    <ForhåndsvisBrevLenke behandling={behandling} />
                                )}
                            </VStack>
                        </Box>
                        {erBrevmottakerFormSynlig && (
                            <>
                                <Divider />
                                <Box as={'div'} width={'45%'}>
                                    <VStack gap={'4'}>
                                        <Heading level={'2'} size={'small'}>
                                            Ny brevmottaker
                                        </Heading>
                                        <Alert variant={'info'}>
                                            Legg til en brevmottaker eller lukk skjemaet for å
                                            henlegge behandlingen.
                                        </Alert>
                                        {toggles[ToggleName.MANUELL_BREVMOTTAKER_ORGANISASJON] && (
                                            <RadioGroup
                                                legend={'Mottakertype'}
                                                value={brevmottakerType}
                                                onChange={settBrevmottakerType}
                                            >
                                                <HStack gap={'6'}>
                                                    <Radio
                                                        value={NyBrevmottakerType.PERSON_UTEN_IDENT}
                                                    >
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
                                                        onSubmit={
                                                            onSubmitBrevmottakerPersonUtenIdentForm
                                                        }
                                                        onCancel={skjulBrevmottakerForm}
                                                        valgteMottakerRoller={mapTilMottakerRolle(
                                                            brevmottakere
                                                        )}
                                                    />
                                                ),
                                                [NyBrevmottakerType.ORGANISASJON]: (
                                                    <BrevmottakerOrganisasjonForm
                                                        form={brevmottakerOrganisasjonForm}
                                                        onSubmit={
                                                            onSubmitBrevmottakerOrganisasjonForm
                                                        }
                                                        onCancel={skjulBrevmottakerForm}
                                                    />
                                                ),
                                            }[brevmottakerType]
                                        }
                                    </VStack>
                                </Box>
                            </>
                        )}
                    </HStack>
                    {onHenleggBehandlingSubmitError && (
                        <Alert
                            closeButton={true}
                            onClose={() =>
                                henleggBehandlingForm.clearErrors(
                                    HenleggBehandlingFormServerErrors.onSubmitError.id
                                )
                            }
                            variant={'error'}
                        >
                            {onHenleggBehandlingSubmitError}
                        </Alert>
                    )}
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    form={HENLEGG_BEHANDLING_FORM_ID}
                    variant={'primary'}
                    type={'submit'}
                    disabled={
                        henleggBehandlingForm.formState.isSubmitting || erBrevmottakerFormSynlig
                    }
                    loading={henleggBehandlingForm.formState.isSubmitting}
                >
                    Henlegg
                </Button>
                <Button
                    variant={'tertiary'}
                    type={'button'}
                    onClick={lukkModal}
                    disabled={henleggBehandlingForm.formState.isSubmitting}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </BrevmottakerFormActionsContextProvider>
    );
}
