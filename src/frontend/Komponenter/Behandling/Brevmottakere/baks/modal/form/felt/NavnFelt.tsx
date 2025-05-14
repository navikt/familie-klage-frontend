import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { skalPreutfylleNavnForMottakerRolle } from '../../../../mottakerRolle';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Navn';

export function NavnFelt({ erLesevisning = false }: Props) {
    const { control, watch } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.NAVN,
        control,
        rules: {
            required: `${label} på person eller organisasjon er påkrevd.`,
            maxLength: {
                value: 80,
                message: `${label} på personen eller organisasjon kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    const navnSkalVærePreutfylt = skalPreutfylleNavnForMottakerRolle(
        watch(BrevmottakerFeltnavn.MOTTAKERROLLE)
    );

    return (
        <TextField
            label={label}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={fieldState.error?.message}
            readOnly={erLesevisning || navnSkalVærePreutfylt || formState.isSubmitting}
        />
    );
}
