import { Radio, RadioGroup } from '@navikt/ds-react';
import { HenlagtÅrsak } from './domain/henlagtÅrsak';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { HenleggBehandlingFeltnavn, HenleggBehandlingFormValues } from './HenleggBehandlingForm';
import { useBrevmottakerFormActionsContext } from './context/BrevmottakerFormActionsContextProvider';

export function HenlagtÅrsakFelt() {
    const { control } = useFormContext<HenleggBehandlingFormValues>();
    const { skjulForm } = useBrevmottakerFormActionsContext();

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
            onChange={(value) => {
                if (value !== HenlagtÅrsak.TRUKKET_TILBAKE) {
                    skjulForm();
                }
                field.onChange(value);
            }}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            readOnly={formState.isSubmitting}
        >
            <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
            <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
        </RadioGroup>
    );
}
