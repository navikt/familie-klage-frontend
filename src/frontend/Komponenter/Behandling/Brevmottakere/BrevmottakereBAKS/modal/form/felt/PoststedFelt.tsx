import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltProps } from '../brevmottakerFeltProps';
import { BrevmottakerFeltnavn } from '../brevmottakerFeltnavn';

type Props = BrevmottakerFeltProps;

export function PoststedFelt({ feltnavn, visningsnavn, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={feltnavn}
            rules={{
                required:
                    getValues(BrevmottakerFeltnavn.LANDKODE) === EøsLandkode.NO
                        ? 'Poststed er påkrevd om landet er Norge.'
                        : false,
                maxLength: { value: 50, message: 'Poststed kan inneholde maks 50 tegn.' },
            }}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <TextField
                        label={visningsnavn}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
