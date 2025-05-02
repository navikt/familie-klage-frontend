import React from 'react';
import { finnGyldigeArbeidsfordelingsenheterForFagsystem } from './arbeidsfordelingsenhet';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { Behandling } from '../../../App/typer/fagsak';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';

interface Props {
    behandling: Behandling;
    lesevisning?: boolean;
}

export function EnhetsnummerFelt({ behandling, lesevisning = false }: Props) {
    const { control } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER,
        control,
        rules: {
            required: 'Enhet er påkrevd.',
            validate: (enhetsnummer) => {
                if (enhetsnummer === behandling.behandlendeEnhet) {
                    return 'Enheten er allerede satt på behandlingen.';
                }
                return undefined;
            },
        },
    });

    return (
        <Select
            label={'Velg ny enhet'}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            ref={field.ref}
            onChange={(event) => field.onChange(event.target.value)}
            readOnly={lesevisning || formState.isSubmitting}
            error={fieldState.error?.message}
        >
            {finnGyldigeArbeidsfordelingsenheterForFagsystem(behandling.fagsystem).map((enhet) => (
                <option key={enhet.enhetsnummer} value={enhet.enhetsnummer}>
                    {`${enhet.enhetsnummer} ${enhet.enhetsnavn}`}
                </option>
            ))}
        </Select>
    );
}
