import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { Alert, TextField } from '@navikt/ds-react';
import { erUtenlandskEøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Adresselinje 1';

export function Adresselinje1Felt({ erLesevisning = false }: Props) {
    const { control, watch } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.ADRESSELINJE1,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            maxLength: {
                value: 80,
                message: `${label} kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);

    return (
        <TextField
            label={label}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={fieldState.error?.message}
            description={
                erUtenlandskEøsLandkode(landkode) && (
                    <Alert size={'small'} inline={true} variant={'info'}>
                        Ved utenlandsk adresse skal postnummer og poststed skrives direkte i
                        adressefeltet.
                    </Alert>
                )
            }
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
