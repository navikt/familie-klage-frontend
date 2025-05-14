import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const visningsnavn = 'Postnummer';

export function PostnummerFelt({ erLesevisning = false }: Props) {
    const { control, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.POSTNUMMER,
        control,
        rules: {
            required:
                getValues(BrevmottakerFeltnavn.LANDKODE) === EøsLandkode.NO
                    ? `${visningsnavn} er påkrevd om landet er Norge.`
                    : undefined,
            maxLength: { value: 4, message: `${visningsnavn} må inneholde 4 tegn.` },
            minLength: { value: 4, message: `${visningsnavn} må inneholde 4 tegn.` },
        },
    });

    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;

    return (
        <TextField
            htmlSize={4}
            maxLength={4}
            type={'number'}
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={visFeilmelding && fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
