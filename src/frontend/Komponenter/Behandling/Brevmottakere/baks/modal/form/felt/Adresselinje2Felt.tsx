import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { BrevmottakerFeltProps } from './felttyper';

type Props = BrevmottakerFeltProps & {};

const visningsnavn = 'Adresselinje 2 (valgfri)';

export function Adresselinje2Felt({ feltnavn, erLesevisning = false }: Props) {
    const { control } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: feltnavn,
        control,
        rules: {
            maxLength: {
                value: 80,
                message: `${visningsnavn} kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

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
}
