import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { CustomFormErrors, Feltnavn } from './HenleggModalNy';

export function SendTrukketKlageBrevFelt() {
    const { clearErrors } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: Feltnavn.SEND_BREV_OM_TRUKKET_KLAGE,
        shouldUnregister: true,
        rules: {
            validate: (value) =>
                value === null ? 'Velg hvorvidt brev om trukket klage skal sendes.' : undefined,
        },
    });

    return (
        <RadioGroup
            legend={'Send brev om trukket klage'}
            name={field.name}
            value={field.value}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={(value) => {
                clearErrors(CustomFormErrors.onSubmitError.id);
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
    );
}
