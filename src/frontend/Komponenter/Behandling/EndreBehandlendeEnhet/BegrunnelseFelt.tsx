import React from 'react';
import { Textarea } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';
import { CustomFormErrors } from './EndreBehandlendeEnhetModal';

interface Props {
    lesevisning?: boolean;
    maksLengde?: number;
}

export function BegrunnelseFelt({ lesevisning = false, maksLengde = 4000 }: Props) {
    const { control, clearErrors } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: EndreBehandlendeEnhetFeltnavn.BEGRUNNELSE,
        control,
        rules: {
            required: 'Begrunnelse er påkrevd.',
            maxLength: {
                value: maksLengde,
                message: `Begrunnelse kan ikke overstige ${maksLengde} tegn.`,
            },
        },
    });

    return (
        <Textarea
            label={'Begrunnelse'}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(event) => {
                field.onChange(event.target.value);
                clearErrors(CustomFormErrors.onSubmitError.id);
            }}
            maxLength={maksLengde}
            readOnly={lesevisning || formState.isSubmitting}
            error={fieldState.error?.message}
        />
    );
}
