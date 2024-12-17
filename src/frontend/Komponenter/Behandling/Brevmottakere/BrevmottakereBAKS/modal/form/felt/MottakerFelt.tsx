import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import {
    Brevmottaker,
    finnGyldigeMottakertyper,
    Mottakertype,
    mottakerVisningsnavn,
    utledNavn,
} from '../../../brevmottaker';

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
                            const [landkode, utfyltNavn] = getValues([
                                BrevmottakerFeltnavn.LANDKODE,
                                BrevmottakerFeltnavn.NAVN,
                            ]);
                            setValue(
                                BrevmottakerFeltnavn.NAVN,
                                utledNavn(
                                    utfyltNavn,
                                    personopplysninger.navn,
                                    landkode,
                                    value as Mottakertype
                                )
                            );
                            field.onChange(event);
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning}
                    >
                        <option value="">-- Velg mottaker --</option>
                        {finnGyldigeMottakertyper(brevmottakere).map((mottaker) => (
                            <option key={mottaker} value={mottaker}>
                                {mottakerVisningsnavn[mottaker]}
                            </option>
                        ))}
                    </Select>
                );
            }}
        />
    );
}
