import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { TextField } from '@navikt/ds-react';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
};

export function NavnFelt({ name, label }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: 'Navn på person eller organisasjon er påkrevd',
                maxLength: {
                    value: 80,
                    message: 'Feltet kan ikke inneholde mer enn 80 tegn',
                },
            }}
            render={({ field, fieldState }) => {
                return (
                    <TextField
                        label={label}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                    />
                );
            }}
        />
    );
}
