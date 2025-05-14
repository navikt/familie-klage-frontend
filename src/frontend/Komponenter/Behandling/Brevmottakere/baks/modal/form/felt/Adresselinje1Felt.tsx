import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { Alert, TextField } from '@navikt/ds-react';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';

type Props = BrevmottakerFeltProps & {};

export function Adresselinje1Felt({ feltnavn, visningsnavn, erLesevisning = false }: Props) {
    const { control, watch } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: feltnavn,
        control,
        rules: {
            required: `${visningsnavn} er påkrevd.`,
            maxLength: {
                value: 80,
                message: `${visningsnavn} kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);
    const erLandValgt = landkode !== '';
    const erUtenlandskAdresseValgt = erLandValgt && landkode !== EøsLandkode.NO;

    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;

    return (
        <TextField
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={visFeilmelding && fieldState.error?.message}
            description={
                erUtenlandskAdresseValgt && (
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
