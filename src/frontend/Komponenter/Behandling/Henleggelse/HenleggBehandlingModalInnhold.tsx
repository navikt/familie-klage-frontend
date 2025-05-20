import React from 'react';
import { Alert, Box, Button, HStack, Modal, Skeleton, VStack } from '@navikt/ds-react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import styled from 'styled-components';
import {
    HENLEGG_BEHANDLING_FORM_ID,
    HenleggBehandlingFeltnavn,
    HenleggBehandlingForm,
    HenleggBehandlingFormServerErrors,
} from './HenleggBehandlingForm';
import { BrevmottakerForm } from '../Brevmottakere/baks/modal/form/BrevmottakerForm';
import { HenlagtÅrsak } from './domain/henlagtÅrsak';
import { ForhåndsvisBrevLenke } from './ForhåndsvisBrevLenke';
import { mapTilMottakerRolle } from '../Brevmottakere/nyBrevmottaker';
import { SendManueltBrevAdvarsel } from './SendManueltBrevAdvarsel';
import { BrevmottakereBox } from './BrevmottakereBox';
import { useHenleggBehandlingModalContext } from './context/HenleggBehandlingModalContextProvider';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';
import { useHenleggBehandlingForm } from './hooks/useHenleggBehandlingForm';
import { useBrevmottakerFormContext } from './context/BrevmottakerFormContextProvider';

const Divider = styled.div`
    border: 2px solid #f3f3f3;
`;

interface Props {
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
}

export function HenleggBehandlingModalInnhold({ behandling, personopplysninger }: Props) {
    const { lukkHenleggBehandlingModal } = useHenleggBehandlingModalContext();

    const { brevmottakere, brevmottakereLaster, brevmottakereFeilmelding } =
        useBrevmottakereContext();

    const {
        brevmottakerForm,
        onSubmitBrevmottakerForm,
        lukkBrevmottakerForm,
        erBrevmottakerFormÅpen,
    } = useBrevmottakerFormContext();

    const { henleggBehandlingForm, onSubmitHenleggBehandlingForm } =
        useHenleggBehandlingForm(behandling);

    const henlagtÅrsak = henleggBehandlingForm.watch(HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK);
    const sendBrevOmTrukketKlage = henleggBehandlingForm.watch(
        HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE
    );

    const skalViseBrevmottakereBox =
        behandling.fagsystem !== Fagsystem.EF &&
        henlagtÅrsak === HenlagtÅrsak.TRUKKET_TILBAKE &&
        !!sendBrevOmTrukketKlage;

    const skalViseSendManueltBrevAdvarsel =
        behandling.fagsystem === Fagsystem.EF && henlagtÅrsak === HenlagtÅrsak.TRUKKET_TILBAKE;

    const onHenleggBehandlingSubmitError = HenleggBehandlingFormServerErrors.onSubmitError.lookup(
        henleggBehandlingForm.formState.errors
    );

    if (brevmottakereLaster) {
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
                    <Button variant={'tertiary'} onClick={lukkHenleggBehandlingModal}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </>
        );
    }

    if (brevmottakereFeilmelding) {
        return (
            <>
                <Modal.Body>
                    <Alert variant={'error'}>{brevmottakereFeilmelding}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'tertiary'} onClick={lukkHenleggBehandlingModal}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </>
        );
    }

    return (
        <>
            <Modal.Body>
                <VStack gap={'4'}>
                    <Divider />
                    <HStack as={'div'} justify={'space-between'}>
                        <Box as={'div'} width={erBrevmottakerFormÅpen ? '45%' : '100%'}>
                            <VStack gap={'4'}>
                                {skalViseSendManueltBrevAdvarsel && (
                                    <SendManueltBrevAdvarsel
                                        personopplysninger={personopplysninger}
                                    />
                                )}
                                <HenleggBehandlingForm
                                    form={henleggBehandlingForm}
                                    onSubmit={onSubmitHenleggBehandlingForm}
                                    personopplysninger={personopplysninger}
                                />
                                {skalViseBrevmottakereBox && <BrevmottakereBox />}
                                {sendBrevOmTrukketKlage && (
                                    <ForhåndsvisBrevLenke behandling={behandling} />
                                )}
                            </VStack>
                        </Box>
                        {erBrevmottakerFormÅpen && (
                            <>
                                <Divider />
                                <Box as={'div'} width={'45%'}>
                                    <BrevmottakerForm
                                        form={brevmottakerForm}
                                        onSubmit={onSubmitBrevmottakerForm}
                                        onCancel={lukkBrevmottakerForm}
                                        personopplysninger={personopplysninger}
                                        valgteMottakerRoller={mapTilMottakerRolle(brevmottakere)}
                                    />
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
                    disabled={henleggBehandlingForm.formState.isSubmitting}
                    loading={henleggBehandlingForm.formState.isSubmitting}
                >
                    Henlegg
                </Button>
                <Button
                    variant={'tertiary'}
                    onClick={lukkHenleggBehandlingModal}
                    disabled={henleggBehandlingForm.formState.isSubmitting}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </>
    );
}
