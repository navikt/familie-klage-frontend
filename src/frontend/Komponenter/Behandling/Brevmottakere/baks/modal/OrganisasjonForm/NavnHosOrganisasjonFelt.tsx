import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import {
    BrevmottakerOrganisasjonFeltnavn,
    BrevmottakerOrganisasjonFormValues,
} from './BrevmottakerOrganisasjonForm';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Navn på kontaktperson hos organisasjonen';

export function NavnHosOrganisasjonFelt({ erLesevisning = false }: Props) {
    const { control } = useFormContext<BrevmottakerOrganisasjonFormValues>();

    const {
        field: { ref, value, onBlur, onChange },
        fieldState: { error },
        formState: { isSubmitting },
    } = useController({
        name: BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            maxLength: {
                value: 80,
                message: `${label} kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    return (
        <TextField
            label={label}
            ref={ref}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            error={error?.message}
            readOnly={erLesevisning || isSubmitting}
        />
    );
}
