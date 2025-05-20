import React, { ChangeEvent } from 'react';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import {
    erMottakerRolle,
    finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle,
    MottakerRolle,
    mottakerRolleVisningsnavn,
    utledGyldigeMottakerRollerBasertPåAlleredeValgteMottakerRoller,
} from '../../../../mottakerRolle';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    personopplysninger: IPersonopplysninger;
    valgteMottakerRoller: MottakerRolle[];
    erLesevisning?: boolean;
}

const label = 'Mottaker';

export function MottakerFelt({
    personopplysninger,
    valgteMottakerRoller,
    erLesevisning = false,
}: Props) {
    const { control, setValue, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.MOTTAKERROLLE,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            deps: [BrevmottakerFeltnavn.LANDKODE],
        },
    });

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        if (erMottakerRolle(value)) {
            const nyMottakerRolle = value;
            const forrigeMottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
            const landkode = getValues(BrevmottakerFeltnavn.LANDKODE);
            const nyttBrevmottakernavn =
                finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle(
                    nyMottakerRolle,
                    forrigeMottakerRolle,
                    landkode,
                    personopplysninger
                );
            if (nyttBrevmottakernavn !== undefined) {
                setValue(BrevmottakerFeltnavn.NAVN, nyttBrevmottakernavn);
            }
            field.onChange(value);
        } else {
            field.onChange('');
        }
    }

    const gyldigeMottakerRoller =
        utledGyldigeMottakerRollerBasertPåAlleredeValgteMottakerRoller(valgteMottakerRoller);

    return (
        <Select
            label={label}
            value={field.value}
            onBlur={field.onBlur}
            onChange={onChange}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        >
            <option value={''}>-- Velg mottaker --</option>
            {gyldigeMottakerRoller.map((mottaker) => (
                <option key={mottaker} value={mottaker}>
                    {mottakerRolleVisningsnavn[mottaker]}
                </option>
            ))}
        </Select>
    );
}
