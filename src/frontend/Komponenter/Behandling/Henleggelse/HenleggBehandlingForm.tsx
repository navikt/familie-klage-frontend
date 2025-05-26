import { Fieldset, VStack } from '@navikt/ds-react';
import { HenlagtÅrsakFelt } from './HenlagtÅrsakFelt';
import { SendTrukketKlageBrevFelt } from './SendTrukketKlageBrevFelt';
import React from 'react';
import { erHenlagtÅrsakTrukketTilbake, HenlagtÅrsak } from './domain/henlagtÅrsak';
import {
    erPersonopplysningerTilknyttetFullmakt,
    harPersonopplysningerVergemål,
    IPersonopplysninger,
} from '../../../App/typer/personopplysninger';
import { FieldErrors, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useOnUnmount } from '../../../App/hooks/useOnUnmount';
import { useOnFormSubmitSuccessful } from '../../../App/hooks/useOnFormSubmitSuccessful';
import { useConfirmBrowserRefresh } from '../../../App/hooks/useConfirmBrowserRefresh';

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
        control,
        handleSubmit,
        formState: { isDirty },
        reset,
        watch,
    } = form;

    useOnUnmount(() => reset());
    useOnFormSubmitSuccessful(control, () => reset());
    useConfirmBrowserRefresh({ enabled: isDirty });

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
