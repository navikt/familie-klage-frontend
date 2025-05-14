import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const visningsnavn = 'Adresselinje 2 (valgfri)';

export function Adresselinje2Felt({ erLesevisning = false }: Props) {
    const { control } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.ADRESSELINJE2,
        control,
        rules: {
            maxLength: {
                value: 80,
                message: `${visningsnavn} kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    return (
        <TextField
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
