import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { Mottakertype } from '../../../mottakertype';

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
};

export function NavnFelt({ feltnavn, visningsnavn, erLesevisning }: Props) {
    const { control, formState, getValues } = useFormContext();
    return (
        <Controller
            control={control}
            name={feltnavn}
            rules={{
                required: 'Navn på person eller organisasjon er påkrevd.',
                maxLength: {
                    value: 80,
                    message:
                        'Navn på personen eller organisasjon kan ikke inneholde mer enn 80 tegn.',
                },
            }}
            render={({ field, fieldState }) => {
                const mottakertype = getValues(BrevmottakerFeltnavn.MOTTAKERTYPE);
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <TextField
                        label={visningsnavn}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={
                            erLesevisning ||
                            mottakertype === Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE ||
                            mottakertype === Mottakertype.DØDSBO
                        }
                    />
                );
            }}
        />
    );
}
