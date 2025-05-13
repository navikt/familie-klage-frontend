import { Radio, RadioGroup } from '@navikt/ds-react';
import { Henlagtårsak } from './Henlagtårsak';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { CustomFormErrors, Feltnavn } from './HenleggModalNy';

export function HenlagtÅrsakFelt() {
    const { clearErrors } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: Feltnavn.HENLAGT_ÅRSAK,
        rules: {
            validate: (value) => (value === null ? 'Du må velge en henleggesesårsak.' : undefined),
        },
    });

    return (
        <RadioGroup
            legend={'Velg henleggelsesårsak'}
            name={field.name}
            value={field.value}
            ref={field.ref}
            onChange={(value) => {
                clearErrors(CustomFormErrors.onSubmitError.id);
                field.onChange(value);
            }}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            readOnly={formState.isSubmitting}
        >
            <Radio value={Henlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
            <Radio value={Henlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
        </RadioGroup>
    );
}
