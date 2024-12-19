import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Landvelger } from '../../../../../../../Felles/Landvelger/Landvelger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { utledBrevmottakernavnVedDødsbo } from '../../../brevmottaker';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { erGyldigMottakertypeForLandekode, Mottakertype } from '../../../mottakertype';

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
                    if (!erGyldigMottakertypeForLandekode(mottakertype, landkode)) {
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
                                    utledBrevmottakernavnVedDødsbo(
                                        personopplysninger.navn,
                                        landkode
                                    )
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