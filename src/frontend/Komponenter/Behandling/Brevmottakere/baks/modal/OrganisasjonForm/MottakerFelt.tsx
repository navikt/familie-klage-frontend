import React from 'react';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import {
    BrevmottakerOrganisasjonFeltnavn,
    BrevmottakerOrganisasjonFormValues,
} from './BrevmottakerOrganisasjonForm';
import { MottakerRolle, mottakerRolleVisningsnavn } from '../../../mottakerRolle';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Mottakerrolle';

export function MottakerFelt({ erLesevisning = false }: Props) {
    const { control } = useFormContext<BrevmottakerOrganisasjonFormValues>();

    const {
        field: { ref, value, onBlur, onChange },
        fieldState: { error },
        formState: { isSubmitting },
    } = useController({
        name: BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE,
        control,
        rules: {
            required: `${label} er påkrevd.`,
        },
    });

    const gyldigeMottakerRoller = [MottakerRolle.FULLMAKT];

    return (
        <Select
            label={label}
            ref={ref}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            error={error?.message}
            readOnly={erLesevisning || isSubmitting}
        >
            <option value={''} disabled={true}>
                -- Velg mottaker --
            </option>
            {gyldigeMottakerRoller.map((mottaker) => (
                <option key={mottaker} value={mottaker}>
                    {mottakerRolleVisningsnavn[mottaker]}
                </option>
            ))}
        </Select>
    );
}
