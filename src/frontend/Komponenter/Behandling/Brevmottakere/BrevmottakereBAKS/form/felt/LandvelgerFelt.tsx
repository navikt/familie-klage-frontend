import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Mottaker } from '../../BrevmottakereBAKS';
import { EøsLandkode } from '../../../../../../Felles/Landvelger/landkode';
import { Landvelger } from '../../../../../../Felles/Landvelger/Landvelger';
import { BrevmottakerFeltnavn } from '../brevmottakerFeltnavn';
import { BrevmottakerFeltProps } from '../brevmottakerFeltProps';

type Props = BrevmottakerFeltProps;

export function LandvelgerFelt({ feltnavn, visningsnavn, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            rules={{
                required: 'Land er påkrevd.',
                validate: (landkode) => {
                    const mottaker = getValues()[BrevmottakerFeltnavn.MOTTAKER];
                    if (
                        landkode === EøsLandkode.NO &&
                        mottaker === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE
                    ) {
                        return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                    }
                    return undefined;
                },
                deps: [BrevmottakerFeltnavn.POSTNUMMER, BrevmottakerFeltnavn.POSTSTED],
            }}
            name={feltnavn}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <Landvelger
                        label={visningsnavn}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onToggleSelected={(option, isSelected) => {
                            field.onChange(isSelected ? option : '');
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
