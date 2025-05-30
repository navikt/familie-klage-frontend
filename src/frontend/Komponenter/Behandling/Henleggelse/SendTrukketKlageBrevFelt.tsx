import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { HenleggBehandlingFeltnavn, HenleggBehandlingFormValues } from './HenleggBehandlingForm';
import { useBrevmottakerFormActionsContext } from './context/BrevmottakerFormActionsContextProvider';

export function SendTrukketKlageBrevFelt() {
    const { control } = useFormContext<HenleggBehandlingFormValues>();
    const { skjulForm } = useBrevmottakerFormActionsContext();

    const { field, fieldState, formState } = useController({
        name: HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE,
        control,
        rules: {
            validate: (value) =>
                value === null ? 'Velg hvorvidt brev om trukket klage skal sendes.' : undefined,
        },
    });

    return (
        <>
            <RadioGroup
                legend={'Send brev om trukket klage'}
                name={field.name}
                value={field.value}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(value) => {
                    if (value !== true) {
                        skjulForm();
                    }
                    field.onChange(value);
                }}
                error={fieldState.error?.message}
                readOnly={formState.isSubmitting}
            >
                <Stack gap={'0 6'} direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                    <Radio value={true}>Ja</Radio>
                    <Radio value={false}>Nei</Radio>
                </Stack>
            </RadioGroup>
        </>
    );
}
