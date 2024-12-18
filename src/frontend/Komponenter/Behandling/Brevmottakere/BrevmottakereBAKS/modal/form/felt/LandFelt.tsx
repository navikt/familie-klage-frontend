import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { Landvelger } from '../../../../../../../Felles/Landvelger/Landvelger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { utledNavnVedDødsbo } from '../../../brevmottaker';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { Mottakertype } from '../../../mottakertype';

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
};

export function LandFelt({ feltnavn, visningsnavn, erLesevisning, personopplysninger }: Props) {
    const { control, getValues, setValue, formState } = useFormContext();
    return (
        <Controller
            control={control}
            rules={{
                required: `${visningsnavn} er påkrevd.`,
                validate: (landkode) => {
                    const mottakertype = getValues(BrevmottakerFeltnavn.MOTTAKERTYPE);
                    if (
                        landkode === EøsLandkode.NO &&
                        mottakertype === Mottakertype.BRUKER_MED_UTENLANDSK_ADRESSE
                    ) {
                        return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                    }
                    return undefined;
                },
                deps: [BrevmottakerFeltnavn.POSTNUMMER, BrevmottakerFeltnavn.POSTSTED],
            }}
            name={feltnavn}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <Landvelger
                        label={visningsnavn}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onToggleSelected={(landkode, isSelected) => {
                            const mottakertype = getValues(BrevmottakerFeltnavn.MOTTAKERTYPE);
                            if (isSelected && mottakertype === Mottakertype.DØDSBO) {
                                setValue(
                                    BrevmottakerFeltnavn.NAVN,
                                    utledNavnVedDødsbo(personopplysninger.navn, landkode)
                                );
                            }
                            field.onChange(isSelected ? landkode : '');
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning}
                    />
                );
            }}
        />
    );
}
