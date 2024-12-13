import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { TextField } from '@navikt/ds-react';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
    required?: boolean;
    description?: React.ReactNode;
};

export function AdresselinjeFelt({
    name,
    label,
    erLesevisning,
    required = true,
    description = null,
}: Props) {
    const { control, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: required ? 'Addresselinje 1 er påkrevd.' : undefined,
                maxLength: { value: 80, message: 'Feltet kan ikke inneholde mer enn 80 tegn.' },
            }}
            render={({ field, fieldState }) => {
                return (
                    <TextField
                        label={label}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={
                            (fieldState.isTouched || formState.isSubmitted) &&
                            fieldState.error?.message
                        }
                        description={description}
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
