import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { Mottaker, mottakerVisningsnavn } from '../BrevmottakereBAKS';
import { BrevmottakerFeltnavn, BrevmottakerFormState } from '../BrevmottakerForm';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function MottakerFelt({ name, label, erLesevisning }: Props) {
    const { control, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: 'Mottaker er påkrevd.',
                deps: [BrevmottakerFeltnavn.LANDKODE],
            }}
            render={({ field, fieldState }) => {
                return (
                    <Select
                        label={label}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={
                            (fieldState.isTouched || formState.isSubmitted) &&
                            fieldState.error?.message
                        }
                        readOnly={erLesevisning}
                    >
                        {Object.values(Mottaker).map((mottaker) => (
                            <option key={mottaker} value={mottaker}>
                                {mottakerVisningsnavn[mottaker]}
                            </option>
                        ))}
                    </Select>
                );
            }}
        />
    );
}
