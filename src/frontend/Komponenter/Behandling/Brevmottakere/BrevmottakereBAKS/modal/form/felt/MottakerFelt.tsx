import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import {
    Brevmottaker,
    Mottakertype,
    mottakerVisningsnavn,
    utledNavnVedDødsbo,
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
    const mottakertype = getValues(BrevmottakerFeltnavn.MOTTAKERTYPE);
    const alleredeValgteMottakertype = brevmottakere.map(
        (brevmottaker) => brevmottaker.mottakertype
    );

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
                            if (value === Mottakertype.DØDSBO) {
                                const landkode = getValues(BrevmottakerFeltnavn.LANDKODE);
                                setValue(
                                    BrevmottakerFeltnavn.NAVN,
                                    utledNavnVedDødsbo(personopplysninger.navn, landkode)
                                );
                            }
                            if (value === Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE) {
                                setValue(BrevmottakerFeltnavn.NAVN, personopplysninger.navn);
                            }
                            if (
                                mottakertype === Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE &&
                                value !== Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE
                            ) {
                                setValue(BrevmottakerFeltnavn.NAVN, '');
                            }
                            if (
                                mottakertype === Mottakertype.DØDSBO &&
                                value !== Mottakertype.DØDSBO
                            ) {
                                setValue(BrevmottakerFeltnavn.NAVN, '');
                            }
                            field.onChange(event);
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning}
                    >
                        <option value="">-- Velg mottaker --</option>
                        {Object.values(Mottakertype)
                            .filter(
                                (mottakertype) =>
                                    !alleredeValgteMottakertype.some((m) => m === mottakertype)
                            )
                            .filter(
                                (mottaker) =>
                                    mottaker !== Mottakertype.DØDSBO ||
                                    alleredeValgteMottakertype.length === 0
                            )
                            .map((mottaker) => (
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
