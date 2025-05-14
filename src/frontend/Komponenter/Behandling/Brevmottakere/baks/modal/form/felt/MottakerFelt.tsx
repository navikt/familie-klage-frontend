import React from 'react';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn } from './felttyper';
import {
    MottakerRolle,
    mottakerRolleVisningsnavn,
    skalNavnVærePreutfyltForMottakerRolle,
} from '../../../../mottakerRolle';
import {
    BrevmottakerPersonUtenIdent,
    utledGyldigeMottakerRolleForBrevmottakerPersonUtenIdent,
    utledPreutfyltBrevmottakerPersonUtenIdentNavn,
} from '../../../../brevmottaker';
import { BrevmottakerFormValues } from '../BrevmottakerForm';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';

interface Props {
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
    erLesevisning?: boolean;
}

const visningsnavn = 'Mottaker';

export function MottakerFelt({ personopplysninger, brevmottakere, erLesevisning = false }: Props) {
    const { control, setValue, getValues } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.MOTTAKERROLLE,
        control,
        rules: {
            required: `${visningsnavn} er påkrevd.`,
            deps: [BrevmottakerFeltnavn.LANDKODE],
        },
    });

    function oppdatertNavnForMottakerRolleHvisNødvendig(nyMottakerRolle: MottakerRolle | '') {
        const landkode = getValues(BrevmottakerFeltnavn.LANDKODE);
        const forrigeMottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);

        const varNavnPreutfylt =
            forrigeMottakerRolle !== '' &&
            skalNavnVærePreutfyltForMottakerRolle(forrigeMottakerRolle);

        const skalNavnPreutfylles =
            nyMottakerRolle !== '' && skalNavnVærePreutfyltForMottakerRolle(nyMottakerRolle);

        if (varNavnPreutfylt && !skalNavnPreutfylles) {
            setValue(BrevmottakerFeltnavn.NAVN, '');
        }

        if (skalNavnPreutfylles) {
            const nyttNavn = utledPreutfyltBrevmottakerPersonUtenIdentNavn(
                personopplysninger.navn,
                landkode === '' ? EøsLandkode.NO : landkode,
                nyMottakerRolle
            );
            setValue(BrevmottakerFeltnavn.NAVN, nyttNavn);
        }
    }

    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;

    return (
        <Select
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(event) => {
                const nyMottakerRolle = event.target
                    .value as BrevmottakerFormValues[BrevmottakerFeltnavn.MOTTAKERROLLE];
                oppdatertNavnForMottakerRolleHvisNødvendig(nyMottakerRolle);
                field.onChange(nyMottakerRolle);
            }}
            error={visFeilmelding && fieldState.error?.message}
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
