import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import {
    BrevmottakerMedAdresse,
    Mottakertype,
    mottakerVisningsnavn,
} from '../../BrevmottakereBAKS';
import { BrevmottakerFeltProps } from '../brevmottakerFeltProps';
import { BrevmottakerFeltnavn } from '../brevmottakerFeltnavn';
import { IPersonopplysninger } from '../../../../../../App/typer/personopplysninger';

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerMedAdresse[];
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
                required: 'Mottaker er påkrevd.',
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
                            if (
                                value === Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE ||
                                value === Mottakertype.DØDSBO
                            ) {
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
                        {Object.values(Mottakertype)
                            .filter(
                                (mottaker) =>
                                    !alleredeValgteMottakertype.some((m) => m === mottaker)
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
