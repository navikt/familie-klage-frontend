import Landvelger from '../../../../../Felles/Landvelger/Landvelger';
import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import { BrevmottakerFormState } from '../BrevmottakerForm';
import { Mottaker } from '../BrevmottakereBAKS';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function LandvelgerFelt({ name, label, erLesevisning }: Props) {
    const { control, trigger, getValues } = useFormContext();
    return (
        <Controller
            control={control}
            rules={{
                required: 'Du må velge et land.',
                validate: (landkode) => {
                    trigger('postnummer');
                    const mottaker = getValues()['mottaker'];
                    if (mottaker === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE && landkode === 'NO') {
                        return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                    }
                    return undefined;
                },
            }}
            name={name}
            render={({ field, fieldState }) => {
                return (
                    <Landvelger
                        label={label}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onToggleSelected={(option, isSelected) => {
                            field.onChange(isSelected ? option : undefined);
                        }}
                        error={fieldState.error?.message}
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
