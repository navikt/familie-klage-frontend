import React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Alert, Button, Fieldset, FormSummary, HStack, VStack } from '@navikt/ds-react';
import { BlankMottakerRolle, MottakerRolle } from '../../../mottakerRolle';
import { useBehandling } from '../../../../../../App/context/BehandlingContext';
import { useOnUnmount } from '../../../../../../App/hooks/useOnUnmount';
import { useOnFormSubmitSuccessful } from '../../../../../../App/hooks/useOnFormSubmitSuccessful';
import { useConfirmBrowserRefresh } from '../../../../../../App/hooks/useConfirmBrowserRefresh';
import { OrganisasjonSøk } from '../OrganisasjonSøk';
import { useHentOrganisasjon } from '../../hooks/useHentOrganisasjon';
import { NavnHosOrganisasjonFelt } from './NavnHosOrganisasjonFelt';
import { MottakerFelt } from './MottakerFelt';

export enum BrevmottakerOrganisasjonFeltnavn {
    MOTTAKERROLLE = 'mottakerRolle',
    ORGANISASJONSNUMMER = 'organisasjonsnummer',
    ORGANISASJONSNAVN = 'organisasjonsnavn',
    NAVN_HOS_ORGANISASJON = 'navnHosOrganisasjon',
}

export interface BrevmottakerOrganisasjonFormValues {
    [BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE]: MottakerRolle | BlankMottakerRolle;
    [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER]: string;
    [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN]: string;
    [BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON]: string;
}

interface Props {
    form: UseFormReturn<BrevmottakerOrganisasjonFormValues>;
    onSubmit: SubmitHandler<BrevmottakerOrganisasjonFormValues>;
    onCancel: () => void;
    isCancellable?: boolean;
}

export function BrevmottakerOrganisasjonForm({
    form,
    onSubmit,
    onCancel,
    isCancellable = true,
}: Props) {
    const { behandlingErRedigerbar } = useBehandling();

    const {
        control,
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
        clearErrors,
        reset,
        setError,
        setValue,
        watch,
    } = form;

    useOnUnmount(() => reset());
    useOnFormSubmitSuccessful(control, () => reset());
    useConfirmBrowserRefresh({ enabled: isDirty });

    const hentOrganisasjon = useHentOrganisasjon();

    const hentOgSettOrganisasjon = (organisasjonsnummer: string) => {
        hentOrganisasjon(organisasjonsnummer)
            .then((organisasjon) => {
                setValue(BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER, organisasjonsnummer);
                setValue(BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN, organisasjon.navn);
            })
            .catch((error) => {
                setError('root', {
                    message: `Feil ved henting av organisasjon: ${error.message}`,
                });
            });
    };

    const organisasjonsnavn = watch(BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN);

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <Fieldset legend={'Ny brevmottaker'} hideLegend={true}>
                        <OrganisasjonSøk hentOgSettOrganisasjon={hentOgSettOrganisasjon} />
                        {organisasjonsnavn && (
                            <>
                                <FormSummary>
                                    <FormSummary.Answers>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>Organisasjonsnavn</FormSummary.Label>
                                            <FormSummary.Value>
                                                {organisasjonsnavn}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                    </FormSummary.Answers>
                                </FormSummary>
                                <MottakerFelt erLesevisning={!behandlingErRedigerbar} />
                                <NavnHosOrganisasjonFelt erLesevisning={!behandlingErRedigerbar} />
                            </>
                        )}
                    </Fieldset>
                    {errors.root?.message && (
                        <Alert variant={'error'} closeButton={true} onClose={() => clearErrors()}>
                            {errors.root.message}
                        </Alert>
                    )}
                    <HStack gap={'4'}>
                        {behandlingErRedigerbar && (
                            <Button variant={'primary'} type={'submit'} loading={isSubmitting}>
                                Legg til brevmottaker
                            </Button>
                        )}
                        {behandlingErRedigerbar && isCancellable && !isSubmitting && (
                            <Button variant={'tertiary'} type={'button'} onClick={onCancel}>
                                Avbryt
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </form>
        </FormProvider>
    );
}
