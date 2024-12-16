import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { Mottaker, mottakerVisningsnavn } from '../../BrevmottakereBAKS';
import { BrevmottakerFeltProps } from '../brevmottakerFeltProps';
import { BrevmottakerFeltnavn } from '../brevmottakerFeltnavn';

type Props = BrevmottakerFeltProps;

export function MottakerFelt({ feltnavn, visningsnavn, erLesevisning }: Props) {
    const { control, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={feltnavn}
            rules={{
                required: 'Mottaker er påkrevd.',
                deps: [BrevmottakerFeltnavn.LANDKODE],
            }}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <Select
                        label={visningsnavn}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={visFeilmelding && fieldState.error?.message}
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
