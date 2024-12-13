import Landvelger from '../../../../../Felles/Landvelger/Landvelger';
import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import { BrevmottakerFeltnavn, BrevmottakerFormState } from '../BrevmottakerForm';
import { Mottaker } from '../BrevmottakereBAKS';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function LandvelgerFelt({ name, label, erLesevisning }: Props) {
    const { control, getValues, formState, resetField } = useFormContext();
    return (
        <Controller
            control={control}
            rules={{
                required: 'Land er påkrevd.',
                validate: (landkode) => {
                    const mottaker = getValues()['mottaker'];
                    if (landkode === 'NO' && mottaker === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE) {
                        return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                    }
                    return undefined;
                },
                deps: [BrevmottakerFeltnavn.POSTNUMMER, BrevmottakerFeltnavn.POSTSTED],
            }}
            name={name}
            render={({ field, fieldState }) => {
                return (
                    <Landvelger
                        label={label}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onToggleSelected={(option, isSelected) => {
                            if (option !== 'NO') {
                                resetField(BrevmottakerFeltnavn.POSTNUMMER);
                                resetField(BrevmottakerFeltnavn.POSTSTED);
                            }
                            field.onChange(isSelected ? option : undefined);
                        }}
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
