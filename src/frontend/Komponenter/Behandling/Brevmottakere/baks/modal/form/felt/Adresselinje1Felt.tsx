import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { Alert, TextField } from '@navikt/ds-react';
import { erUtanlandskEøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const visningsnavn = 'Adresselinje 1';

export function Adresselinje1Felt({ erLesevisning = false }: Props) {
    const { control, watch } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.ADRESSELINJE1,
        control,
        rules: {
            required: `${visningsnavn} er påkrevd.`,
            maxLength: {
                value: 80,
                message: `${visningsnavn} kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    const erUtenlandskLandkode = erUtanlandskEøsLandkode(watch(BrevmottakerFeltnavn.LANDKODE));

    return (
        <TextField
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={fieldState.error?.message}
            description={
                erUtenlandskLandkode && (
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
