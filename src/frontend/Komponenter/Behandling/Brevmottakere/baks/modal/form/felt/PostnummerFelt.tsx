import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Postnummer';

export function PostnummerFelt({ erLesevisning = false }: Props) {
    const { control, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.POSTNUMMER,
        control,
        rules: {
            required:
                getValues(BrevmottakerFeltnavn.LANDKODE) === EøsLandkode.NO
                    ? `${label} er påkrevd om landet er Norge.`
                    : undefined,
            maxLength: { value: 4, message: `${label} må inneholde 4 tegn.` },
            minLength: { value: 4, message: `${label} må inneholde 4 tegn.` },
        },
    });

    return (
        <TextField
            htmlSize={4}
            maxLength={4}
            type={'number'}
            label={label}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
