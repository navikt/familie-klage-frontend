import React from 'react';
import { FieldErrors, FormProvider, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { LandFelt } from './felt/LandFelt';
import { MottakerFelt } from './felt/MottakerFelt';
import { NavnFelt } from './felt/NavnFelt';
import { Adresselinje1Felt } from './felt/Adresselinje1Felt';
import { PostnummerFelt } from './felt/PostnummerFelt';
import { PoststedFelt } from './felt/PoststedFelt';
import { Alert, Button, Fieldset, HStack, VStack } from '@navikt/ds-react';
import { BlankEøsLandkode, EøsLandkode } from '../../../../../../Felles/Landvelger/landkode';
import { IPersonopplysninger } from '../../../../../../App/typer/personopplysninger';
import { BlankMottakerRolle, MottakerRolle } from '../../../mottakerRolle';
import { Adresselinje2Felt } from './felt/Adresselinje2Felt';
import { useBehandling } from '../../../../../../App/context/BehandlingContext';
import { useOnUnmount } from '../../../../../../App/hooks/useOnUnmount';
import { useOnFormSubmitSuccessful } from '../../../../../../App/hooks/useOnFormSubmitSuccessful';
import { useConfirmBrowserRefresh } from '../../../../../../App/hooks/useConfirmBrowserRefresh';

export const CustomFormErrors: Record<
    'onSubmitServerError',
    {
        id: `root.${string}`;
        lookup: (errors: FieldErrors<BrevmottakerFormValues>) => string | undefined;
    }
> = {
    onSubmitServerError: {
        id: 'root.onSubmitServerError',
        lookup: (errors) => errors?.root?.onSubmitServerError?.message,
    },
};

export enum BrevmottakerFeltnavn {
    MOTTAKERROLLE = 'mottakerRolle',
    LANDKODE = 'landkode',
    NAVN = 'navn',
    ADRESSELINJE1 = 'adresselinje1',
    ADRESSELINJE2 = 'adresselinje2',
    POSTNUMMER = 'postnummer',
    POSTSTED = 'poststed',
}

export interface BrevmottakerFormValues {
    [BrevmottakerFeltnavn.MOTTAKERROLLE]: MottakerRolle | BlankMottakerRolle;
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode | BlankEøsLandkode;
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
}

export function useBrevmottakerForm() {
    return useForm<BrevmottakerFormValues>({
        shouldUnregister: true,
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
}

interface Props {
    form: UseFormReturn<BrevmottakerFormValues>;
    onSubmit: SubmitHandler<BrevmottakerFormValues>;
    onCancel: () => void;
    isCancellable?: boolean;
    personopplysninger: IPersonopplysninger;
    valgteMottakerRoller: MottakerRolle[];
}

export function BrevmottakerForm({
    form,
    onSubmit,
    onCancel,
    isCancellable = true,
    personopplysninger,
    valgteMottakerRoller,
}: Props) {
    const { behandlingErRedigerbar } = useBehandling();

    const {
        control,
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
        watch,
        clearErrors,
        reset,
    } = form;

    useOnUnmount(() => reset());
    useOnFormSubmitSuccessful(control, () => reset());
    useConfirmBrowserRefresh({ enabled: isDirty });

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);
    const onSubmitServerError = CustomFormErrors.onSubmitServerError.lookup(errors);

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <Fieldset legend={'Ny brevmottaker'} hideLegend={true}>
                        <MottakerFelt
                            personopplysninger={personopplysninger}
                            valgteMottakerRoller={valgteMottakerRoller}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <LandFelt
                            personopplysninger={personopplysninger}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <NavnFelt erLesevisning={!behandlingErRedigerbar} />
                        <Adresselinje1Felt erLesevisning={!behandlingErRedigerbar} />
                        <Adresselinje2Felt erLesevisning={!behandlingErRedigerbar} />
                        {landkode === EøsLandkode.NO && (
                            <>
                                <PostnummerFelt erLesevisning={!behandlingErRedigerbar} />
                                <PoststedFelt erLesevisning={!behandlingErRedigerbar} />
                            </>
                        )}
                    </Fieldset>
                    {onSubmitServerError && (
                        <Alert
                            variant={'error'}
                            closeButton={true}
                            onClose={() => clearErrors(CustomFormErrors.onSubmitServerError.id)}
                        >
                            {onSubmitServerError}
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
