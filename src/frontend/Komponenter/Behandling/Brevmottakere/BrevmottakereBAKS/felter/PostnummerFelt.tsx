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

export function PostnummerFelt({ name, label, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required:
                    getValues()[BrevmottakerFeltnavn.LANDKODE] === EøsLandkode.NO
                        ? 'Postnummer er påkrevd om landet er Norge.'
                        : false,
                maxLength: { value: 4, message: 'Feltet må inneholde 4 tegn.' },
                minLength: { value: 4, message: 'Feltet må inneholde 4 tegn.' },
            }}
            render={({ field, fieldState }) => {
                return (
                    <TextField
                        htmlSize={4}
                        maxLength={4}
                        type={'number'}
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
