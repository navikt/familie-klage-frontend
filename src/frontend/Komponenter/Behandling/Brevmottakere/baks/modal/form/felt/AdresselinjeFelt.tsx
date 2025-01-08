import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { BrevmottakerFeltProps } from './felttyper';

type Props = BrevmottakerFeltProps & {
    valgfri?: boolean;
    beskrivelse?: React.ReactNode;
};

export function AdresselinjeFelt({
    feltnavn,
    visningsnavn,
    valgfri = true,
    beskrivelse = null,
    erLesevisning = false,
}: Props) {
    const { control, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={feltnavn}
            rules={{
                required: !valgfri ? `${visningsnavn} er påkrevd.` : undefined,
                maxLength: {
                    value: 80,
                    message: `${visningsnavn} kan ikke inneholde mer enn 80 tegn.`,
                },
            }}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <TextField
                        label={visningsnavn}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={visFeilmelding && fieldState.error?.message}
                        description={beskrivelse}
                        readOnly={erLesevisning || formState.isSubmitting}
                    />
                );
            }}
        />
    );
}
