import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { TextField } from '@navikt/ds-react';
import { MottakerRolle } from '../../../../mottakerRolle';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    erLesevisning?: boolean;
}

const visningsnavn = 'Navn';

export function NavnFelt({ erLesevisning = false }: Props) {
    const { control, watch } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.NAVN,
        control,
        rules: {
            required: `${visningsnavn} på person eller organisasjon er påkrevd.`,
            maxLength: {
                value: 80,
                message: `${visningsnavn} på personen eller organisasjon kan ikke inneholde mer enn 80 tegn.`,
            },
        },
    });

    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;

    const mottakerRolle = watch(BrevmottakerFeltnavn.MOTTAKERROLLE);

    const navnSkalVærePreutfylt =
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE ||
        mottakerRolle === MottakerRolle.DØDSBO;

    return (
        <TextField
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={visFeilmelding && fieldState.error?.message}
            readOnly={erLesevisning || navnSkalVærePreutfylt || formState.isSubmitting}
        />
    );
}
