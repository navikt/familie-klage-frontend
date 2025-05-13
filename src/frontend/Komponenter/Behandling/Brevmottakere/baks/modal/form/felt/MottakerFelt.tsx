import React from 'react';
import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
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

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
};

export function MottakerFelt({
    feltnavn,
    visningsnavn,
    personopplysninger,
    brevmottakere,
    erLesevisning,
}: Props) {
    const { control, setValue, getValues } = useFormContext();

    const { field, fieldState, formState } = useController({
        name: feltnavn,
        control,
        rules: {
            required: `${visningsnavn} er påkrevd.`,
            deps: [BrevmottakerFeltnavn.LANDKODE],
        },
    });

    function oppdatertNavnForMottakerRolleHvisNødvendig(mottakerRolle: MottakerRolle) {
        const [landkode, forrigeMottakerRolle] = getValues([
            BrevmottakerFeltnavn.LANDKODE,
            BrevmottakerFeltnavn.MOTTAKERROLLE,
        ]);

        const varNavnPreutfylt = skalNavnVærePreutfyltForMottakerRolle(forrigeMottakerRolle);
        const skalNavnPreutfylles = skalNavnVærePreutfyltForMottakerRolle(mottakerRolle);

        if (varNavnPreutfylt && !skalNavnPreutfylles) {
            setValue(BrevmottakerFeltnavn.NAVN, '');
        }

        if (skalNavnPreutfylles) {
            setValue(
                BrevmottakerFeltnavn.NAVN,
                utledPreutfyltBrevmottakerPersonUtenIdentNavn(
                    personopplysninger.navn,
                    landkode,
                    mottakerRolle
                )
            );
        }
    }

    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;

    return (
        <Select
            label={visningsnavn}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(event) => {
                const value = event.target.value as keyof typeof MottakerRolle;
                oppdatertNavnForMottakerRolleHvisNødvendig(MottakerRolle[value]);
                field.onChange(event);
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
