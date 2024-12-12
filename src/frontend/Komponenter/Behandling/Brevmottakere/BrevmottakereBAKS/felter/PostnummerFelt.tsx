import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { TextField } from '@navikt/ds-react';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
};

export function PostnummerFelt({ name, label }: Props) {
    const { control, getValues } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: getValues()['land'] === 'NO' ? 'Dette feltet er påkrevd' : false,
                maxLength: { value: 10, message: 'Feltet kan ikke inneholde mer enn 10 tegn' },
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
