import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Poststed';

export function PoststedFelt({ erLesevisning = false }: Props) {
    const { control, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.POSTSTED,
        control,
        rules: {
            required:
                getValues(BrevmottakerFeltnavn.LANDKODE) === EøsLandkode.NO
                    ? `${label} er påkrevd om landet er Norge.`
                    : undefined,
            maxLength: { value: 50, message: `${label} kan inneholde maks 50 tegn.` },
        },
    });

    return (
        <TextField
            label={label}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
