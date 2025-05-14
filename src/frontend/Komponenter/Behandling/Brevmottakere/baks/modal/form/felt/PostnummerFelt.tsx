import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';

type Props = BrevmottakerFeltProps;

const visningsnavn = 'Postnummer';

export function PostnummerFelt({ feltnavn, erLesevisning }: Props) {
    const { control, getValues } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: feltnavn,
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
