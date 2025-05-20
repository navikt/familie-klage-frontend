import { Radio, RadioGroup } from '@navikt/ds-react';
import { HenlagtÅrsak } from './domain/henlagtÅrsak';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { HenleggBehandlingFeltnavn, HenleggBehandlingFormValues } from './HenleggBehandlingForm';

export function HenlagtÅrsakFelt() {
    const { control } = useFormContext<HenleggBehandlingFormValues>();

    const { field, fieldState, formState } = useController({
        name: HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK,
        control,
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
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            readOnly={formState.isSubmitting}
        >
            <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
            <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
        </RadioGroup>
    );
}
