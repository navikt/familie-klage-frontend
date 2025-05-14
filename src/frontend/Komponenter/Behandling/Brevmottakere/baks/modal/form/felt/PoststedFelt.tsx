import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn } from './felttyper';
import { BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const visningsnavn = 'Poststed';

export function PoststedFelt({ erLesevisning = false }: Props) {
    const { control, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.POSTSTED,
        control,
        rules: {
            required:
                getValues(BrevmottakerFeltnavn.LANDKODE) === EøsLandkode.NO
                    ? `${visningsnavn} er påkrevd om landet er Norge.`
                    : undefined,
            maxLength: { value: 50, message: `${visningsnavn} kan inneholde maks 50 tegn.` },
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
