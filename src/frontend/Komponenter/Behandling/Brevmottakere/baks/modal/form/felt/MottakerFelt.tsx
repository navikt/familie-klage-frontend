import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { Brevmottaker, utledBrevmottakernavn } from '../../../brevmottaker';
import { mottakertypeVisningsnavn, utledGyldigeMottakertyper } from '../../../mottakertype';

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
                            const value = event.target.value;
                            const [landkode, navn] = getValues([
                                BrevmottakerFeltnavn.LANDKODE,
                                BrevmottakerFeltnavn.NAVN,
                            ]);
                            setValue(
                                BrevmottakerFeltnavn.NAVN,
                                utledBrevmottakernavn(
                                    navn,
                                    personopplysninger.navn,
                                    landkode,
                                    value
                                )
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
