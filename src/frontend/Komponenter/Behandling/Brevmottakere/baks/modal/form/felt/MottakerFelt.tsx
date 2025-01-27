import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import {
    MottakerRolle,
    mottakerRolleVisningsnavn,
    skalNavnVærePreutfyltForMottakerRolle,
    utledGyldigeMottakerRolle,
} from '../../../../mottakerRolle';
import {
    BrevmottakerPersonUtenIdent,
    utledPreutfyltBrevmottakerPersonUtenIdentNavn,
} from '../../../brevmottakerPersonUtenIdent';

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
    const { control, formState, setValue, getValues } = useFormContext();

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

    return (
        <Controller
            control={control}
            name={feltnavn}
            rules={{
                required: `${visningsnavn} er påkrevd.`,
                deps: [BrevmottakerFeltnavn.LANDKODE],
            }}
            render={({ field, fieldState }) => {
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
                        {utledGyldigeMottakerRolle(brevmottakere).map((mottaker) => (
                            <option key={mottaker} value={mottaker}>
                                {mottakerRolleVisningsnavn[mottaker]}
                            </option>
                        ))}
                    </Select>
                );
            }}
        />
    );
}
