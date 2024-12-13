import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFeltnavn, BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function PoststedFelt({ name, label, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required:
                    getValues()[BrevmottakerFeltnavn.LANDKODE] === EøsLandkode.NO
                        ? 'Poststed er påkrevd om landet er Norge.'
                        : false,
                maxLength: { value: 50, message: 'Maks 50 tegn.' },
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
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
