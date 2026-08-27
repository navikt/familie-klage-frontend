import { Select } from '@navikt/ds-react';
import type { ChangeEvent } from 'react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { usePersonopplysningerContext } from '../../../../../../../App/context/PersonopplysningerContext';
import type { MottakerRolle } from '../../../../mottakerRolle';
import {
    erMottakerRolle,
    finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle,
    mottakerRolleVisningsnavn,
    skalPreutfylleNavnForMottakerRolle,
    utledGyldigeMottakerRollerBasertPåAlleredeValgteMottakerRoller,
} from '../../../../mottakerRolle';
import type { BrevmottakerPersonUtenIdentFormValues } from '../BrevmottakerPersonUtenIdentForm';
import { BrevmottakerPersonUtenIdentFeltnavn } from '../BrevmottakerPersonUtenIdentForm';

interface Props {
    valgteMottakerRoller: MottakerRolle[];
    erLesevisning?: boolean;
}

const label = 'Mottaker';

export function MottakerFelt({ valgteMottakerRoller, erLesevisning = false }: Props) {
    const { control, setValue, getValues, resetField } =
        useFormContext<BrevmottakerPersonUtenIdentFormValues>();

    const {
        fagsakEier: { navn },
    } = usePersonopplysningerContext();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            deps: [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE],
        },
    });

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        const mottakerRolle = event.target.value;
        const forrigeMottakerRolle = getValues(BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE);
        const landkode = getValues(BrevmottakerPersonUtenIdentFeltnavn.LANDKODE);
        if (!erMottakerRolle(mottakerRolle)) {
            if (skalPreutfylleNavnForMottakerRolle(forrigeMottakerRolle)) {
                resetField(BrevmottakerPersonUtenIdentFeltnavn.NAVN);
            }
            field.onChange('');
            return;
        }
        const nyttBrevmottakernavn = finnNyttBrevmottakernavnHvisNødvendigVedEndringAvMottakerRolle(
            mottakerRolle,
            forrigeMottakerRolle,
            landkode,
            navn
        );
        if (nyttBrevmottakernavn !== undefined) {
            setValue(BrevmottakerPersonUtenIdentFeltnavn.NAVN, nyttBrevmottakernavn);
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
            {gyldigeMottakerRoller.map(mottaker => (
                <option key={mottaker} value={mottaker}>
                    {mottakerRolleVisningsnavn[mottaker]}
                </option>
            ))}
        </Select>
    );
}
