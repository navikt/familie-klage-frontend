import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerFeltnavn, BrevmottakerFormState } from '../BrevmottakerForm';
import React from 'react';
import { Alert, TextField } from '@navikt/ds-react';

type Props = {
    name: keyof BrevmottakerFormState;
    label: string;
    erLesevisning: boolean;
};

export function PostnummerFelt({ name, label, erLesevisning }: Props) {
    const { control, getValues, formState } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required:
                    getValues()[BrevmottakerFeltnavn.LAND] === 'NO'
                        ? 'Postnummer er påkrevd om landet er Norge.'
                        : false,
                maxLength: { value: 4, message: 'Feltet må inneholde 4 tegn.' },
                minLength: { value: 4, message: 'Feltet må inneholde 4 tegn.' },
            }}
            render={({ field, fieldState }) => {
                const land = getValues()[BrevmottakerFeltnavn.LAND];
                const erAktiv = erLesevisning || (land !== 'NO' && land !== '');
                return (
                    <TextField
                        htmlSize={4}
                        maxLength={4}
                        type={'number'}
                        label={label}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={
                            (fieldState.isDirty || fieldState.isTouched || formState.isSubmitted) &&
                            fieldState.error?.message
                        }
                        description={
                            erAktiv && (
                                <Alert size={'small'} inline={true} variant={'info'}>
                                    Ved utenlandsk adresse skal postnummer skrives direkte i
                                    adressefeltet.
                                </Alert>
                            )
                        }
                        readOnly={erAktiv}
                    />
                );
            }}
        />
    );
}
