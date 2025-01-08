import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { Brevmottaker, utledPreutfyltBrevmottakernavn } from '../../../brevmottaker';
import {
    Mottakertype,
    mottakertypeVisningsnavn,
    skalNavnVærePreutfyltForMottakertype,
    utledGyldigeMottakertyper,
} from '../../../mottakertype';

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
};

export function MottakerFelt({
    feltnavn,
    visningsnavn,
    personopplysninger,
    brevmottakere,
    erLesevisning,
}: Props) {
    const { control, formState, setValue, getValues } = useFormContext();

    function oppdatertNavnForMottakertypeHvisNødvendig(mottakertype: Mottakertype) {
        const [landkode, forrigeMottakertype] = getValues([
            BrevmottakerFeltnavn.LANDKODE,
            BrevmottakerFeltnavn.MOTTAKERTYPE,
        ]);

        const varNavnPreutfylt = skalNavnVærePreutfyltForMottakertype(forrigeMottakertype);
        const skalNavnPreutfylles = skalNavnVærePreutfyltForMottakertype(mottakertype);

        if (varNavnPreutfylt && !skalNavnPreutfylles) {
            setValue(BrevmottakerFeltnavn.NAVN, '');
        }

        if (skalNavnPreutfylles) {
            setValue(
                BrevmottakerFeltnavn.NAVN,
                utledPreutfyltBrevmottakernavn(personopplysninger.navn, landkode, mottakertype)
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
                            oppdatertNavnForMottakertypeHvisNødvendig(
                                Mottakertype[event.target.value as keyof typeof Mottakertype]
                            );
                            field.onChange(event);
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning || formState.isSubmitting}
                    >
                        <option value={''}>-- Velg mottaker --</option>
                        {utledGyldigeMottakertyper(brevmottakere).map((mottaker) => (
                            <option key={mottaker} value={mottaker}>
                                {mottakertypeVisningsnavn[mottaker]}
                            </option>
                        ))}
                    </Select>
                );
            }}
        />
    );
}
