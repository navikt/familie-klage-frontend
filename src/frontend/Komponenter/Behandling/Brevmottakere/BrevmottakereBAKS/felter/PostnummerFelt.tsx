import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFeltnavn, BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { TextField } from '@navikt/ds-react';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function PostnummerFelt({ name, label, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required:
                    getValues()[BrevmottakerFeltnavn.LAND] === 'NO'
                        ? 'Postnummer er påkrevd om landet er Norge.'
                        : false,
                maxLength: { value: 10, message: 'Feltet kan ikke inneholde mer enn 10 tegn.' },
            }}
            render={({ field, fieldState }) => {
                return (
                    <TextField
                        label={label}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={
                            (fieldState.isDirty || fieldState.isTouched || formState.isSubmitted) &&
                            fieldState.error?.message
                        }
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
