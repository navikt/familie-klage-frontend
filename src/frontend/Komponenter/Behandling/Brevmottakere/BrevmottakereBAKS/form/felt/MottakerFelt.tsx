import React from 'react';
import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { BrevmottakerMedAdresse, Mottaker, mottakerVisningsnavn } from '../../BrevmottakereBAKS';
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
    const mottaker = getValues(BrevmottakerFeltnavn.MOTTAKER);
    const alleredeValgteMottakerRoller = brevmottakere.map(
        (brevmottaker) => brevmottaker.mottakerRolle
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
                                value === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE ||
                                value === Mottaker.DØDSBO
                            ) {
                                setValue(BrevmottakerFeltnavn.NAVN, personopplysninger.navn);
                            }
                            if (
                                mottaker === Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE &&
                                value !== Mottaker.BRUKER_MED_UTENLANDSK_ADRESSE
                            ) {
                                setValue(BrevmottakerFeltnavn.NAVN, '');
                            }
                            if (mottaker === Mottaker.DØDSBO && value !== Mottaker.DØDSBO) {
                                setValue(BrevmottakerFeltnavn.NAVN, '');
                            }
                            field.onChange(event);
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning}
                    >
                        {Object.values(Mottaker)
                            .filter(
                                (mottaker) =>
                                    !alleredeValgteMottakerRoller.some((m) => m === mottaker)
                            )
                            .filter(
                                (mottaker) =>
                                    mottaker !== Mottaker.DØDSBO ||
                                    alleredeValgteMottakerRoller.length === 0
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
