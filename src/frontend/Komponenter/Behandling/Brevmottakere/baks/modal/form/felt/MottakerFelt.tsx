import React, { ChangeEvent } from 'react';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import {
    BlankMottakerRolle,
    MottakerRolle,
    mottakerRolleVisningsnavn,
    skalPreutfylleNavnForMottakerRolle,
} from '../../../../mottakerRolle';
import {
    BrevmottakerPersonUtenIdent,
    utledGyldigeMottakerRolleForBrevmottakerPersonUtenIdent,
    utledPreutfyltBrevmottakerPersonUtenIdentNavn,
} from '../../../../brevmottaker';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';

interface Props {
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
    erLesevisning?: boolean;
}

const label = 'Mottaker';

export function MottakerFelt({ personopplysninger, brevmottakere, erLesevisning = false }: Props) {
    const { control, setValue, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.MOTTAKERROLLE,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            deps: [BrevmottakerFeltnavn.LANDKODE],
        },
    });

    function oppdaterBrevmottakernavnBasertPåMottakerRolleHvisNødvendig(
        nyMottakerRolle: MottakerRolle | BlankMottakerRolle
    ) {
        const landkode = getValues(BrevmottakerFeltnavn.LANDKODE);
        const forrigeMottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);

        const varNavnPreutfylt = skalPreutfylleNavnForMottakerRolle(forrigeMottakerRolle);
        const skalNavnPreutfylles = skalPreutfylleNavnForMottakerRolle(nyMottakerRolle);

        if (varNavnPreutfylt && !skalNavnPreutfylles) {
            setValue(BrevmottakerFeltnavn.NAVN, '');
        }

        if (skalNavnPreutfylles && nyMottakerRolle !== '') {
            const nyttNavn = utledPreutfyltBrevmottakerPersonUtenIdentNavn(
                personopplysninger.navn,
                landkode === '' ? EøsLandkode.NO : landkode,
                nyMottakerRolle
            );
            setValue(BrevmottakerFeltnavn.NAVN, nyttNavn);
        }
    }

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        const nyMottakerRolle = value as BrevmottakerFormValues[BrevmottakerFeltnavn.MOTTAKERROLLE];
        oppdaterBrevmottakernavnBasertPåMottakerRolleHvisNødvendig(nyMottakerRolle);
        field.onChange(nyMottakerRolle);
    }

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
            {utledGyldigeMottakerRolleForBrevmottakerPersonUtenIdent(brevmottakere).map(
                (mottaker) => (
                    <option key={mottaker} value={mottaker}>
                        {mottakerRolleVisningsnavn[mottaker]}
                    </option>
                )
            )}
        </Select>
    );
}
