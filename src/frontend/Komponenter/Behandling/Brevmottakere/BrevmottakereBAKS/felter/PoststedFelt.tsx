import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFeltnavn, BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { Alert, TextField } from '@navikt/ds-react';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function PoststedFelt({ name, label, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required:
                    getValues()[BrevmottakerFeltnavn.LAND] === 'NO'
                        ? 'Poststed er påkrevd om landet er Norge.'
                        : false,
                maxLength: { value: 50, message: 'Maks 50 tegn.' },
            }}
            render={({ field, fieldState }) => {
                const land = getValues()[BrevmottakerFeltnavn.LAND];
                const erAktiv = !erLesevisning && (land === 'NO' || land === '');
                return (
                    <TextField
                        label={label}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={
                            (fieldState.isTouched || formState.isSubmitted) &&
                            fieldState.error?.message
                        }
                        description={
                            !erAktiv && (
                                <Alert size={'small'} inline={true} variant={'info'}>
                                    Ved utenlandsk adresse skal postnummer skrives direkte i
                                    adressefeltet.
                                </Alert>
                            )
                        }
                        readOnly={!erAktiv}
                    />
                );
            }}
        />
    );
}
