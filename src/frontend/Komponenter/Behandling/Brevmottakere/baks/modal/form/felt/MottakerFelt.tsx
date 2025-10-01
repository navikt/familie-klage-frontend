import React, { ChangeEvent } from 'react';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import {
    erMottakerRolle,
    finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle,
    MottakerRolle,
    mottakerRolleVisningsnavn,
    skalPreutfylleNavnForMottakerRolle,
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
    const { control, setValue, getValues, resetField } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.MOTTAKERROLLE,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            deps: [BrevmottakerFeltnavn.LANDKODE],
        },
    });

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        const mottakerRolle = event.target.value;
        const forrigeMottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
        const landkode = getValues(BrevmottakerFeltnavn.LANDKODE);
        if (!erMottakerRolle(mottakerRolle)) {
            if (skalPreutfylleNavnForMottakerRolle(forrigeMottakerRolle)) {
                resetField(BrevmottakerFeltnavn.NAVN);
            }
            field.onChange('');
            return;
        }
        const nyttBrevmottakernavn = finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle(
            mottakerRolle,
            forrigeMottakerRolle,
            landkode,
            personopplysninger
        );
        if (nyttBrevmottakernavn !== undefined) {
            setValue(BrevmottakerFeltnavn.NAVN, nyttBrevmottakernavn);
        }
        field.onChange(mottakerRolle);
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
