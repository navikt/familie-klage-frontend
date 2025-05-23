import { Fieldset, VStack } from '@navikt/ds-react';
import { HenlagtÅrsakFelt } from './HenlagtÅrsakFelt';
import { SendTrukketKlageBrevFelt } from './SendTrukketKlageBrevFelt';
import React, { useEffect } from 'react';
import { erHenlagtÅrsakTrukketTilbake, HenlagtÅrsak } from './domain/henlagtÅrsak';
import {
    erPersonopplysningerTilknyttetFullmakt,
    harPersonopplysningerVergemål,
    IPersonopplysninger,
} from '../../../App/typer/personopplysninger';
import { FieldErrors, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useOnUnmount } from '../../../App/hooks/useOnUnmount';

export const HENLEGG_BEHANDLING_FORM_ID = 'henlegg_behandling_form';

export const HenleggBehandlingFormServerErrors: Record<
    'onSubmitError',
    {
        id: `root.${string}`;
        lookup: (errors: FieldErrors<HenleggBehandlingFormValues>) => string | undefined;
    }
> = {
    onSubmitError: {
        id: 'root.onSubmitError',
        lookup: (errors) => errors?.root?.onSubmitError?.message,
    },
};

export interface HenleggBehandlingFormValues {
    [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: HenlagtÅrsak | null;
    [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: boolean | null;
}

export enum HenleggBehandlingFeltnavn {
    HENLAGT_ÅRSAK = 'henlagtÅrsak',
    SEND_BREV_OM_TRUKKET_KLAGE = 'sendBrevOmTrukketKlage',
}

interface Props {
    form: UseFormReturn<HenleggBehandlingFormValues>;
    onSubmit: SubmitHandler<HenleggBehandlingFormValues>;
    personopplysninger: IPersonopplysninger;
}

export function HenleggBehandlingForm({ form, onSubmit, personopplysninger }: Props) {
    const {
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitSuccessful },
    } = form;

    useOnUnmount(() => reset());

    useEffect(() => {
        // It's recommended to reset inside useEffect after submission, see https://react-hook-form.com/docs/useform/reset.
        reset();
    }, [reset, isSubmitSuccessful]);

    const henlagtÅrsak = watch(HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK);

    const erHenlagtÅrsakTrukketTilbakeValgt = erHenlagtÅrsakTrukketTilbake(henlagtÅrsak);
    const erTilknyttetFullmakt = erPersonopplysningerTilknyttetFullmakt(personopplysninger);
    const harVergemål = harPersonopplysningerVergemål(personopplysninger);

    const erMuligÅSendeBrev =
        !harVergemål && !erTilknyttetFullmakt && erHenlagtÅrsakTrukketTilbakeValgt;

    return (
        <FormProvider {...form}>
            <form id={HENLEGG_BEHANDLING_FORM_ID} onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <Fieldset legend={'Henlegg behandling'} hideLegend={true}>
                        <HenlagtÅrsakFelt />
                        {erMuligÅSendeBrev && <SendTrukketKlageBrevFelt />}
                    </Fieldset>
                </VStack>
            </form>
        </FormProvider>
    );
}
