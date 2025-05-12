import React from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { Henlagtårsak, erHenlagtÅrsakTrukketTilbake } from './Henlagtårsak';
import { Alert, Box, Button, Fieldset, Modal, VStack } from '@navikt/ds-react';
import { Link } from '@navikt/ds-react';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import {
    erPersonopplysningerTilknyttetFullmakt,
    harPersonopplysningerVergemål,
    IPersonopplysninger,
} from '../../../App/typer/personopplysninger';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { HenlagtÅrsakFelt } from './HenlagtÅrsakFelt';
import { SendTrukketKlageBrevFelt } from './SendTrukketKlageBrevFelt';
import { useHentBrev } from './useHentBrev';
import { useHenleggBehandling } from './useHenleggBehandling';
import { LinkIcon } from '@navikt/aksel-icons';

export const CustomFormErrors: Record<
    'onSubmitError' | 'visBrevError',
    {
        id: `root.${string}`;
        lookup: (errors: FieldErrors<FormValues>) => string | undefined;
    }
> = {
    onSubmitError: {
        id: 'root.onSubmitError',
        lookup: (errors) => errors?.root?.onSubmitError?.message,
    },
    visBrevError: {
        id: 'root.visBrevError',
        lookup: (errors) => errors?.root?.visBrevError?.message,
    },
};

interface FormValues {
    [Feltnavn.HENLAGT_ÅRSAK]: Henlagtårsak | null;
    [Feltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: boolean | null;
}

interface ValidFormValues extends FormValues {
    [Feltnavn.HENLAGT_ÅRSAK]: Henlagtårsak;
}

export enum Feltnavn {
    HENLAGT_ÅRSAK = 'henlagtÅrsak',
    SEND_BREV_OM_TRUKKET_KLAGE = 'sendBrevOmTrukketKlage',
}

interface Props {
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
}

export function HenleggModalNy({ behandling, personopplysninger }: Props) {
    const navigate = useNavigate();
    const { visHenleggModal, settVisHenleggModal } = useBehandling();
    const { settToast } = useApp();
    const { henleggBhandling } = useHenleggBehandling();
    const { hentBrev } = useHentBrev();

    const form = useForm<FormValues, unknown, ValidFormValues>({
        mode: 'onChange',
        defaultValues: {
            [Feltnavn.HENLAGT_ÅRSAK]: null,
            [Feltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: null,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
        watch,
        setError,
    } = form;

    async function onSubmit(values: ValidFormValues): Promise<Awaited<void>> {
        return henleggBhandling(behandling.id, values.henlagtÅrsak, values.sendBrevOmTrukketKlage)
            .then(() => {
                settVisHenleggModal(false);
                settToast(EToast.BEHANDLING_HENLAGT);
                navigate(`/behandling/${behandling.id}/resultat`);
            })
            .catch((error: Error) => {
                setError(CustomFormErrors.onSubmitError.id, { message: error.message });
            });
    }

    async function hentOgÅpneBrevINyFane(): Promise<Awaited<void>> {
        return hentBrev(behandling.id)
            .then((data) => {
                åpnePdfIEgenTab(
                    base64toBlob(data, 'application/pdf'),
                    'Forhåndsvisning av trukket søknadsbrev'
                );
            })
            .catch((error: Error) =>
                setError(CustomFormErrors.visBrevError.id, { message: error.message })
            );
    }

    function lukkModal() {
        settVisHenleggModal(false);
        reset();
    }

    const erHenlagtÅrsakTrukketTilbakeValgt = erHenlagtÅrsakTrukketTilbake(
        watch(Feltnavn.HENLAGT_ÅRSAK)
    );

    const erTilknyttetFullmakt = erPersonopplysningerTilknyttetFullmakt(personopplysninger);
    const harVergemål = harPersonopplysningerVergemål(personopplysninger);

    const skalViseTilleggsvalg =
        !harVergemål && !erTilknyttetFullmakt && erHenlagtÅrsakTrukketTilbakeValgt;

    const onSubmitError = CustomFormErrors.onSubmitError.lookup(errors);
    const visBrevError = CustomFormErrors.visBrevError.lookup(errors);

    return (
        <Modal
            header={{ heading: 'Henlegg behandling', closeButton: true }}
            open={visHenleggModal}
            onClose={lukkModal}
            aria-label={'Velg årsak til henleggelse av behandlingen'}
            width={'medium'}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <VStack gap={'4'}>
                            <Fieldset legend={'Henlegg behandling'} hideLegend={true}>
                                <HenlagtÅrsakFelt />
                                {skalViseTilleggsvalg && <SendTrukketKlageBrevFelt />}
                            </Fieldset>
                            {skalViseTilleggsvalg && (
                                <Box paddingBlock={'space-12'}>
                                    <Link onClick={hentOgÅpneBrevINyFane} href={'#'}>
                                        Forhåndsvis brev
                                        <LinkIcon title={'Forhåndsvis brev'} fontSize={'1.5rem'} />
                                    </Link>
                                </Box>
                            )}
                            {visBrevError && <Alert variant={'error'}>{visBrevError}</Alert>}
                            {onSubmitError && <Alert variant={'error'}>{onSubmitError}</Alert>}
                            {harVergemål && erHenlagtÅrsakTrukketTilbakeValgt && (
                                <Alert variant={'warning'}>
                                    Verge registrert på bruker. Brev om trukket klage må sendes
                                    manuelt.
                                </Alert>
                            )}
                            {erTilknyttetFullmakt && erHenlagtÅrsakTrukketTilbakeValgt && (
                                <Alert variant={'warning'}>
                                    Fullmakt registrert på bruker. Brev om trukket klage må sendes
                                    manuelt.
                                </Alert>
                            )}
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant={'primary'}
                            type={'submit'}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            Henlegg
                        </Button>
                        <Button variant={'tertiary'} onClick={lukkModal} disabled={isSubmitting}>
                            Avbryt
                        </Button>
                    </Modal.Footer>
                </form>
            </FormProvider>
        </Modal>
    );
}
