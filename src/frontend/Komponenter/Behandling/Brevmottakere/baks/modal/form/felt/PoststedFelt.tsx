import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';

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
                        ? `${visningsnavn} er påkrevd om landet er Norge.`
                        : undefined,
                maxLength: { value: 50, message: `${visningsnavn} kan inneholde maks 50 tegn.` },
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
                        readOnly={erLesevisning || formState.isSubmitting}
                    />
                );
            }}
        />
    );
}
