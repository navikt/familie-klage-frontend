import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { Mottaker, mottakerVisningsnavn } from '../../BrevmottakereBAKS';
import { BrevmottakerFeltProps } from '../brevmottakerFeltProps';
import { BrevmottakerFeltnavn } from '../brevmottakerFeltnavn';
import { IPersonopplysninger } from '../../../../../../App/typer/personopplysninger';

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
};

export function MottakerFelt({ feltnavn, visningsnavn, personopplysninger, erLesevisning }: Props) {
    const { control, formState, setValue, getValues } = useFormContext();
    const mottaker = getValues(BrevmottakerFeltnavn.MOTTAKER);
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
                        onChange={(event) => {
                            const value = event.target.value;
                            if (value === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE) {
                                setValue(BrevmottakerFeltnavn.NAVN, personopplysninger.navn);
                            }
                            if (
                                mottaker === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE &&
                                value !== Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE
                            ) {
                                setValue(BrevmottakerFeltnavn.NAVN, '');
                            }
                            field.onChange(event);
                        }}
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
